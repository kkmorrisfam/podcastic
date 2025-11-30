console.log("Starting server...");
console.log("Loaded cors");


// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
import express from "express";
console.log("loaded express");

import cors from "cors";
console.log("loaded cors");

import dotenv from "dotenv";
console.log("loaded dotenv");

dotenv.config();

import podcastRoutes from "./routes/podcast.routes.js";
console.log("loaded podcastRoutes");

import { connectMongo } from "./config/connectMongo.js";
console.log("loaded connectMongo");

import authRoutes from "./routes/auth.routes.js";
console.log("loaded authRoutes");

import collectionRoutes from "./routes/collections.routes.js";
console.log("loaded collectionRoutes");




// import podcastRoutes from "./routes/podcast.routes.js";
// import { connectMongo } from "./config/connectMongo.js";
// import authRoutes from "./routes/auth.routes.js";
// import collectionRoutes from "./routes/collections.routes.js";

// Connect to DB
connectMongo();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", collectionRoutes);

// used for testing
// app.use((req, _res, next) => {
//   console.log("REQUEST:", req.method, req.path);
//   next();
// });

// Mount routes
app.use("/api/podcast", podcastRoutes);

// Root
app.get("/", (_req, res) => {
  res.send("🎧 Podcastic API is running!");
});


// 404 handler (MUST be last)
app.use((_req, res) => res.status(404).json({ error: "Route Not Found" }));

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
