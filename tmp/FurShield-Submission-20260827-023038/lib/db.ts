import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not configured");
}

const mongoUri: string = MONGODB_URI;

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalForMongoose.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalForMongoose.mongooseCache = cache;

export async function connectToDatabase() {
  if (cache.connection) return cache.connection;

  cache.promise ??= mongoose.connect(mongoUri, {
    bufferCommands: false,
    dbName: "furshield",
  });

  try {
    cache.connection = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.connection;
}
