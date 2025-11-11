import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import type { Request, Response } from 'express';
import podcastRoutes from './routes/podcast.routes.js';


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5050

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

//middleware
//cors allows fontend to call backend
/***WILL NEED TO CHANGE FOR PRODUCTION**/

// const allowedOrigins = [
//       //add production url
//       "http://localhost:3000", // for local dev testing if needed
//     ];

// Root
app.get("/", (_req, res) => {
  res.send("🎧 Podcastic API is running!");
});

// app.use(cors({
//     origin: allowedOrigins,  
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     exposedHeaders: ['X-Cache'],
//     maxAge: 86400,
// }));



app.use('/api/podcast', podcastRoutes);





//middleware for thrown errors
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('[Error middleware]', err);
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
    },
  });
});

// 404 handler (MUST be last)
app.use((_req, res) => res.status(404).json({ error: "Route Not Found" }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
