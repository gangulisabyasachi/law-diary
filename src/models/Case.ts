import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICaseDocument extends Document {
  id: string;
  caseNo: string;
  title: string;
  court: string;
  judge?: string;
  clientId: string;
  associateIds: string[];
  status: "Active" | "Listed" | "Reserved" | "Adjourned" | "Disposed";
  stage: string;
  filingDate: string;
  notes?: string;
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
  }>;
  queries: Array<{
    id: string;
    by: string;
    text: string;
    ts: string;
    answered: boolean;
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
  },
  { _id: false }
);

const CaseSchema = new Schema<ICaseDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    caseNo: { type: String, required: true, index: true },
    title: { type: String, required: true },
    court: { type: String, required: true },
    judge: { type: String, default: "" },
    clientId: { type: String, required: true, index: true },
    associateIds: [{ type: String }],
    status: {
      type: String,
      enum: ["Active", "Listed", "Reserved", "Adjourned", "Disposed"],
      default: "Active",
      index: true,
    },
    stage: { type: String, default: "Fresh Filing" },
    filingDate: { type: String, required: true },
    notes: { type: String, default: "" },
    hearings: [HearingSchema],
    orders: [OrderSchema],
    queries: [QuerySchema],
  },
  { timestamps: true }
);

export const CaseModel: Model<ICaseDocument> =
  mongoose.models.Case || mongoose.model<ICaseDocument>("Case", CaseSchema);

