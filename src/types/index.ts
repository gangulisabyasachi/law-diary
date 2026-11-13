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
  citation?: string;
  pdfUrl?: string;
}

export interface ClientQuery {
  id: string;
  by: string;
  text: string;
  ts: string;
  answered: boolean;
  reply?: string;
}

export interface FeeReceipt {
  receiptNo: string;
  date: string;
  amount: number;
  mode?: string;
  note?: string;
}

export type CaseStatus = "Active" | "Listed" | "Reserved" | "Adjourned" | "Disposed";

export interface Case {
  id: string;
  caseNo: string;
  cnr?: string;
  title: string;
  court: string;
  courtRoom?: string;
  itemNo?: string;
  judge?: string;
  lawyerId?: string;
  clientId: string;
  associateIds: string[];
  status: CaseStatus;
  stage: string;
  filingDate: string;
  limitationDate?: string;
  limitationTask?: string;
  notes?: string;
  feeAgreed?: number;
  feeReceived?: number;
  feeReceipts?: FeeReceipt[];
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

