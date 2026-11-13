import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApprovalDocument extends Document {
  id: string;
  by: string;
  byName: string;
  ts: string;
  type: string;
  label: string;
  payload: any;
  createdAt: Date;
  updatedAt: Date;
}

const ApprovalSchema = new Schema<IApprovalDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    by: { type: String, required: true },
    byName: { type: String, required: true },
    ts: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const ApprovalModel: Model<IApprovalDocument> =
  mongoose.models.Approval || mongoose.model<IApprovalDocument>("Approval", ApprovalSchema);

