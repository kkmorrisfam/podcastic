import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import podcastRoutes from './routes/podcast.routes.js';


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

//middleware
//cors allows fontend to call backend
/***WILL NEED TO CHANGE FOR PRODUCTION**/
app.use(cors({
    origin: 'http://localhost:3000',  
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




app.use((req, res) => res.status(404).json({error: 'Not Found'}));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
