import { useAuthStore } from "../stores/useAuthStore";
import { apiFetch } from "./api";
import { API_BASE } from "./config";
import { getFavorites, setFavorites, getLibrary } from "./storage";
import type { Episode } from "./storage";

export async function fetchUserCollections() {
  const res = await apiFetch(`${API_BASE}/api/user/me`);
  if (!res.ok) throw new Error("Failed to load collections");
  return res.json() as Promise<{
    library: Record<string, any>;
    favorites: string[];
    queue: { episodeId: string }[];
  }>;
}

export async function saveLibrary(library: Record<string, any>) {
  const res = await apiFetch(`${API_BASE}/api/user/me/library`, {
    method: "POST",
    body: JSON.stringify({ library }),
  });
  if (!res.ok) throw new Error("Failed to save library");
  return res.json();
}

export async function saveFavorites(favorites: string[]) {
  const res = await apiFetch(`${API_BASE}/api/user/me/favorites`, {
    method: "POST",
    body: JSON.stringify({ favorites }),
  });
  if (!res.ok) throw new Error("Failed to save favorites");
  return res.json();
}

export async function saveQueue(queue: { episodeId: string }[]) {
  const res = await apiFetch(`${API_BASE}/api/user/me/queue`, {
    method: "POST",
    body: JSON.stringify({ queue }),
  });
  if (!res.ok) throw new Error("Failed to save queue");
  return res.json();
}

export async function toggleFavoriteEpisode(episode: Episode): Promise<boolean> {
  const { isLoggedIn } = useAuthStore.getState();

  //toggle locally - add or delete id from favorites array
  const current = new Set(getFavorites());
  if(current.has(episode.id)) {
    current.delete(episode.id);
  } else {
    current.add(episode.id);
  }

  const favArray = Array.from(current);
  setFavorites(favArray);

  //double check that episode data is in local storage
  const localEpisodeRecord = getLibrary();
  if (!localEpisodeRecord[episode.id]) {
    localEpisodeRecord[episode.id] = episode;
  }

  // if logged in, sync local with database
  if(isLoggedIn()) {
    const episodesOnly = Object.fromEntries(
        Object.entries(localEpisodeRecord).filter(([_, item])=> item.durationSec)  //durationSec is only in the episode type
    );

    try {
      await Promise.all([
        saveFavorites(favArray),     
        saveLibrary(episodesOnly),
      ])
    } catch (error) {
      console.error("Failed to sync favorites to backend", error);
    }
  } 

  return current.has(episode.id);
}