export type UserRole = "lawyer" | "associate" | "client" | "admin";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  lawyerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hearing {
  date: string;
  purpose: string;
  outcome?: string;
  by?: string;
}

export interface Order {
  date: string;
  title: string;
  text: string;
  addedBy?: string;
}

export interface ClientQuery {
  id: string;
  by: string;
  text: string;
  ts: string;
  answered: boolean;
}

export type CaseStatus = "Active" | "Listed" | "Reserved" | "Adjourned" | "Disposed";

export interface Case {
  id: string;
  caseNo: string;
  title: string;
  court: string;
  judge?: string;
  clientId: string;
  associateIds: string[];
  status: CaseStatus;
  stage: string;
  filingDate: string;
  notes?: string;
  hearings: Hearing[];
  orders: Order[];
  queries: ClientQuery[];
  createdAt: string;
  updatedAt: string;
}

export interface Approval {
  id: string;
  by: string;
  byName: string;
  ts: string;
  type: string;
  label: string;
  payload: any;
  createdAt?: string;
}

export interface Decision {
  id: string;
  by: string;
  byName: string;
  ts: string;
  type: string;
  label: string;
  payload: any;
  status: "approved" | "rejected";
  decidedAt: string;
  decidedBy: string;
}

export interface AppState {
  users: User[];
  cases: Case[];
  approvals: Approval[];
  decided: Decision[];
  dbConnected: boolean;
  dbType: "mongodb" | "in-memory-fallback";
}

