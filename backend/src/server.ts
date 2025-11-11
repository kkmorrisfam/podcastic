import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import type { Request, Response } from 'express';
import podcastRoutes from './routes/podcast.routes.js';


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5050

//middleware
//cors allows fontend to call backend
/***WILL NEED TO CHANGE FOR PRODUCTION**/

const allowedOrigins = [
      //add production url
      "http://localhost:3000", // for local dev testing if needed
    ];

// Root
app.get("/", (_req, res) => {
  res.send("🎧 Podcastic API is running!");
});

app.use(cors({
    origin: allowedOrigins,  
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Cache'],
    maxAge: 86400,
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running.')
});

app.use('/api/podcast', podcastRoutes);




// Root
app.get("/", (_req, res) => {
  res.send("🎧 Podcastic API is running!");
});

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


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
