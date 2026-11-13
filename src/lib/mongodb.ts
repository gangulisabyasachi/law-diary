import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/counselbook";

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<{
  mongooseInstance: typeof mongoose | null;
  isConnected: boolean;
  error?: string;
}> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return { mongooseInstance: cached.conn, isConnected: true };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("✓ MongoDB connected successfully to", MONGODB_URI.replace(/\/\/[^@]+@/, "//<credentials>@"));
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.warn("⚠ MongoDB connection attempt deferred:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return { mongooseInstance: cached.conn, isConnected: true };
  } catch (err: any) {
    return { mongooseInstance: null, isConnected: false, error: err?.message || "Connection failed" };
  }
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function getSanitizedUri(): string {
  return MONGODB_URI.replace(/\/\/[^@]+@/, "//<credentials>@");
}

