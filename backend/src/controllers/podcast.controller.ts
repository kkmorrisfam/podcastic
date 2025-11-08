import type { Request, Response } from 'express';
import { API_BASE, getHeaders } from '../utils/podcastIndex.js'
import { cacheGetJSON, cacheSetJSON, makeKey } from '../utils/cache.js';
import crypto from "crypto";

const PODCAST_INDEX_BASE = process.env.PODCAST_INDEX_BASE!;
const API_KEY = process.env.PODCAST_INDEX_KEY!;
const API_SECRET = process.env.PODCAST_INDEX_SECRET!;

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

export async function getTrending(_req: Request, res: Response) {
  try {
    const now = Math.floor(Date.now() / 1000);
    const hash = crypto
      .createHash("sha1")
      .update(API_KEY + API_SECRET + now)
      .digest("hex");

    const headers = {
      "User-Agent": "Podcastic/1.0",
      "X-Auth-Date": now.toString(),
      "X-Auth-Key": API_KEY,
      Authorization: hash,
    };

    const response = await fetch(`${PODCAST_INDEX_BASE}/podcasts/trending`, {
      headers,
    });

    if (!response.ok) throw new Error(`API returned ${response.status}`);

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching trending:", error);

    // fallback stub for offline/demo mode
    res.json({
      feeds: [
        {
          id: 1,
          title: "Sample Podcast 1",
          author: "Demo Author",
          image: "https://placehold.co/600x400?text=Podcast+1",
          url: "#",
        },
        {
          id: 2,
          title: "Sample Podcast 2",
          author: "Another Author",
          image: "https://placehold.co/600x400?text=Podcast+2",
          url: "#",
        },
      ],
    });
  }
}
