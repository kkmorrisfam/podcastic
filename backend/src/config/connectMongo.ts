import mongoose from "mongoose";

export async function connectMongo() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("Missing MONGO_URI in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    }   catch (err) {
        console.error("MongoDB Connection Error", err);
        process.exit(1);
    }
}