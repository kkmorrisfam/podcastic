import type { Request, Response } from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { error } from "console";

dotenv.config();

// Environment variable validation
if (!process.env.PODCAST_INDEX_KEY || !process.env.PODCAST_INDEX_SECRET) {
  console.error("Missing Podcast Index credentials in .env file!");
  console.error("Make sure these exist:");
  console.error("PODCAST_INDEX_KEY=xxxx");
  console.error("PODCAST_INDEX_SECRET='erD$Q$pNXq9nUrqWHFztt66YEK9NaSH92F#jXQMs'");
  process.exit(1);
}

const API_BASE = process.env.PODCAST_INDEX_BASE!;
const API_KEY = process.env.PODCAST_INDEX_KEY!;
const API_SECRET = process.env.PODCAST_INDEX_SECRET!;

/**
 * Build headers for Podcast Index API authentication
 */
function getHeaders() {
  const now = Math.floor(Date.now() / 1000);

  // Debug log to confirm values are valid
  if (!API_KEY || !API_SECRET) {
    console.error("Missing API key or secret in getHeaders()");
    throw new Error("Missing Podcast Index credentials");
  }

  // Defensive check for numeric time
  if (Number.isNaN(now)) {
    console.error("Invalid timestamp generated for hashing");
    throw new Error("Invalid timestamp");
  }

  const hash = crypto
    .createHash("sha1")
    .update(API_KEY + API_SECRET + now.toString()) // ensure now is a string
    .digest("hex");

  return {
    "User-Agent": "PodcasticApp/1.0",
    "X-Auth-Date": now.toString(),
    "X-Auth-Key": API_KEY,
    Authorization: hash,
  };
}

/**
 * GET /api/podcast/trending
 * Fetches trending podcasts from Podcast Index API
 */
export async function getTrending(_req: Request, res: Response) {
  try {
    const lang = (_req.query.lang as string) || "en";
    // console.log("request.query.lang: " + _req.query.lang);

    const response = await fetch(`${API_BASE}/podcasts/trending?max=20&lang=${lang}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API responded with ${response.status}: ${text}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("[getTrending] Error:", err);

    // fallback demo data for local testing
    return res.json({
      feeds: [
        {
          id: 1,
          title: "Sample Podcast",
          author: "Demo Author",
          image: "https://placehold.co/600x400?text=Podcast+1",
          url: "#",
        },
      ],
    });
  }
}

async function fetchFromPodcastIndex(endpoint: string) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`PodcastIndex error ${res.status}`);
  return res.json();
}


/**
 * GET /api/podcast/search?term=christmas
 * Fetches podcasts by search term from Podcast Index API
 */
export async function searchByTerm(req: Request, res: Response) {
  try {
    const term = (req.query.term ?? "christmas") as string;

    const response = await fetch(
      `${API_BASE}/search/byterm?q=${encodeURIComponent(term)}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API responded with ${response.status}: ${text}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("[searchByTerm] Error:", err);
    res.status(500).json({ error: "Failed to search podcasts" });
  }
}

/**
 * GET /api/podcast/detail/:id
 * Fetches a single podcast's details from Podcast Index API
 */
export async function getPodcastDetail(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Missing podcast id parameter" });
    }

    const response = await fetch(
      `${API_BASE}/podcasts/byfeedid?id=${encodeURIComponent(id)}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API responded with ${response.status}: ${text}`);
    }

    const data = await response.json();

    // PodcastIndex returns an object with a `feed` property for this endpoint
    return res.json(data);
  } catch (err) {
    console.error("[getPodcastDetail] Error:", err);
    return res.status(500).json({ error: "Failed to load podcast details" });
  }
}


/**
 * GET /api/podcast/episodes/byfeedid/:feedid
 * Postman: {{apiBase}}/episodes/byfeedid?id=3957526&max=10
 * Fetches a single podcast's array of episodes from Podcast Index API
 */

export async function getEpisodes(req: Request, res: Response) {
  try {
    const feedid = req.params.feedid;

    // console.log("req.params.feedid " + feedid);
    if (!feedid) {
      return res.status(400).json({ error: "Missing podcast id parameter" });
    }

    const response = await fetch(
      `${API_BASE}/episodes/byfeedid?id=${encodeURIComponent(feedid)}&max=10`,
      { headers: getHeaders() }
    );

    // console.log("api response: " + response);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API responded with ${response.status}: ${text}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("[searchByTerm] Error:", err);
    res.status(500).json({ error: "Failed to search podcasts" });
  }
} 


/**
 * GET /api/podcast/episodes/byid/:id 
 * Postman: {{apiBase}}/episodes/byid?id=43274934662
 * Fetches a single podcast's episode from Podcast Index API
 */
export async function getEpisodeById(req: Request, res: Response) {
  try {
    const id = req.params.id;

    // console.log("req.params.id " + id);

    if (!id) {
      return res.status(400).json({ error: "Missing podcast id parameter" });
    }

    const response = await fetch(
      `${API_BASE}/episodes/byid?id=${encodeURIComponent(id)}`,
      { headers: getHeaders() }
    );
    // console.log("api response: " + response);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API responded with ${response.status}: ${text}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("[searchByTerm] Error:", err);
    res.status(500).json({ error: "Failed to search podcasts" });
  }

}

