import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  id: string;
  role: "lawyer" | "associate" | "client" | "admin";
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  designation?: string;
  lawyerId?: string;
  accessCode?: string;
  disabled?: boolean;
  status?: "active" | "disabled";
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
    designation: { type: String, default: "" },
    lawyerId: { type: String, default: "" },
    accessCode: { type: String, default: "" },
    disabled: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
  },
  { timestamps: true }
);

export const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

