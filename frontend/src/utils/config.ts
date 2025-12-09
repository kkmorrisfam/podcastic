//set the API_BASE for all files to use

export const API_BASE = 
    import.meta.env.VITE_API_URL 
    || "http://localhost:5050";


// Do not use dotenv in the frontend. Vite reads variables at runtime
// that start with VITE_ and will use this 
// when in production on Vercel