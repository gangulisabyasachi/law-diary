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

export async function getChamberState(): Promise<AppState> {
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      await seedMongoIfEmpty();
      const [users, cases, approvals, decided] = await Promise.all([
        UserModel.find().lean(),
        CaseModel.find().lean(),
        ApprovalModel.find().sort({ createdAt: 1 }).lean(),
        DecisionModel.find().sort({ createdAt: -1 }).limit(50).lean(),
      ]);

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
        clientId: c.clientId,
        associateIds: c.associateIds || [],
        status: c.status,
        stage: c.stage,
        filingDate: c.filingDate,
        limitationDate: c.limitationDate,
        limitationTask: c.limitationTask,
        notes: c.notes,
        hearings: c.hearings || [],
        orders: c.orders || [],
        queries: c.queries || [],
        createdAt: c.createdAt?.toISOString?.() || c.createdAt,
        updatedAt: c.updatedAt?.toISOString?.() || c.updatedAt,
      });

      return {
        users: users.map(sanitizeUser),
        cases: cases.map(sanitizeCase),
        approvals: approvals.map((a: any) => ({
          id: a.id,
          by: a.by,
          byName: a.byName,
          ts: a.ts,
          type: a.type,
          label: a.label,
          payload: a.payload,
          createdAt: a.createdAt?.toISOString?.() || a.createdAt,
        })),
        decided: decided.map((d: any) => ({
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
        })),
        dbConnected: true,
        dbType: "mongodb",
      };
    } catch (err: any) {
      console.error("Error reading from MongoDB, switching to fallback:", err.message);
    }
  }

  // In-memory fallback
  await initFallbackStore();
  return {
    users: fallbackStore.users.map(({ passwordHash, password, ...rest }) => rest),
    cases: fallbackStore.cases,
    approvals: fallbackStore.approvals,
    decided: fallbackStore.decided,
    dbConnected: false,
    dbType: "in-memory-fallback",
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
        await CaseModel.findOneAndUpdate(
          { id: c.id },
          { $set: { ...c, createdAt: now, updatedAt: now } },
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
        await UserModel.findOneAndUpdate(
          { id: payload.user.id },
          {
            $set: {
              ...payload.user,
              role: "client",
              passwordHash,
              lawyerId: payload.by || authorId,
            },
          },
          { upsert: true }
        );
        break;
      }
      case "addAssociate": {
        const pw = payload.user.password || "assoc123";
        const passwordHash = await hashPassword(pw);
        await UserModel.findOneAndUpdate(
          { id: payload.user.id },
          {
            $set: {
              ...payload.user,
              role: "associate",
              passwordHash,
              lawyerId: payload.by || authorId,
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
    case "addCase":
      fallbackStore.cases.unshift({ ...payload.case, createdAt: now, updatedAt: now });
      break;
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
    case "addClient":
    case "addAssociate":
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

