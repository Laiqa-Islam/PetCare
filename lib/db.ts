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
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  }).then((connection) => {
    cache.connection = connection;
    return connection;
  }).catch((error) => {
    cache.promise = null;
    throw error;
  });

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Database connection timed out")), 5500);
    });
    cache.connection = await Promise.race([cache.promise, timeout]);
  } catch (error) {
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  return cache.connection;
}
