import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDecisionDocument extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const DecisionSchema = new Schema<IDecisionDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    by: { type: String, required: true },
    byName: { type: String, required: true },
    ts: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: { type: String, enum: ["approved", "rejected"], required: true },
    decidedAt: { type: String, required: true },
    decidedBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const DecisionModel: Model<IDecisionDocument> =
  mongoose.models.Decision || mongoose.model<IDecisionDocument>("Decision", DecisionSchema);

