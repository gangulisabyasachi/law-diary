import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICaseDocument extends Document {
  id: string;
  caseNo: string;
  cnr?: string;
  title: string;
  officeFileNo?: string;
  caseType?: string;
  caseTypes?: string[];
  city?: string;
  counselFor?: string;
  opponentName?: string;
  opponentLawyer?: string;
  court: string;
  courtRoom?: string;
  itemNo?: string;
  judge?: string;
  lawyerId?: string;
  clientId: string;
  associateIds: string[];
  status: "Active" | "Listed" | "Reserved" | "Adjourned" | "Disposed" | "Stayed" | "Quashed" | "Adjourned S.D." | string;
  stage: string;
  filingDate: string;
  limitationDate?: string;
  limitationTask?: string;
  notes?: string;
  feeAgreed?: number;
  feeReceived?: number;
  caseCharge?: number;
  feeReceipts?: Array<{
    receiptNo: string;
    date: string;
    amount: number;
    mode?: string;
    note?: string;
  }>;
  customFields?: Array<{
    id: string;
    name: string;
    value: string;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
    dataUrl?: string;
  }>;
  timesheet?: Array<{
    id: string;
    date: string;
    advocateName: string;
    activity: string;
    hours: number;
    rate?: number;
  }>;
  hearings: Array<{
    date: string;
    purpose: string;
    outcome?: string;
    by?: string;
  }>;
  orders: Array<{
    date: string;
    title: string;
    text: string;
    addedBy?: string;
    citation?: string;
  }>;
  queries: Array<{
    id: string;
    by: string;
    text: string;
    ts: string;
    answered: boolean;
    reply?: string;
    replyBy?: string;
    replyTs?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const HearingSchema = new Schema(
  {
    date: { type: String, required: true },
    purpose: { type: String, required: true },
    outcome: { type: String, default: "" },
    by: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    date: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    addedBy: { type: String, default: "" },
    citation: { type: String, default: "" },
  },
  { _id: false }
);

const QuerySchema = new Schema(
  {
    id: { type: String, required: true },
    by: { type: String, required: true },
    text: { type: String, required: true },
    ts: { type: String, required: true },
    answered: { type: Boolean, default: false },
    reply: { type: String, default: "" },
    replyBy: { type: String, default: "" },
    replyTs: { type: String, default: "" },
  },
  { _id: false }
);

const CaseSchema = new Schema<ICaseDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    caseNo: { type: String, required: true, index: true },
    cnr: { type: String, default: "" },
    title: { type: String, required: true },
    court: { type: String, required: true },
    courtRoom: { type: String, default: "" },
    itemNo: { type: String, default: "" },
    judge: { type: String, default: "" },
    lawyerId: { type: String, default: "u-lawyer", index: true },
    clientId: { type: String, required: true, index: true },
    associateIds: [{ type: String }],
    status: {
      type: String,
      default: "Active",
      index: true,
    },
    stage: { type: String, default: "Fresh Filing" },
    filingDate: { type: String, required: true },
    limitationDate: { type: String, default: "" },
    limitationTask: { type: String, default: "" },
    notes: { type: String, default: "" },
    feeAgreed: { type: Number, default: 0 },
    feeReceived: { type: Number, default: 0 },
    feeReceipts: [
      {
        receiptNo: { type: String, default: "" },
        date: { type: String, default: "" },
        amount: { type: Number, default: 0 },
        mode: { type: String, default: "NEFT / Bank Transfer" },
        note: { type: String, default: "" },
      },
    ],
    officeFileNo: { type: String, default: "" },
    caseType: { type: String, default: "" },
    caseTypes: [{ type: String }],
    city: { type: String, default: "" },
    counselFor: { type: String, default: "Plaintiff" },
    opponentName: { type: String, default: "" },
    opponentLawyer: { type: String, default: "" },
    caseCharge: { type: Number, default: 0 },
    customFields: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        value: { type: String, default: "" },
      },
    ],
    attachments: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        size: { type: Number, default: 0 },
        type: { type: String, default: "" },
        uploadedAt: { type: String, default: "" },
        dataUrl: { type: String, default: "" },
      },
    ],
    timesheet: [
      {
        id: { type: String, required: true },
        date: { type: String, required: true },
        advocateName: { type: String, default: "" },
        activity: { type: String, default: "" },
        hours: { type: Number, default: 0 },
        rate: { type: Number, default: 0 },
      },
    ],
    hearings: [HearingSchema],
    orders: [OrderSchema],
    queries: [QuerySchema],
  },
  { timestamps: true, strict: false }
);

export const CaseModel: Model<ICaseDocument> =
  mongoose.models.Case || mongoose.model<ICaseDocument>("Case", CaseSchema);

