import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import podcastRoutes from "./routes/podcast.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

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
