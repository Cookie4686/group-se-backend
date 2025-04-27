import mongoose from "mongoose";
let cached = global.instance;
if (!cached) {
    cached = global.instance = { connection: undefined, promise: undefined };
}
export default async function dbConnect() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI environment variable");
    }
    if (!cached.connection) {
        if (!cached.promise) {
            const opts = { bufferCommands: false };
            cached.promise = mongoose
                .set("strictQuery", true)
                .connect(MONGODB_URI, opts)
                .then((mongoose) => mongoose);
        }
        try {
            cached.connection = await cached.promise;
            console.log("connected to the database");
        }
        catch (err) {
            cached.promise = undefined;
            console.error(err);
        }
    }
    return cached.connection;
}
