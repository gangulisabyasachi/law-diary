import mongoose, { Schema, Document, Model } from "mongoose";

export interface IErrorLogDocument extends Document {
  id: string;
  timestamp: string;
  level: "error" | "warn" | "info" | "fatal";
  category: "auth" | "database" | "network" | "validation" | "chamber_scoping" | "system";
  message: string;
  details?: string;
  source?: string;
  userId?: string;
  userRole?: string;
  path?: string;
  ip?: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ErrorLogSchema = new Schema<IErrorLogDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    timestamp: { type: String, required: true, index: true },
    level: {
      type: String,
      enum: ["error", "warn", "info", "fatal"],
      default: "error",
      index: true,
    },
    category: {
      type: String,
      enum: ["auth", "database", "network", "validation", "chamber_scoping", "system"],
      default: "system",
      index: true,
    },
    message: { type: String, required: true },
    details: { type: String, default: "" },
    source: { type: String, default: "api" },
    userId: { type: String, default: "" },
    userRole: { type: String, default: "" },
    path: { type: String, default: "" },
    ip: { type: String, default: "" },
    resolved: { type: Boolean, default: false, index: true },
    resolvedAt: { type: String },
    resolvedBy: { type: String },
  },
  { timestamps: true }
);

export const ErrorLogModel: Model<IErrorLogDocument> =
  mongoose.models.ErrorLog || mongoose.model<IErrorLogDocument>("ErrorLog", ErrorLogSchema);
