import { connectToDatabase, isDatabaseConnected, getSanitizedUri } from "./mongodb";
import { UserModel, CaseModel, ApprovalModel, DecisionModel } from "@/models";
import { getSeedData } from "./seedData";
import { hashPassword, comparePassword, signToken } from "./auth";
import { AppState, Case, User, Approval, Decision } from "@/types";

// In-memory fallback if MongoDB is not yet started or being configured
interface FallbackStore {
  users: Array<any>;
  cases: Array<any>;
  approvals: Array<any>;
  decided: Array<any>;
  isInitialized: boolean;
}

const fallbackStore: FallbackStore = {
  users: [],
  cases: [],
  approvals: [],
  decided: [],
  isInitialized: false,
};

async function initFallbackStore() {
  if (fallbackStore.isInitialized) return;
  const { users, cases, decided } = getSeedData();
  const usersWithHashes = await Promise.all(
    users.map(async (u) => ({
      ...u,
      passwordHash: await hashPassword(u.password),
    }))
  );
  fallbackStore.users = usersWithHashes;
  fallbackStore.cases = cases;
  fallbackStore.approvals = [];
  fallbackStore.decided = decided;
  fallbackStore.isInitialized = true;
}

export async function seedMongoIfEmpty() {
  const { isConnected } = await connectToDatabase();
  if (!isConnected) return false;

  const count = await UserModel.countDocuments();
  if (count > 0) return true;

  console.log("Empty MongoDB detected. Seeding initial chamber data...");
  const { users, cases, decided } = getSeedData();

  for (const u of users) {
    const passwordHash = await hashPassword(u.password);
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
    createdAt: u.createdAt?.toISOString?.() || u.createdAt,
    updatedAt: u.updatedAt?.toISOString?.() || u.updatedAt,
  });

  const sanitizeCase = (c: any): Case => ({
    id: c.id,
    caseNo: c.caseNo,
    title: c.title,
    court: c.court,
    courtRoom: c.courtRoom,
    itemNo: c.itemNo,
    cnr: c.cnr,
    judge: c.judge,
    lawyerId: c.lawyerId || "u-lawyer",
    clientId: c.clientId,
    associateIds: c.associateIds || [],
    status: c.status,
    stage: c.stage,
    filingDate: c.filingDate,
    limitationDate: c.limitationDate,
    limitationTask: c.limitationTask,
    notes: c.notes,
    feeAgreed: c.feeAgreed || 0,
    feeReceived: c.feeReceived || 0,
    feeReceipts: c.feeReceipts || [],
    hearings: c.hearings || [],
    orders: c.orders || [],
    queries: c.queries || [],
    createdAt: c.createdAt?.toISOString?.() || c.createdAt,
    updatedAt: c.updatedAt?.toISOString?.() || c.updatedAt,
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

  let rawUsers: User[] = [];
  let rawCases: Case[] = [];
  let rawApprovals: Approval[] = [];
  let rawDecided: Decision[] = [];
  let dbConnected = false;

  if (isConnected) {
    try {
      await seedMongoIfEmpty();
      const [users, cases, approvals, decided] = await Promise.all([
        UserModel.find().lean(),
        CaseModel.find().lean(),
        ApprovalModel.find().sort({ createdAt: 1 }).lean(),
        DecisionModel.find().sort({ createdAt: -1 }).limit(50).lean(),
      ]);

      rawUsers = users.map(sanitizeUser);
      rawCases = cases.map(sanitizeCase);
      rawApprovals = approvals.map(sanitizeApproval);
      rawDecided = decided.map(sanitizeDecision);
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
  }

  // If no user is specified (e.g. unauthenticated public landing page), return benchmark data
  if (!filterUser || !filterUser.id) {
    return {
      users: rawUsers,
      cases: rawCases,
      approvals: rawApprovals,
      decided: rawDecided,
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
    // Admin / Platform Registrar
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
    dbConnected,
    dbType: dbConnected ? "mongodb" : "in-memory-fallback",
  };
}

export async function loginUser(email: string, pass: string) {
  const normEmail = String(email || "").toLowerCase().trim();
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      await seedMongoIfEmpty();
      const user = await UserModel.findOne({ email: normEmail });
      if (!user) return null;
      const valid = await comparePassword(pass, user.passwordHash);
      if (!valid) return null;

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
        },
      };
    } catch (err: any) {
      console.warn("MongoDB login failed, attempting fallback:", err.message);
    }
  }

  // Fallback
  await initFallbackStore();
  const u = fallbackStore.users.find((x) => x.email.toLowerCase() === normEmail);
  if (!u) return null;
  const valid = (await comparePassword(pass, u.passwordHash)) || pass === u.password;
  if (!valid) return null;

  const token = signToken({ id: u.id, role: u.role, email: u.email, name: u.name });
  const { passwordHash, password, ...clean } = u;
  return { token, user: clean };
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
        const set: any = { status: payload.status, updatedAt: now };
        if (payload.stage) set.stage = payload.stage;
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
              updatedAt: now,
            },
          }
        );
        break;
      }
      case "addClient": {
        const pw = payload.user.password || "client123";
        const passwordHash = await hashPassword(pw);
        const lawyerId = payload.user.lawyerId || payload.by || authorId;
        await UserModel.findOneAndUpdate(
          { id: payload.user.id },
          {
            $set: {
              ...payload.user,
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
        const pw = payload.user.password || "assoc123";
        const passwordHash = await hashPassword(pw);
        const lawyerId = payload.user.lawyerId || payload.by || authorId;
        await UserModel.findOneAndUpdate(
          { id: payload.user.id },
          {
            $set: {
              ...payload.user,
              role: "associate",
              passwordHash,
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
        c.status = payload.status;
        if (payload.stage) c.stage = payload.stage;
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
        const q = c.queries.find((item: any) => item.id === payload.queryId);
        if (q) {
          q.reply = payload.reply;
          q.answered = true;
        }
        c.updatedAt = now;
      }
      break;
    }
    case "addClient": {
      const pw = payload.user.password || "client123";
      const lawyerId = payload.user.lawyerId || payload.by || authorId;
      fallbackStore.users.push({
        ...payload.user,
        role: "client",
        lawyerId,
        passwordHash: await hashPassword(pw),
      });
      break;
    }
    case "addAssociate": {
      const pw = payload.user.password || "assoc123";
      const lawyerId = payload.user.lawyerId || payload.by || authorId;
      fallbackStore.users.push({
        ...payload.user,
        role: "associate",
        lawyerId,
        passwordHash: await hashPassword(pw),
      });
      break;
    }
    case "addUser": {
      const pw = payload.user.password || "pass123";
      fallbackStore.users.push({
        ...payload.user,
        passwordHash: await hashPassword(pw),
      });
      break;
    }
    case "removeUser":
      fallbackStore.users = fallbackStore.users.filter((u) => u.id !== payload.userId);
      break;
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
      await ApprovalModel.deleteOne({ id });
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
      );
    }
  }

  // Fallback sync
  await initFallbackStore();
  const fIdx = fallbackStore.approvals.findIndex((x) => x.id === id);
  if (fIdx !== -1) {
    const fItem = fallbackStore.approvals[fIdx];
    fallbackStore.approvals.splice(fIdx, 1);
    if (decision === "approve") {
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
  barEnrollment: string;
  chamberName?: string;
  primaryCourt?: string;
}

export async function registerLawyerUser(data: LawyerRegistrationData) {
  const normEmail = String(data.email || "").toLowerCase().trim();
  const id = "u-lawyer-" + Date.now();
  const passwordHash = await hashPassword(data.password);
  
  const designation = `Senior Counsel (${data.barEnrollment.trim().toUpperCase()})${data.chamberName ? ` · ${data.chamberName.trim()}` : ""}`;

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
  fallbackStore.users.push({ ...initialClient, password: "client123" });
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

