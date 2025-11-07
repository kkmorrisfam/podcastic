import crypto from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

// console.log("🔑 Key:", process.env.PODCAST_INDEX_KEY);
// console.log("🔒 Secret:", process.env.PODCAST_INDEX_SECRET);


export function getHeaders() {    
    const key = process.env.PODCAST_INDEX_KEY;
    const secret = process.env.PODCAST_INDEX_SECRET;

    if (!key || !secret) {
        throw new Error('Podcast Index key or secret are missing')
    }

    //get current date for header
    const now = Math.floor(Date.now() / 1000);

    // create SHA1(apiKey + apiSecret + apiHeaderTime) hash
    // required by api
    const hash = crypto
        .createHash('sha1')
        .update(key + secret + now)
        .digest('hex');

    return {
        'User-Agent': 'Podcastic/1.0',
        'X-Auth-Date': String(now),
        'X-Auth-Key': key,
        'Authorization': hash,
        'Content-Type': 'application/json',
    };
}

export const API_BASE = "https://api.podcastindex.org/api/1.0";