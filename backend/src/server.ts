import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import type { Request, Response } from "express";
import podcastRoutes from "./routes/podcast.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Mount router at /api
app.use("/api", podcastRoutes);

// Root
app.get("/", (_req, res) => {
  res.send("Podcastic API is running!");
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route Not Found" });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error("[Error middleware]", err);
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
