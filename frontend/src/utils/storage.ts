// ================================
// Podcastic Storage Utilities
// Handles: Library, Favorites, Library, Queue, and Settings
// ================================

// what are the keys called in local storage...
const NS = "pp"; 
export const STORAGE_KEYS = {
  LIBRARY: `${NS}.library.v1`,    //master user library and storage cache for all podcasts and episodes
  FAVORITES: `${NS}.favorites.v1`,
  QUEUE: `${NS}.queue.v1`,
  SETTINGS: `${NS}.settings.v1`,
  PODCAST_LIBRARY: `${NS}.podcastLibrary.v1`,  //user library
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// ---------- Types ----------  
export type Episode = {
  id: string;  //this comes from api as a number
  title: string;
  audioUrl: string;
  podcastId?: number;
  image?: string;
  author?: string;
  durationSec?: number;
  publishedAt?: number;
  episode: number;
  feedImage?: string;
};

export type Library = Record<string, Episode>;
export type Favorites = string[];
export type QueueItem = { episodeId: string };
export type Queue = QueueItem[];

export type PodcastSummary = {
  id: string;        // podcast feed id as string
  title: string;
  image: string;
  author?: string;
  url?: string; 
};

export type PodcastLibrary = Record<string, PodcastSummary>;

// ---------- Safe JSON Helpers ----------
function readJSON<T>(key: StorageKey, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    writeJSON(key, fallback);
    return fallback;
  }
}

function writeJSON<T>(key: StorageKey, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Storage write failed:", e);
  }
}

// =====================================================
// LIBRARY (Episodes Dictionary)
// =====================================================
export function getLibrary(): Library {
  return readJSON<Library>(STORAGE_KEYS.LIBRARY, {});   //from the key pp.library.v1 get the values, return as json
}

export function upsertEpisode(ep: Episode): void {
  const lib = getLibrary();
  lib[ep.id] = { ...(lib[ep.id] ?? {}), ...ep };  // look up field w/ id, if exists, use it, else use {}, then overwrite those fields with new episode data
  writeJSON(STORAGE_KEYS.LIBRARY, lib);           // write at key pp.library.v1, value of episode id passed in
}

export function upsertMany(episodes: Episode[]): void {
  if (!episodes?.length) return;
  const lib = getLibrary();
  for (const ep of episodes) lib[ep.id] = { ...(lib[ep.id] ?? {}), ...ep };
  writeJSON(STORAGE_KEYS.LIBRARY, lib);
}

export function getEpisode(id: string): Episode | undefined {
  return getLibrary()[id];
}

export function removeEpisode(id: string): void {
  const lib = getLibrary();
  delete lib[id];
  writeJSON(STORAGE_KEYS.LIBRARY, lib);
}

// =====================================================
// PODCAST LIBRARY (Saved Podcasts / Shows)
// =====================================================

export function getPodcastLibrary(): PodcastLibrary {
  return readJSON<PodcastLibrary>(STORAGE_KEYS.PODCAST_LIBRARY, {});
}

export function setPodcastLibrary(lib: PodcastLibrary): void {
  writeJSON(STORAGE_KEYS.PODCAST_LIBRARY, lib);
}

export function addPodcastToLibrary(p: PodcastSummary): void {
  const lib = getPodcastLibrary();
  lib[p.id] = { ...(lib[p.id] ?? {}), ...p };
  setPodcastLibrary(lib);
}

export function removePodcastFromLibrary(id: string): void {
  const lib = getPodcastLibrary();
  delete lib[id];
  setPodcastLibrary(lib);
}

export function isPodcastInLibrary(id: string): boolean {
  const lib = getPodcastLibrary();
  return !!lib[id];
}

export function listPodcastLibrary(): PodcastSummary[] {
  return Object.values(getPodcastLibrary());
}

// =====================================================
// FAVORITES (Array of Episode IDs)
// =====================================================
export function getFavorites(): Favorites {
  return readJSON<Favorites>(STORAGE_KEYS.FAVORITES, []);
}

export function setFavorites(favs: Favorites): void {
  const unique = Array.from(new Set(favs));
  writeJSON(STORAGE_KEYS.FAVORITES, unique);
}

export function isFavorite(episodeId: string): boolean {
  return getFavorites().includes(episodeId);
}

export function toggleFavorite(episodeId: string): boolean {
  const favs = new Set(getFavorites());
  if (favs.has(episodeId)) {
    favs.delete(episodeId);
  } else {
    favs.add(episodeId);
  }
  setFavorites([...favs]);
  return favs.has(episodeId);
}

// =====================================================
// QUEUE (Ordered Array of Episode IDs)
// =====================================================
export function getQueue(): Queue {
  return readJSON<Queue>(STORAGE_KEYS.QUEUE, []);
}

export function setQueue(queue: Queue): void {
  const seen = new Set<string>();
  const normalized: Queue = [];
  for (const item of queue) {
    if (!item?.episodeId) continue;
    if (seen.has(item.episodeId)) continue;
    seen.add(item.episodeId);
    normalized.push({ episodeId: item.episodeId });
  }
  writeJSON(STORAGE_KEYS.QUEUE, normalized);
}

export function addToQueue(episodeId: string, toTop = false): void {
  const q = getQueue();
  if (q.find((i) => i.episodeId === episodeId)) return;
  const updated = toTop ? [{ episodeId }, ...q] : [...q, { episodeId }];
  setQueue(updated);
}

export function removeFromQueue(episodeId: string): void {
  const updated = getQueue().filter((i) => i.episodeId !== episodeId);
  setQueue(updated);
}

export function moveInQueue(episodeId: string, newIndex: number): void {
  const q = getQueue();
  const idx = q.findIndex((i) => i.episodeId === episodeId);
  if (idx < 0) return;
  const [item] = q.splice(idx, 1);
  const clamped = Math.max(0, Math.min(newIndex, q.length));
  q.splice(clamped, 0, item);
  setQueue(q);
}

export function clearQueue(): void {
  setQueue([]);
}

export function nextInQueue(currentId?: string): string | undefined {
  const q = getQueue();
  if (!q.length) return undefined;
  if (!currentId) return q[0]?.episodeId;
  const idx = q.findIndex((i) => i.episodeId === currentId);
  return idx >= 0 ? q[idx + 1]?.episodeId : q[0]?.episodeId;
}

export function prevInQueue(currentId: string): string | undefined {
  const q = getQueue();
  const idx = q.findIndex((i) => i.episodeId === currentId);
  return idx > 0 ? q[idx - 1]?.episodeId : undefined;
}

// =====================================================
// CROSS-TAB SYNC (Optional)
// =====================================================
export function bindStorageSync(onChange: (key: StorageKey) => void): () => void {
  function handler(e: StorageEvent) {
    if (e.storageArea !== localStorage || !e.key) return;
    const watchedKeys = Object.values(STORAGE_KEYS);
    if (watchedKeys.includes(e.key as StorageKey)) {
      onChange(e.key as StorageKey);
    }
  }
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

// =====================================================
// CLEANUP UTILITIES (Optional)
// =====================================================
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  console.log("🧹 Cleared all podcastic LocalStorage data.");
}

// ==========================================================
// format date into "MMM DD YYYY" format, and leave off year if year == current
// ==========================================================
export function formatEpisodeDate(secondsToDate?: number): string {
   if (!secondsToDate) return "Unknown date";

  // Convert seconds to milliseconds
  const date = new Date(secondsToDate * 1000);

  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();

  const options: Intl.DateTimeFormatOptions = sameYear
    ? { month: "short", day: "numeric" }              // "Nov 18"
    : { month: "short", day: "numeric", year: "numeric" }; // "Nov 18, 2023"

  return date.toLocaleDateString(undefined, options);
}

// ==========================================================
// format duration into HH:MM:SS format
// ==========================================================

export function formatHHMMSS(secondsToHours?: number): string {
  if (!secondsToHours) return "00";

  const dateObject = new Date(secondsToHours * 1000);
  const hours = dateObject.getUTCHours();
  const minutes = dateObject.getUTCMinutes();
  const seconds = dateObject.getSeconds();

  const timeString = hours.toString().padStart(2,'0') + ':' + minutes.toString().padStart(2,'0') + ':' + seconds.toString().padStart(2, '0');

  return timeString;

}
