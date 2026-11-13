import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Read MONGODB_URI from .env.local if not in process.env
let uri = process.env.MONGODB_URI;
if (!uri) {
  try {
    const envFile = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    const match = envFile.match(/MONGODB_URI=(.*)/);
    if (match) uri = match[1].trim();
  } catch (e) {}
}

if (!uri) {
  console.error("MONGODB_URI not found in environment or .env.local");
  process.exit(1);
}

async function test() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log("Connected to MongoDB Atlas!");
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Existing collections:", collections.map(c => c.name));
  await mongoose.disconnect();
}

test().catch(err => {
  console.error("Connection failed:", err.message);
  process.exit(1);
});

