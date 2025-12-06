import express from "express";
import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

import podcastRoutes from "./routes/podcast.routes.js";
import { connectMongo } from "./config/connectMongo.js";
import authRoutes from "./routes/auth.routes.js";
import collectionRoutes from "./routes/collections.routes.js";

// Connect to DB
connectMongo();

const app = express();
const PORT: number = parseInt(process.env.PORT ?? "5050", 10);

// ----------------------
// CORS CONFIG 
// ----------------------
const allowedOrigins = [
  "http://localhost:5173",                 // Local Vite dev
  "http://localhost:3000",                 // Alternative dev
  "https://podcastic-dun.vercel.app",      // Production frontend on Vercel
];

// Production CORS (secure)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow server-to-server & CLI tools
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ----------------------
// Middleware
// ----------------------
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", collectionRoutes);
app.use("/api/podcast", podcastRoutes);

// Root
app.get("/", (_req, res) => {
  res.send("🎧 Podcastic API is running!");
});

// 404 handler
app.use((_req, res) => res.status(404).json({ error: "Route Not Found" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on port ${PORT}`);
});
