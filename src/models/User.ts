import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  id: string;
  role: "lawyer" | "associate" | "client" | "admin";
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  aadhaarNumber?: string;
  designation?: string;
  lawyerId?: string;
  accessCode?: string;
  disabled?: boolean;
  status?: "active" | "disabled";
  failedLoginAttempts?: number;
  lockedUntil?: string | null;
  lockoutCount?: number;
  lastFailedLoginAt?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      enum: ["lawyer", "associate", "client", "admin"],
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, default: "" },
    phone: { type: String, default: "" },
    aadhaarNumber: { type: String, default: "", index: true },
    designation: { type: String, default: "" },
    lawyerId: { type: String, default: "" },
    accessCode: { type: String, default: "" },
    disabled: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: String, default: null },
    lockoutCount: { type: Number, default: 0 },
    lastFailedLoginAt: { type: String, default: null },
  },
  { timestamps: true }
);

export const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

