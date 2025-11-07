import type { Request, Response } from 'express';
import { API_BASE, getHeaders } from '../utils/podcastIndex.js'
import { cacheGetJSON, cacheSetJSON, makeKey } from '../utils/cache.js';

// GET api 
export async function searchByTerm(req: Request, res: Response) {
    try {
        //get term in url
        const rawTerm = (req.query.term ?? 'christmas') as string;
        const term = rawTerm.trim();

        //build cache key
        const key = makeKey('byterm', term.toLowerCase());

        // try to retrieve from cache first
        const cached = await cacheGetJSON<any>(key);
        if (cached) {
             res.setHeader('X-Cache', 'HIT');  //just meta data for info, not necessary
            return res.json(cached);
        }

        // if not cached, call Podcast Index API
        const url = `${API_BASE}/search/byterm?q=${encodeURIComponent(term)}`;
        const response = await fetch(url, { headers: getHeaders() });


        if(!response.ok) {
            const text = await response.text().catch(()=> '');
            throw new Error(`Podcast Index error ${response.status}: ${text || response.statusText}`);
        }

        const data = await response.json();

        //save cache for next time
        await cacheSetJSON(key, data);

        res.setHeader('X-Cache', 'MISS');  //just meta data for info, not necessary
        return res.json(data);
        
    } catch (error:any) {
        console.error('[searchByTerm]', error?.message || error);
        return res.status(500).json({error: error?.message || 'Internal Server Error'});       
    }
}