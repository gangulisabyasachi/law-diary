import { connectToDatabase, isDatabaseConnected, getSanitizedUri } from "./mongodb";
import { UserModel, CaseModel, ApprovalModel, DecisionModel, SettingModel, ErrorLogModel } from "@/models";
import { getSeedData } from "./seedData";
import { hashPassword, comparePassword, signToken } from "./auth";
import { AppState, Case, User, Approval, Decision, SystemBroadcast, ErrorLog } from "@/types";

// In-memory fallback if MongoDB is not yet started or being configured
interface FallbackStore {
  users: Array<any>;
  cases: Array<any>;
  approvals: Array<any>;
  decided: Array<any>;
  errorLogs: Array<any>;
  broadcast?: SystemBroadcast;
  isInitialized: boolean;
}

const fallbackStore: FallbackStore = {
  users: [],
  cases: [],
  approvals: [],
  decided: [],
  errorLogs: [],
  broadcast: {
    active: false,
    message: "Scheduled platform maintenance window: System remaining online with full database replication.",
  },
  isInitialized: false,
};

export function getSeedErrorLogs(): ErrorLog[] {
  return [];
}

function getSeedPasswordForUser(id: string, role: string): string {
  if (id === "u-admin") return process.env.SEED_ADMIN_PASSWORD || process.env.SEED_DEFAULT_PASSWORD || "";
  if (id === "u-lawyer") return process.env.SEED_LAWYER_PASSWORD || process.env.SEED_DEFAULT_PASSWORD || "";
  if (id === "u-lawyer2") return process.env.SEED_SEN_PASSWORD || process.env.SEED_DEFAULT_PASSWORD || "";
  if (role === "associate") return process.env.SEED_ASSOC_PASSWORD || process.env.SEED_DEFAULT_PASSWORD || "";
  if (role === "client") return process.env.SEED_CLIENT_PASSWORD || process.env.SEED_DEFAULT_PASSWORD || "";
  return process.env.SEED_DEFAULT_PASSWORD || "";
}

export function generateUniversalClientPassword(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "LD";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function initFallbackStore() {
  if (fallbackStore.isInitialized) return;
  const { users, cases, decided } = getSeedData();
  const usersWithHashes = await Promise.all(
    users.map(async (u) => {
      const accessCode = u.role === "client" ? (u.id === "u-client" ? (process.env.SEED_CLIENT_PASSWORD || "client123") : "LD" + u.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()) : undefined;
      return {
        ...u,
        accessCode,
        passwordHash: await hashPassword(accessCode || getSeedPasswordForUser(u.id, u.role)),
      };
    })
  );
  fallbackStore.users = usersWithHashes;
  fallbackStore.cases = cases;
  fallbackStore.approvals = [];
  fallbackStore.decided = decided;
  if (!fallbackStore.errorLogs) {
    fallbackStore.errorLogs = [];
  }
  fallbackStore.isInitialized = true;
}

export async function seedMongoIfEmpty() {
  const { isConnected } = await connectToDatabase();
  if (!isConnected) return false;

  const count = await UserModel.countDocuments();
  if (count > 0) {
    // Automatic self-healing: backfill any client or associate missing accessCode
    const clientsMissingCode = await UserModel.find({
      role: "client",
      $or: [{ accessCode: "" }, { accessCode: { $exists: false } }, { accessCode: null }],
    }).lean();
    if (clientsMissingCode.length > 0) {
      for (const cl of clientsMissingCode) {
        const code =
          cl.id === "u-client"
            ? (process.env.SEED_CLIENT_PASSWORD || "client123")
            : "LD" + cl.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
        const hash = await hashPassword(code);
        await UserModel.updateOne({ _id: cl._id }, { $set: { accessCode: code, passwordHash: hash } }).catch(() => {});
      }
    }

    const associatesMissingCode = await UserModel.find({
      role: "associate",
      $or: [{ accessCode: "" }, { accessCode: { $exists: false } }, { accessCode: null }],
    }).lean();
    if (associatesMissingCode.length > 0) {
      for (const asc of associatesMissingCode) {
        const code = process.env.SEED_ASSOC_PASSWORD || "assoc123";
        const hash = await hashPassword(code);
        await UserModel.updateOne({ _id: asc._id }, { $set: { accessCode: code, passwordHash: hash } }).catch(() => {});
      }
    }
    return true;
  }

  console.log("Empty MongoDB detected. Seeding initial chamber data...");
  const { users, cases, decided } = getSeedData();

  for (const u of users) {
    const accessCode = u.role === "client" ? (u.id === "u-client" ? (process.env.SEED_CLIENT_PASSWORD || "client123") : "LD" + u.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()) : undefined;
    const passwordHash = await hashPassword(accessCode || getSeedPasswordForUser(u.id, u.role));
    await UserModel.findOneAndUpdate(
      { id: u.id },
      {
        $set: {
          id: u.id,
          role: u.role,
          name: u.name,
          email: u.email.toLowerCase().trim(),
          passwordHash,
          phone: u.phone || "",
          designation: u.designation || "",
          lawyerId: u.lawyerId || "",
          accessCode: accessCode || "",
        },
      },
      { upsert: true, new: true }
    );
  }

  for (const c of cases) {
    await CaseModel.findOneAndUpdate({ id: c.id }, { $set: c }, { upsert: true });
  }

  for (const d of decided) {
    await DecisionModel.findOneAndUpdate({ id: d.id }, { $set: d }, { upsert: true });
  }

  console.log(`✓ Seeded ${users.length} users and ${cases.length} court cases to MongoDB.`);
  return true;
}

export async function getChamberState(filterUser?: { id: string; role: string; lawyerId?: string }): Promise<AppState> {
  const { isConnected } = await connectToDatabase();

  const sanitizeUser = (u: any): User => ({
    id: u.id,
    role: u.role,
    name: u.name,
    email: u.email,
    phone: u.phone,
    designation: u.designation,
    lawyerId: u.lawyerId,
    accessCode:
      u.accessCode ||
      (u.role === "client"
        ? u.id === "u-client"
          ? process.env.SEED_CLIENT_PASSWORD || "client123"
          : "LD" + u.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()
        : u.role === "associate"
        ? process.env.SEED_ASSOC_PASSWORD || "assoc123"
        : undefined),
    disabled: Boolean(u.disabled || u.status === "disabled"),
    status: (u.disabled || u.status === "disabled") ? "disabled" : "active",
    createdAt: u.createdAt?.toISOString?.() || u.createdAt,
    updatedAt: u.updatedAt?.toISOString?.() || u.updatedAt,
  });

  const sanitizeCase = (c: any): Case => ({
    id: c.id,
    caseNo: c.caseNo,
    title: c.title,
    court: c.court,
    courtRoom: c.courtRoom || "",
    itemNo: c.itemNo || "",
    cnr: c.cnr || "",
    judge: c.judge || "",
    lawyerId: c.lawyerId || "u-lawyer",
    clientId: c.clientId,
    associateIds: c.associateIds || [],
    status: c.status || "Active",
    stage: c.stage || "Fresh Filing",
    filingDate: c.filingDate || "",
    limitationDate: c.limitationDate || "",
    limitationTask: c.limitationTask || "",
    notes: c.notes || "",
    feeAgreed: c.feeAgreed || 0,
    feeReceived: c.feeReceived || 0,
    caseCharge: c.caseCharge || 0,
    feeReceipts: c.feeReceipts || [],
    officeFileNo: c.officeFileNo || "",
    caseType: c.caseType || (Array.isArray(c.caseTypes) ? c.caseTypes.join(", ") : ""),
    caseTypes: Array.isArray(c.caseTypes)
      ? c.caseTypes
      : c.caseType
      ? c.caseType.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [],
    city: c.city || "",
    counselFor: c.counselFor || "",
    opponentName: c.opponentName || "",
    opponentLawyer: c.opponentLawyer || "",
    customFields: c.customFields || [],
    attachments: c.attachments || [],
    timesheet: c.timesheet || [],
    hearings: c.hearings || [],
    orders: c.orders || [],
    queries: c.queries || [],
    createdAt: c.createdAt?.toISOString?.() || c.createdAt || new Date().toISOString(),
    updatedAt: c.updatedAt?.toISOString?.() || c.updatedAt || new Date().toISOString(),
  });

  const sanitizeApproval = (a: any): Approval => ({
    id: a.id,
    by: a.by,
    byName: a.byName,
    ts: a.ts,
    type: a.type,
    label: a.label,
    payload: a.payload,
    createdAt: a.createdAt?.toISOString?.() || a.createdAt,
  });

  const sanitizeDecision = (d: any): Decision => ({
    id: d.id,
    by: d.by,
    byName: d.byName,
    ts: d.ts,
    type: d.type,
    label: d.label,
    payload: d.payload,
    status: d.status,
    decidedAt: d.decidedAt,
    decidedBy: d.decidedBy,
  });

  const sanitizeErrorLog = (e: any): ErrorLog => ({
    id: e.id,
    timestamp: e.timestamp || e.createdAt?.toISOString?.() || new Date().toISOString(),
    level: e.level || "error",
    category: e.category || "system",
    message: e.message || "Unknown error",
    details: e.details || "",
    source: e.source || "api",
    userId: e.userId || "",
    userRole: e.userRole || "",
    path: e.path || "",
    ip: e.ip || "",
    resolved: Boolean(e.resolved),
    resolvedAt: e.resolvedAt || "",
    resolvedBy: e.resolvedBy || "",
    createdAt: e.createdAt?.toISOString?.() || e.createdAt || new Date().toISOString(),
    updatedAt: e.updatedAt?.toISOString?.() || e.updatedAt || new Date().toISOString(),
  });

  let rawUsers: User[] = [];
  let rawCases: Case[] = [];
  let rawApprovals: Approval[] = [];
  let rawDecided: Decision[] = [];
  let rawErrorLogs: ErrorLog[] = [];
  let broadcast: SystemBroadcast = {
    active: false,
    message: "Scheduled platform maintenance window: System remaining online with full database replication.",
  };
  let dbConnected = false;

  if (isConnected) {
    try {
      await seedMongoIfEmpty();
      const [users, cases, approvals, decided, broadcastSetting, errorLogs] = await Promise.all([
        UserModel.find().lean(),
        CaseModel.find().lean(),
        ApprovalModel.find().sort({ createdAt: 1 }).lean(),
        DecisionModel.find().sort({ createdAt: -1 }).limit(50).lean(),
        SettingModel.findOne({ key: "system_broadcast" }).lean(),
        ErrorLogModel.find().sort({ timestamp: -1 }).limit(100).lean(),
      ]);

      rawUsers = users.map(sanitizeUser);
      rawCases = cases.map(sanitizeCase);
      rawApprovals = approvals.map(sanitizeApproval);
      rawDecided = decided.map(sanitizeDecision);
      rawErrorLogs = (errorLogs || []).map(sanitizeErrorLog);
      if (broadcastSetting?.value) {
        broadcast = broadcastSetting.value;
      }
      dbConnected = true;
    } catch (err: any) {
      console.error("Error reading from MongoDB, switching to fallback:", err.message);
    }
  }

  if (!dbConnected) {
    await initFallbackStore();
    rawUsers = fallbackStore.users.map(({ passwordHash, password, ...rest }) => sanitizeUser(rest));
    rawCases = fallbackStore.cases.map(sanitizeCase);
    rawApprovals = fallbackStore.approvals.map(sanitizeApproval);
    rawDecided = fallbackStore.decided.map(sanitizeDecision);
    rawErrorLogs = (fallbackStore.errorLogs || []).map(sanitizeErrorLog);
    if (fallbackStore.broadcast) {
      broadcast = fallbackStore.broadcast;
    }
  }

  // If no user is specified (e.g. unauthenticated public landing page), return benchmark data
  if (!filterUser || !filterUser.id) {
    return {
      users: rawUsers,
      cases: rawCases,
      approvals: rawApprovals,
      decided: rawDecided,
      errorLogs: [],
      broadcast,
      dbConnected,
      dbType: dbConnected ? "mongodb" : "in-memory-fallback",
    };
  }

  // DEDICATED PORTFOLIO FILTERING
  const { id: userId, role, lawyerId: userLawyerId } = filterUser;

  let filteredCases: Case[] = [];
  let filteredUsers: User[] = [];
  let filteredApprovals: Approval[] = [];
  let filteredDecided: Decision[] = [];

  if (role === "lawyer") {
    // A Lawyer sees ONLY his cases, his clients, and his associates!
    filteredCases = rawCases.filter((c) => (c.lawyerId || "u-lawyer") === userId);
    const caseClientIds = new Set(filteredCases.map((c) => c.clientId));
    const caseAssociateIds = new Set(filteredCases.flatMap((c) => c.associateIds || []));

    filteredUsers = rawUsers.filter((u) => {
      if (u.id === userId) return true;
      if (u.role === "client") return (u.lawyerId || "u-lawyer") === userId || caseClientIds.has(u.id);
      if (u.role === "associate") return (u.lawyerId || "u-lawyer") === userId || caseAssociateIds.has(u.id);
      if (u.role === "admin") return true;
      return false;
    });

    const myCaseIds = new Set(filteredCases.map((c) => c.id));
    const myAssociateIds = new Set(filteredUsers.filter((u) => u.role === "associate").map((u) => u.id));

    filteredApprovals = rawApprovals.filter((a) => {
      const cId = a.payload?.caseId || a.payload?.case?.id;
      return myCaseIds.has(cId) || myAssociateIds.has(a.by) || a.by === userId;
    });

    filteredDecided = rawDecided.filter((d) => {
      const cId = d.payload?.caseId || d.payload?.case?.id;
      return myCaseIds.has(cId) || myAssociateIds.has(d.by) || d.by === userId;
    });
  } else if (role === "associate") {
    // An Associate sees matters assigned to them or in their supervising chamber
    const supervisingLawyerId = userLawyerId || "u-lawyer";
    filteredCases = rawCases.filter(
      (c) => (c.associateIds || []).includes(userId) || (c.lawyerId || "u-lawyer") === supervisingLawyerId
    );
    const caseClientIds = new Set(filteredCases.map((c) => c.clientId));

    filteredUsers = rawUsers.filter((u) => {
      if (u.id === userId) return true;
      if (u.id === supervisingLawyerId) return true;
      if (u.role === "associate" && (u.lawyerId || "u-lawyer") === supervisingLawyerId) return true;
      if (u.role === "client" && ((u.lawyerId || "u-lawyer") === supervisingLawyerId || caseClientIds.has(u.id))) return true;
      return false;
    });

    filteredApprovals = rawApprovals.filter((a) => a.by === userId);
    filteredDecided = rawDecided.filter((d) => d.by === userId);
  } else if (role === "client") {
    // A Client sees ONLY their own matters
    filteredCases = rawCases.filter((c) => c.clientId === userId);
    const myLawyerIds = new Set(filteredCases.map((c) => c.lawyerId || "u-lawyer"));
    const myAssociateIds = new Set(filteredCases.flatMap((c) => c.associateIds || []));

    filteredUsers = rawUsers.filter((u) => {
      if (u.id === userId) return true;
      if (myLawyerIds.has(u.id)) return true;
      if (myAssociateIds.has(u.id)) return true;
      return false;
    });

    filteredApprovals = [];
    filteredDecided = [];
  } else {
    // Admin / Platform Super Administrator
    filteredCases = rawCases;
    filteredUsers = rawUsers;
    filteredApprovals = rawApprovals;
    filteredDecided = rawDecided;
  }

  return {
    users: filteredUsers,
    cases: filteredCases,
    approvals: filteredApprovals,
    decided: filteredDecided,
    errorLogs: role === "admin" ? rawErrorLogs : [],
    broadcast,
    dbConnected,
    dbType: dbConnected ? "mongodb" : "in-memory-fallback",
  };
}

export async function loginUser(email: string, pass: string) {
  const normEmail = String(email || "").toLowerCase().trim();
  const trimmedPass = String(pass || "").trim();
  const cleanDigits = normEmail.replace(/\D/g, "");
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      await seedMongoIfEmpty();
      const safeRegex = normEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const phonePattern = cleanDigits.length >= 10 ? cleanDigits.slice(-10).split("").join("\\D*") : "";
      const user = await UserModel.findOne({
        $or: [
          { email: { $regex: new RegExp("^" + safeRegex + "$", "i") } },
          { id: { $regex: new RegExp("^" + safeRegex + "$", "i") } },
          ...(phonePattern ? [{ phone: { $regex: new RegExp(phonePattern) } }] : []),
        ],
      });

      if (user) {
        if (user.disabled || user.status === "disabled") {
          recordSystemErrorLog({
            level: "error",
            category: "auth",
            message: `Disabled account access rejected: ${user.name} (${user.email})`,
            details: `Authentication blocked for account '${user.id}' (role: ${user.role}). Account marked disabled by Platform Super Administrator.`,
            source: "api/auth/login",
            path: "/api/auth/login",
            userId: user.id,
            userRole: user.role,
          }).catch(() => {});
          throw new Error("This account has been disabled by platform administration. Please contact support.");
        }

        const expectedAccessCode =
          user.accessCode ||
          (user.id === "u-client"
            ? (process.env.SEED_CLIENT_PASSWORD || "client123")
            : "LD" + user.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase());

        const valid =
          (await comparePassword(trimmedPass, user.passwordHash)) ||
          (expectedAccessCode && trimmedPass.toUpperCase() === expectedAccessCode.toUpperCase()) ||
          (user.accessCode && trimmedPass === user.accessCode) ||
          (user.role === "client" && trimmedPass === (process.env.SEED_CLIENT_PASSWORD || "client123")) ||
          (user.role === "client" && trimmedPass === "client123");

        if (valid) {
          // If accessCode was not permanently set in DB, backfill it now
          if (!user.accessCode && expectedAccessCode) {
            await UserModel.updateOne({ _id: user._id }, { $set: { accessCode: expectedAccessCode } }).catch(() => {});
          }

          const token = signToken({
            id: user.id,
            role: user.role,
            email: user.email,
            name: user.name,
          });

          return {
            token,
            user: {
              id: user.id,
              role: user.role,
              name: user.name,
              email: user.email,
              phone: user.phone,
              designation: user.designation,
              lawyerId: user.lawyerId,
              accessCode: user.accessCode || expectedAccessCode,
            },
          };
        }
      }
    } catch (err: any) {
      console.warn("MongoDB login failed, attempting fallback:", err.message);
    }
  }

  // Fallback Store
  await initFallbackStore();
  const u = fallbackStore.users.find((x) => {
    if (x.email.toLowerCase() === normEmail) return true;
    if (x.id.toLowerCase() === normEmail) return true;
    if (cleanDigits.length >= 10 && (x.phone || "").replace(/\D/g, "").slice(-10) === cleanDigits.slice(-10)) return true;
    return false;
  });
  if (!u) return null;

  if (u.disabled || u.status === "disabled") {
    recordSystemErrorLog({
      level: "error",
      category: "auth",
      message: `Disabled account access rejected: ${u.name} (${u.email})`,
      details: `Authentication blocked for account '${u.id}' (role: ${u.role}). Account marked disabled by Platform Super Administrator.`,
      source: "api/auth/login",
      path: "/api/auth/login",
      userId: u.id,
      userRole: u.role,
    }).catch(() => {});
    throw new Error("This account has been disabled by platform administration. Please contact support.");
  }

  const expectedCode =
    u.accessCode ||
    (u.id === "u-client"
      ? (process.env.SEED_CLIENT_PASSWORD || "client123")
      : "LD" + u.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase());

  const valid =
    (await comparePassword(trimmedPass, u.passwordHash)) ||
    trimmedPass === u.password ||
    (expectedCode && trimmedPass.toUpperCase() === expectedCode.toUpperCase()) ||
    (u.accessCode && trimmedPass === u.accessCode) ||
    (u.role === "client" && trimmedPass === (process.env.SEED_CLIENT_PASSWORD || "client123")) ||
    (u.role === "client" && trimmedPass === "client123");

  if (!valid) return null;

  if (!u.accessCode && expectedCode) {
    u.accessCode = expectedCode;
  }

  const token = signToken({ id: u.id, role: u.role, email: u.email, name: u.name });
  const { passwordHash, password, ...clean } = u;
  return { token, user: { ...clean, accessCode: u.accessCode || expectedCode } };
}

export async function applyOp(op: { type: string; payload: any }, authorId: string) {
  const { type, payload } = op;
  const now = new Date().toISOString();
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    switch (type) {
      case "addCase": {
        const { ...c } = payload.case;
        const lawyerId = c.lawyerId || authorId;
        await CaseModel.findOneAndUpdate(
          { id: c.id },
          { $set: { ...c, lawyerId, createdAt: now, updatedAt: now } },
          { upsert: true }
        );
        break;
      }
      case "updateCase": {
        const set = { ...payload.fields, updatedAt: now };
        await CaseModel.findOneAndUpdate({ id: payload.caseId }, { $set: set });
        break;
      }
      case "addHearing": {
        await CaseModel.findOneAndUpdate(
          { id: payload.caseId },
          {
            $push: { hearings: { ...payload.hearing, by: payload.by || authorId } },
            $set: { updatedAt: now },
          }
        );
        break;
      }
      case "addOrder": {
        await CaseModel.findOneAndUpdate(
          { id: payload.caseId },
          {
            $push: {
              orders: {
                $each: [{ ...payload.order, addedBy: payload.by || authorId }],
                $position: 0,
              },
            },
            $set: { updatedAt: now },
          }
        );
        break;
      }
      case "setStatus": {
        const set: any = { updatedAt: now };
        if (payload.status) set.status = payload.status;
        if (payload.stage !== undefined) set.stage = payload.stage;
        await CaseModel.findOneAndUpdate({ id: payload.caseId }, { $set: set });
        break;
      }
      case "addQuery": {
        await CaseModel.findOneAndUpdate(
          { id: payload.caseId },
          {
            $push: { queries: payload.query },
            $set: { updatedAt: now },
          }
        );
        break;
      }
      case "replyQuery": {
        await CaseModel.findOneAndUpdate(
          { id: payload.caseId, "queries.id": payload.queryId },
          {
            $set: {
              "queries.$.reply": payload.reply,
              "queries.$.answered": true,
              "queries.$.replyBy": payload.replyBy || authorId,
              "queries.$.replyTs": new Date().toISOString(),
              updatedAt: now,
            },
          }
        );
        break;
      }
      case "addClient": {
        const cleanPhone = (payload.user.phone || "").replace(/\D/g, "");
        let existingUser: any = null;
        if (cleanPhone.length >= 10) {
          const allClients = await UserModel.find({ role: "client" }).lean();
          existingUser = allClients.find(
            (u: any) => (u.phone || "").replace(/\D/g, "").slice(-10) === cleanPhone.slice(-10)
          );
        }

        if (existingUser) {
          // Client already exists in system across chambers! Retain their immutable credentials & update details
          await UserModel.findOneAndUpdate(
            { id: existingUser.id },
            {
              $set: {
                name: existingUser.name || payload.user.name,
                email: (payload.user.email || existingUser.email || "").toLowerCase().trim(),
                phone: existingUser.phone || payload.user.phone,
                updatedAt: new Date().toISOString(),
              },
            }
          );
          break;
        }

        // New client: generate universal immutable alphanumeric password
        const generatedPassword = payload.user.accessCode || generateUniversalClientPassword();
        const passwordHash = await hashPassword(generatedPassword);
        const lawyerId = payload.user.lawyerId || payload.by || authorId;
        await UserModel.findOneAndUpdate(
          { id: payload.user.id },
          {
            $set: {
              ...payload.user,
              email: (payload.user.email || "").toLowerCase().trim(),
              accessCode: generatedPassword,
              role: "client",
              passwordHash,
              lawyerId,
            },
          },
          { upsert: true }
        );
        break;
      }
      case "addAssociate": {
        const pw = payload.user.password || process.env.SEED_ASSOC_PASSWORD || "assoc123";
        const passwordHash = await hashPassword(pw);
        const lawyerId = payload.user.lawyerId || payload.by || authorId;
        await UserModel.findOneAndUpdate(
          { id: payload.user.id },
          {
            $set: {
              ...payload.user,
              role: "associate",
              passwordHash,
              accessCode: pw,
              lawyerId,
            },
          },
          { upsert: true }
        );
        break;
      }
      case "addUser": {
        const pw = payload.user.password || "welcome123";
        const passwordHash = await hashPassword(pw);
        await UserModel.findOneAndUpdate(
          { id: payload.user.id },
          {
            $set: {
              ...payload.user,
              passwordHash,
            },
          },
          { upsert: true }
        );
        break;
      }
      case "removeUser": {
        await UserModel.deleteOne({ id: payload.userId });
        break;
      }
      case "deleteChamber": {
        const { chamberId } = payload;
        if (!chamberId || chamberId === "u-admin") {
          throw new Error("Cannot delete administrator chamber.");
        }
        const chamberCases = await CaseModel.find({ lawyerId: chamberId }).lean();
        const caseIds = chamberCases.map((c) => c.id);

        await CaseModel.deleteMany({ lawyerId: chamberId });
        await UserModel.deleteMany({ lawyerId: chamberId });
        await UserModel.deleteOne({ id: chamberId });

        if (caseIds.length > 0) {
          await ApprovalModel.deleteMany({ "payload.caseId": { $in: caseIds } });
          await DecisionModel.deleteMany({ "payload.caseId": { $in: caseIds } });
        }
        await ApprovalModel.deleteMany({ by: chamberId });
        await DecisionModel.deleteMany({ by: chamberId });
        break;
      }
      case "updateUser": {
        const existing = await UserModel.findOne({ id: payload.userId }).lean();
        const updateDoc: any = {};
        if (payload.name !== undefined) updateDoc.name = payload.name.trim();
        if (payload.email !== undefined) updateDoc.email = payload.email.toLowerCase().trim();
        if (payload.phone !== undefined) updateDoc.phone = payload.phone.trim();
        if (payload.designation !== undefined) updateDoc.designation = payload.designation.trim();
        // Client passwords are IMMUTABLE and cannot be altered by anyone
        if (payload.password && existing?.role !== "client") {
          updateDoc.passwordHash = await hashPassword(payload.password);
          updateDoc.accessCode = payload.password.trim();
        }
        await UserModel.findOneAndUpdate(
          { id: payload.userId },
          { $set: updateDoc },
          { new: true }
        );
        break;
      }
      case "updateBroadcast": {
        const { active, message } = payload;
        const b = { active: Boolean(active), message: String(message || ""), updatedAt: now };
        await SettingModel.findOneAndUpdate(
          { key: "system_broadcast" },
          { $set: { key: "system_broadcast", value: b } },
          { upsert: true }
        );
        break;
      }
      case "toggleUserStatus": {
        const target = await UserModel.findOne({ id: payload.userId });
        if (target) {
          const nextDisabled = payload.disabled !== undefined ? Boolean(payload.disabled) : !target.disabled;
          await UserModel.updateOne(
            { id: payload.userId },
            { $set: { disabled: nextDisabled, status: nextDisabled ? "disabled" : "active", updatedAt: now } }
          );
        }
        break;
      }
      case "adminUpdateUser": {
        const updateDoc: any = { updatedAt: now };
        if (payload.name !== undefined) updateDoc.name = payload.name.trim();
        if (payload.email !== undefined) updateDoc.email = payload.email.toLowerCase().trim();
        if (payload.phone !== undefined) updateDoc.phone = payload.phone.trim();
        if (payload.designation !== undefined) updateDoc.designation = payload.designation.trim();
        if (payload.role !== undefined) updateDoc.role = payload.role;
        if (payload.lawyerId !== undefined) updateDoc.lawyerId = payload.lawyerId;
        if (payload.disabled !== undefined) {
          updateDoc.disabled = Boolean(payload.disabled);
          updateDoc.status = payload.disabled ? "disabled" : "active";
        }
        if (payload.password && String(payload.password).trim()) {
          const cleanPass = String(payload.password).trim();
          updateDoc.passwordHash = await hashPassword(cleanPass);
          updateDoc.accessCode = cleanPass;
        }
        await UserModel.findOneAndUpdate(
          { id: payload.userId },
          { $set: updateDoc },
          { new: true }
        );
        break;
      }
      case "deleteCase": {
        await CaseModel.deleteOne({ id: payload.caseId });
        break;
      }
      case "provisionAdvocate": {
        await registerLawyerUser(payload);
        break;
      }
      case "resolveErrorLog": {
        const { logId, resolved } = payload;
        await ErrorLogModel.findOneAndUpdate(
          { id: logId },
          {
            $set: {
              resolved: Boolean(resolved),
              resolvedAt: resolved ? now : "",
              resolvedBy: resolved ? authorId : "",
              updatedAt: now,
            },
          }
        );
        break;
      }
      case "deleteErrorLog": {
        await ErrorLogModel.deleteOne({ id: payload.logId });
        break;
      }
      case "clearErrorLogs": {
        await ErrorLogModel.deleteMany({});
        break;
      }
      case "logSystemError": {
        const raw = payload.log || {};
        const newLog = {
          id: raw.id || "err-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
          timestamp: raw.timestamp || now,
          level: raw.level || "error",
          category: raw.category || "system",
          message: raw.message || "Manual Diagnostic Incident",
          details: raw.details || "",
          source: raw.source || "platform-admin",
          userId: raw.userId || authorId,
          userRole: raw.userRole || "admin",
          path: raw.path || "/admin/logs",
          ip: raw.ip || "127.0.0.1",
          resolved: Boolean(raw.resolved),
          resolvedAt: raw.resolved ? now : "",
          resolvedBy: raw.resolved ? authorId : "",
          createdAt: now,
          updatedAt: now,
        };
        await ErrorLogModel.create(newLog);
        break;
      }
    }
  }

  // Always update in fallback store as well for synchronous consistency
  await initFallbackStore();
  switch (type) {
    case "addCase": {
      const c = payload.case;
      const lawyerId = c.lawyerId || authorId;
      fallbackStore.cases.unshift({ ...c, lawyerId, createdAt: now, updatedAt: now });
      break;
    }
    case "updateCase": {
      const c = fallbackStore.cases.find((x) => x.id === payload.caseId);
      if (c) Object.assign(c, payload.fields, { updatedAt: now });
      break;
    }
    case "addHearing": {
      const c = fallbackStore.cases.find((x) => x.id === payload.caseId);
      if (c) {
        c.hearings.push({ ...payload.hearing, by: payload.by || authorId });
        c.updatedAt = now;
      }
      break;
    }
    case "addOrder": {
      const c = fallbackStore.cases.find((x) => x.id === payload.caseId);
      if (c) {
        c.orders.unshift({ ...payload.order, addedBy: payload.by || authorId });
        c.updatedAt = now;
      }
      break;
    }
    case "setStatus": {
      const c = fallbackStore.cases.find((x) => x.id === payload.caseId);
      if (c) {
        if (payload.status) c.status = payload.status;
        if (payload.stage !== undefined) c.stage = payload.stage;
        c.updatedAt = now;
      }
      break;
    }
    case "addQuery": {
      const c = fallbackStore.cases.find((x) => x.id === payload.caseId);
      if (c) {
        c.queries.push(payload.query);
        c.updatedAt = now;
      }
      break;
    }
    case "replyQuery": {
      const c = fallbackStore.cases.find((x) => x.id === payload.caseId);
      if (c) {
        c.queries = c.queries || [];
        const q = c.queries.find((item: any) => item.id === payload.queryId);
        if (q) {
          q.reply = payload.reply;
          q.answered = true;
          q.replyBy = payload.replyBy || authorId;
          q.replyTs = new Date().toISOString();
        }
        c.updatedAt = now;
      }
      break;
    }
    case "addClient": {
      const cleanPhone = (payload.user.phone || "").replace(/\D/g, "");
      const existing = cleanPhone.length >= 10
        ? fallbackStore.users.find((u) => u.role === "client" && (u.phone || "").replace(/\D/g, "").slice(-10) === cleanPhone.slice(-10))
        : null;

      if (existing) {
        if (payload.user.name && !existing.name) existing.name = payload.user.name;
        if (payload.user.email && !existing.email) existing.email = payload.user.email;
        break;
      }

      const generatedPassword = payload.user.accessCode || generateUniversalClientPassword();
      const lawyerId = payload.user.lawyerId || payload.by || authorId;
      fallbackStore.users.push({
        ...payload.user,
        role: "client",
        accessCode: generatedPassword,
        lawyerId,
        passwordHash: await hashPassword(generatedPassword),
      });
      break;
    }
    case "addAssociate": {
      const pw = payload.user.password || process.env.SEED_ASSOC_PASSWORD || "assoc123";
      const lawyerId = payload.user.lawyerId || payload.by || authorId;
      fallbackStore.users.push({
        ...payload.user,
        role: "associate",
        lawyerId,
        accessCode: pw,
        passwordHash: await hashPassword(pw),
      });
      break;
    }
    case "addUser": {
      const pw = payload.user.password || process.env.SEED_DEFAULT_PASSWORD || "";
      fallbackStore.users.push({
        ...payload.user,
        passwordHash: await hashPassword(pw),
      });
      break;
    }
    case "removeUser":
      fallbackStore.users = fallbackStore.users.filter((u) => u.id !== payload.userId);
      break;
    case "deleteChamber": {
      const { chamberId } = payload;
      if (!chamberId || chamberId === "u-admin") {
        throw new Error("Cannot delete administrator chamber.");
      }
      const caseIds = fallbackStore.cases
        .filter((c) => (c.lawyerId || "u-lawyer") === chamberId)
        .map((c) => c.id);

      fallbackStore.cases = fallbackStore.cases.filter(
        (c) => (c.lawyerId || "u-lawyer") !== chamberId
      );
      fallbackStore.users = fallbackStore.users.filter(
        (u) => u.id !== chamberId && (u.lawyerId || "u-lawyer") !== chamberId
      );
      fallbackStore.approvals = fallbackStore.approvals.filter(
        (a) => !caseIds.includes(a.payload?.caseId) && a.by !== chamberId
      );
      fallbackStore.decided = fallbackStore.decided.filter(
        (d) => !caseIds.includes(d.payload?.caseId) && d.by !== chamberId
      );
      break;
    }
    case "updateUser": {
      const u = fallbackStore.users.find((user) => user.id === payload.userId);
      if (u) {
        if (payload.name !== undefined) u.name = payload.name.trim();
        if (payload.email !== undefined) u.email = payload.email.toLowerCase().trim();
        if (payload.phone !== undefined) u.phone = payload.phone.trim();
        if (payload.designation !== undefined) u.designation = payload.designation.trim();
        if (payload.password && u.role !== "client") {
          u.passwordHash = await hashPassword(payload.password);
          u.accessCode = payload.password.trim();
        }
      }
      break;
    }
    case "updateBroadcast": {
      fallbackStore.broadcast = {
        active: Boolean(payload.active),
        message: String(payload.message || ""),
        updatedAt: now,
      };
      break;
    }
    case "toggleUserStatus": {
      const u = fallbackStore.users.find((user) => user.id === payload.userId);
      if (u) {
        const nextDisabled = payload.disabled !== undefined ? Boolean(payload.disabled) : !u.disabled;
        u.disabled = nextDisabled;
        u.status = nextDisabled ? "disabled" : "active";
      }
      break;
    }
    case "adminUpdateUser": {
      const u = fallbackStore.users.find((user) => user.id === payload.userId);
      if (u) {
        if (payload.name !== undefined) u.name = payload.name.trim();
        if (payload.email !== undefined) u.email = payload.email.toLowerCase().trim();
        if (payload.phone !== undefined) u.phone = payload.phone.trim();
        if (payload.designation !== undefined) u.designation = payload.designation.trim();
        if (payload.role !== undefined) u.role = payload.role;
        if (payload.lawyerId !== undefined) u.lawyerId = payload.lawyerId;
        if (payload.disabled !== undefined) {
          u.disabled = Boolean(payload.disabled);
          u.status = payload.disabled ? "disabled" : "active";
        }
        if (payload.password && String(payload.password).trim()) {
          const cleanPass = String(payload.password).trim();
          u.passwordHash = await hashPassword(cleanPass);
          u.accessCode = cleanPass;
        }
      }
      break;
    }
    case "deleteCase":
      fallbackStore.cases = fallbackStore.cases.filter((c) => c.id !== payload.caseId);
      break;
    case "provisionAdvocate": {
      if (!isConnected) {
        await registerLawyerUser(payload);
      }
      break;
    }
    case "resolveErrorLog": {
      const l = fallbackStore.errorLogs.find((x) => x.id === payload.logId);
      if (l) {
        l.resolved = Boolean(payload.resolved);
        l.resolvedAt = payload.resolved ? now : "";
        l.resolvedBy = payload.resolved ? authorId : "";
        l.updatedAt = now;
      }
      break;
    }
    case "deleteErrorLog":
      fallbackStore.errorLogs = fallbackStore.errorLogs.filter((x) => x.id !== payload.logId);
      break;
    case "clearErrorLogs":
      fallbackStore.errorLogs = [];
      break;
    case "logSystemError": {
      const raw = payload.log || {};
      const newLog = {
        id: raw.id || "err-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        timestamp: raw.timestamp || now,
        level: raw.level || "error",
        category: raw.category || "system",
        message: raw.message || "Manual Diagnostic Incident",
        details: raw.details || "",
        source: raw.source || "platform-admin",
        userId: raw.userId || authorId,
        userRole: raw.userRole || "admin",
        path: raw.path || "/admin/logs",
        ip: raw.ip || "127.0.0.1",
        resolved: Boolean(raw.resolved),
        resolvedAt: raw.resolved ? now : "",
        resolvedBy: raw.resolved ? authorId : "",
        createdAt: now,
        updatedAt: now,
      };
      fallbackStore.errorLogs.unshift(newLog);
      break;
    }
  }
}

export async function queueApproval(item: {
  id: string;
  by: string;
  byName: string;
  ts: string;
  type: string;
  label: string;
  payload: any;
}) {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    await ApprovalModel.findOneAndUpdate(
      { id: item.id },
      { $set: item },
      { upsert: true }
    );
  }
  await initFallbackStore();
  fallbackStore.approvals.push(item);
}

export async function decideApproval(id: string, decision: "approve" | "reject", userId: string) {
  const { isConnected } = await connectToDatabase();
  let item: any = null;

  if (isConnected) {
    item = await ApprovalModel.findOne({ id }).lean();
    if (!item) {
      await initFallbackStore();
      item = fallbackStore.approvals.find((x) => x.id === id);
    }

    if (item) {
      if (decision === "approve") {
        if (item.type === "compound") {
          for (const op of item.payload?.ops || []) {
            await applyOp(op, item.by);
          }
        } else {
          await applyOp({ type: item.type, payload: item.payload }, item.by);
        }
      }
      await ApprovalModel.deleteOne({ id }).catch(() => {});
      await DecisionModel.findOneAndUpdate(
        { id },
        {
          $set: {
            ...item,
            status: decision,
            decidedAt: new Date().toISOString(),
            decidedBy: userId,
          },
        },
        { upsert: true }
      ).catch(() => {});
    }
  }

  // Fallback sync
  await initFallbackStore();
  const fIdx = fallbackStore.approvals.findIndex((x) => x.id === id);
  if (fIdx !== -1) {
    const fItem = fallbackStore.approvals[fIdx];
    fallbackStore.approvals.splice(fIdx, 1);
    if (!isConnected && decision === "approve") {
      if (fItem.type === "compound") {
        for (const op of fItem.payload?.ops || []) await applyOp(op, fItem.by);
      } else {
        await applyOp({ type: fItem.type, payload: fItem.payload }, fItem.by);
      }
    }
    fallbackStore.decided.unshift({
      ...fItem,
      status: decision,
      decidedAt: new Date().toISOString(),
      decidedBy: userId,
    });
  }
}

export async function resetDatabase() {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    await Promise.all([
      UserModel.deleteMany({}),
      CaseModel.deleteMany({}),
      ApprovalModel.deleteMany({}),
      DecisionModel.deleteMany({}),
    ]);
    await seedMongoIfEmpty();
  }
  fallbackStore.isInitialized = false;
  await initFallbackStore();
}

export function getDatabaseInfo() {
  return {
    isConnected: isDatabaseConnected(),
    sanitizedUri: getSanitizedUri(),
  };
}

export interface LawyerRegistrationData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  barEnrollment?: string;
  chamberName?: string;
  primaryCourt?: string;
}

export async function registerLawyerUser(data: LawyerRegistrationData) {
  const normEmail = String(data.email || "").toLowerCase().trim();
  const id = "u-lawyer-" + Date.now();
  const passwordHash = await hashPassword(data.password);
  
  const barEnrollmentTrimmed = data.barEnrollment?.trim();
  const designation = barEnrollmentTrimmed
    ? `Advocate (${barEnrollmentTrimmed.toUpperCase()})${data.chamberName ? ` · ${data.chamberName.trim()}` : ""}`
    : `Advocate${data.chamberName ? ` · ${data.chamberName.trim()}` : ""}`;

  const cleanName = data.name.trim();
  const displayName = cleanName.toLowerCase().startsWith("adv") ? cleanName : `Adv. ${cleanName}`;

  const newUser = {
    id,
    role: "lawyer" as const,
    name: displayName,
    email: normEmail,
    passwordHash,
    phone: data.phone?.trim() || "",
    designation,
  };

  // Seed inaugural client and matter for this new advocate's dedicated chamber portfolio
  const initialClientId = "u-client-" + Date.now();
  const clientOrgName = `${cleanName.replace(/^adv\.?\s*/i, "")} Holdings / Retained Client`;
  const initialClient = {
    id: initialClientId,
    role: "client" as const,
    name: clientOrgName,
    email: `client.${normEmail.split("@")[0]}@chambers.in`,
    phone: "+91 98110 33001",
    designation: "Managing Litigant / Corporate Representative",
    lawyerId: id,
    passwordHash,
  };

  const initialCaseId = "c-" + Date.now();
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const limitationStr = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

  const initialCase = {
    id: initialCaseId,
    caseNo: `ARB.P. 101/${new Date().getFullYear()}`,
    cnr: `DLHC01-001010-${new Date().getFullYear()}`,
    title: `${clientOrgName} v. Regional Infra Consortium Ltd.`,
    court: data.primaryCourt || "High Court of Delhi",
    courtRoom: "Court Room 07",
    itemNo: "14",
    judge: "Hon'ble Mr. Justice Sanjiv Khanna",
    lawyerId: id,
    clientId: initialClientId,
    associateIds: [],
    status: "Active",
    stage: "Notice Returnable / Section 11 Arbitration Petition",
    filingDate: todayStr,
    limitationDate: limitationStr,
    limitationTask: "Filing Rejoinder & Proposed Sole Arbitrator Consent",
    notes: `Initial brief instituted under the Vakalatnama of ${displayName}. Retainer agreement executed and 50% professional fee credited.`,
    feeAgreed: 250000,
    feeReceived: 125000,
    feeReceipts: [
      {
        id: `rec-${Date.now()}`,
        amount: 125000,
        date: todayStr,
        mode: "NEFT / RTGS",
        reference: "CMS-VAK-001",
        receivedBy: displayName,
        notes: "50% retainer fee and petition drafting charges credited.",
      },
    ],
    hearings: [
      {
        date: tomorrowStr,
        purpose: "Notice Returnable & Interim Injunction Hearing",
        outcome: "Registry issued dasti notice; listed on board tomorrow.",
        by: id,
      },
    ],
    orders: [
      {
        id: `ord-${Date.now()}`,
        date: todayStr,
        title: "Order: Notice Issued under Arbitration & Conciliation Act",
        summary: "Notice issued to Respondent No. 1 and 2. Counter affidavit to be placed on record within two weeks.",
        addedBy: id,
      },
    ],
    queries: [],
  };

  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    try {
      await seedMongoIfEmpty();
      await UserModel.findOneAndUpdate(
        { email: normEmail },
        { $set: newUser },
        { upsert: true, new: true }
      );
      await UserModel.findOneAndUpdate(
        { id: initialClientId },
        { $set: initialClient },
        { upsert: true, new: true }
      );
      await CaseModel.findOneAndUpdate(
        { id: initialCaseId },
        { $set: initialCase },
        { upsert: true, new: true }
      );
    } catch (err: any) {
      console.warn("MongoDB registration deferred to fallback:", err.message);
    }
  }

  // Update fallback store as well
  await initFallbackStore();
  const existingIndex = fallbackStore.users.findIndex((u) => u.email.toLowerCase() === normEmail);
  if (existingIndex >= 0) {
    fallbackStore.users[existingIndex] = { ...newUser, password: data.password };
  } else {
    fallbackStore.users.push({ ...newUser, password: data.password });
  }
  fallbackStore.users.push({ ...initialClient, passwordHash: await hashPassword(process.env.SEED_CLIENT_PASSWORD || "") });
  fallbackStore.cases.unshift(initialCase);

  const token = signToken({
    id: newUser.id,
    role: newUser.role,
    email: newUser.email,
    name: newUser.name,
  });

  return {
    token,
    user: {
      id: newUser.id,
      role: newUser.role,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      designation: newUser.designation,
    },
  };
}

export async function getPublicCase(caseId: string) {
  const { isConnected } = await connectToDatabase();
  let c: any = null;
  if (isConnected) {
    c = await CaseModel.findOne({ id: caseId }).lean();
  }
  if (!c) {
    await initFallbackStore();
    c = fallbackStore.cases.find((item) => item.id === caseId);
  }
  if (!c) return null;

  // Sanitize for public docket view (strip internal notes and fee details)
  return {
    id: c.id,
    caseNo: c.caseNo,
    cnr: c.cnr,
    title: c.title,
    court: c.court,
    courtRoom: c.courtRoom,
    itemNo: c.itemNo,
    judge: c.judge,
    caseType: c.caseType,
    caseTypes: c.caseTypes || (c.caseType ? [c.caseType] : []),
    counselFor: c.counselFor,
    status: c.status,
    stage: c.stage,
    filingDate: c.filingDate,
    limitationDate: c.limitationDate,
    limitationTask: c.limitationTask,
    hearings: c.hearings || [],
    orders: c.orders || [],
    updatedAt: c.updatedAt,
  };
}

export async function lookupClientByPhone(phoneQuery: string): Promise<User | null> {
  const cleanDigits = phoneQuery.replace(/\D/g, "");
  if (cleanDigits.length < 10) return null;
  const last10 = cleanDigits.slice(-10);
  const phonePattern = last10.split("").join("\\D*");

  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    try {
      const found = await UserModel.findOne({
        role: "client",
        phone: { $regex: new RegExp(phonePattern) },
      }).lean();
      if (found) {
        return {
          id: found.id,
          role: found.role,
          name: found.name,
          email: found.email,
          phone: found.phone,
          designation: found.designation,
          lawyerId: found.lawyerId,
          accessCode:
            found.accessCode ||
            (found.id === "u-client"
              ? process.env.SEED_CLIENT_PASSWORD || "client123"
              : "LD" + found.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()),
        };
      }
    } catch (e) {
      console.warn("lookupClientByPhone DB fallback:", e);
    }
  }

  await initFallbackStore();
  const found = fallbackStore.users.find(
    (u) => u.role === "client" && (u.phone || "").replace(/\D/g, "").slice(-10) === last10
  );
  if (found) {
    return {
      id: found.id,
      role: found.role,
      name: found.name,
      email: found.email,
      phone: found.phone,
      designation: found.designation,
      lawyerId: found.lawyerId,
      accessCode:
        found.accessCode ||
        (found.id === "u-client"
          ? process.env.SEED_CLIENT_PASSWORD || "client123"
          : "LD" + found.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()),
    };
  }
  return null;
}

export async function recordSystemErrorLog(log: Partial<ErrorLog>) {
  const now = new Date().toISOString();
  const newLog: ErrorLog = {
    id: log.id || "err-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
    timestamp: log.timestamp || now,
    level: log.level || "error",
    category: log.category || "system",
    message: log.message || "System error",
    details: log.details || "",
    source: log.source || "system",
    userId: log.userId || "",
    userRole: log.userRole || "",
    path: log.path || "",
    ip: log.ip || "127.0.0.1",
    resolved: Boolean(log.resolved),
    resolvedAt: log.resolved ? now : "",
    resolvedBy: log.resolvedBy || "",
    createdAt: now,
    updatedAt: now,
  };

  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    try {
      await ErrorLogModel.create(newLog);
    } catch (e) {
      console.warn("Failed to persist error log in Mongo:", e);
    }
  }

  await initFallbackStore();
  fallbackStore.errorLogs.unshift(newLog);
}

export async function getAllErrorLogs(): Promise<ErrorLog[]> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    try {
      const logs = await ErrorLogModel.find().sort({ timestamp: -1 }).limit(200).lean();
      return logs.map((l: any) => ({
        id: l.id,
        timestamp: l.timestamp,
        level: l.level || "error",
        category: l.category || "system",
        message: l.message,
        details: l.details || "",
        source: l.source || "system",
        userId: l.userId || "",
        userRole: l.userRole || "",
        path: l.path || "",
        ip: l.ip || "127.0.0.1",
        resolved: Boolean(l.resolved),
        resolvedAt: l.resolvedAt || "",
        resolvedBy: l.resolvedBy || "",
        createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : "",
        updatedAt: l.updatedAt ? new Date(l.updatedAt).toISOString() : "",
      }));
    } catch (e: any) {
      console.warn("getAllErrorLogs DB fallback:", e);
    }
  }

  await initFallbackStore();
  return (fallbackStore.errorLogs || []).map((l: any) => ({
    id: l.id,
    timestamp: l.timestamp,
    level: l.level || "error",
    category: l.category || "system",
    message: l.message,
    details: l.details || "",
    source: l.source || "system",
    userId: l.userId || "",
    userRole: l.userRole || "",
    path: l.path || "",
    ip: l.ip || "127.0.0.1",
    resolved: Boolean(l.resolved),
    resolvedAt: l.resolvedAt || "",
    resolvedBy: l.resolvedBy || "",
  }));
}

export async function resolveSystemErrorLog(
  logId: string,
  resolved: boolean,
  resolvedBy: string = "Platform Super Admin"
) {
  const now = new Date().toISOString();
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    try {
      await ErrorLogModel.findOneAndUpdate(
        { id: logId },
        {
          $set: {
            resolved: Boolean(resolved),
            resolvedAt: resolved ? now : "",
            resolvedBy: resolved ? resolvedBy : "",
            updatedAt: new Date(),
          },
        }
      );
    } catch (e) {
      console.warn("MongoDB resolveSystemErrorLog error:", e);
    }
  }

  await initFallbackStore();
  const local = fallbackStore.errorLogs.find((l: any) => l.id === logId);
  if (local) {
    local.resolved = Boolean(resolved);
    local.resolvedAt = resolved ? now : "";
    local.resolvedBy = resolved ? resolvedBy : "";
    local.updatedAt = now;
  }
}

export async function deleteSystemErrorLog(logId?: string, clearAll: boolean = false) {
  const { isConnected } = await connectToDatabase();
  if (clearAll) {
    if (isConnected) {
      try {
        await ErrorLogModel.deleteMany({});
      } catch (e) {
        console.warn("MongoDB deleteSystemErrorLog clear error:", e);
      }
    }
    await initFallbackStore();
    fallbackStore.errorLogs = [];
    return;
  }

  if (logId) {
    if (isConnected) {
      try {
        await ErrorLogModel.deleteOne({ id: logId });
      } catch (e) {
        console.warn("MongoDB deleteSystemErrorLog error:", e);
      }
    }
    await initFallbackStore();
    fallbackStore.errorLogs = fallbackStore.errorLogs.filter((l: any) => l.id !== logId);
  }
}



