import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "counselbook-dev-secret-key-change-in-prod";

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

export async function comparePassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export function signToken(payload: { id: string; role: string; email: string; name: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { id: string; role: string; email: string; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export function getAuthUser(req: NextRequest): { id: string; role: string; email: string; name: string } | null {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  return verifyToken(token);
}

