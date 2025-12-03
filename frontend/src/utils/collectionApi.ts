import { apiFetch } from "./api";
import { API_BASE } from "./config";

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