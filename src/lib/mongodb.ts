import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

// Define a type for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Ensure the global variable is correctly typed
declare global {
  var mongoose: MongooseCache | undefined;
}

// Use existing global cache or initialize a new one
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false, // Critical: Fail fast if connection is down
      maxPoolSize: 10,       // Recommended for serverless environments
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null; // Reset promise on failure
    throw e;
  }

  return cached!.conn;
}