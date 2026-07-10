import mongoose from "mongoose";

export async function connectMongo() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        // console.error("Missing MONGO_URI in .env");
        // process.exit(1);
        console.warn("MONGO_URI is missing.  Start without MongoDB.");
        return false;
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    }   catch (err) {
        console.error("MongoDB Connection Failed: ", err);
        //process.exit(1);
        console.warn("Starting backend without database features.");
        return false;
    }
}