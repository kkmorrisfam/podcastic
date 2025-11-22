/**
 * Central API helper for Podcastic frontend.
 * Uses Vite environment variables for automatic dev/prod switching.
 */

// Read backend URL from environment
const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  console.warn(
    "VITE_API_URL is not defined. Please set it in .env or .env.local file."
  );
}

// Generic GET wrapper with error handling
async function getJSON<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API GET ${endpoint} failed (${res.status})`);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

// ===============================
// API FUNCTIONS
// ===============================

// 1. Trending Podcasts
export function fetchTrending() {
  return getJSON<{ feeds: any[] }>(`/api/podcast/trending`);
}

// 2. Search Podcasts
export function searchPodcasts(term: string) {
  return getJSON<{ feeds: any[] }>(
    `/api/podcast/search?term=${encodeURIComponent(term)}`
  );
}

// 3. Podcast Detail
export function fetchPodcastDetail(id: string | number) {
  return getJSON<{ feed: any }>(
    `/api/podcast/detail/${encodeURIComponent(id)}`
  );
}

// Future endpoints can go here:
// - fetchEpisodes(feedId)
// - fetchEpisodeAudio(episodeId)
// - syncFavorites()
// - syncQueue()

export const api = {
  fetchTrending,
  searchPodcasts,
  fetchPodcastDetail,
};
