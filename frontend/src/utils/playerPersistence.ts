import { usePlayerStore } from "../stores/usePlayerStore";
import { getLibrary, getQueue, setQueue, upsertMany} from "../utils/storage";
import type { Episode } from "../utils/storage";
import { useAuthStore } from "../stores/useAuthStore";
import { fetchUserCollections, saveLibrary, saveQueue } from "./collectionApi";

// Hydrate store from database if logged in
export async function hydratePlayer() {
  const { isLoggedIn } = useAuthStore.getState();
  if (isLoggedIn()) {
    // logged in → hydrate from backend
    try {
      const { library, queue } = await fetchUserCollections();
      usePlayerStore
        .getState()
        .hydrateFromPersistence(library ?? {}, queue ?? []);
    } catch (e) {
      console.error("Failed to hydrate from backend, falling back to local", e);
      await hydratePlayerFromLocalStorage();
    }
  } else {
    // guest
    await hydratePlayerFromLocalStorage();
  }
}


// 1) Hydrate store from localStorage
export async function hydratePlayerFromLocalStorage() {
  const library = getLibrary() ?? {};
  const queue = getQueue() ?? [];

  usePlayerStore.getState().hydrateFromPersistence(library, queue);
}

// 2) Snapshot current Zustand state back into localStorage
async function persistSnapshot() {
  const { queue, library } = usePlayerStore.getState();
  const { isLoggedIn } = useAuthStore.getState();

  if(isLoggedIn()) {
    try {
      await Promise.all([
        saveQueue(queue),
        saveLibrary(library),
        //move save favorites to here?
      ])

    } catch (err) {
      console.error("Failed to sync player state to backend", err);
    }
  } else {
    // Save queue 
    setQueue(queue);

    // Make sure all episodes currently in the store's library
    // are at least upserted into storage
    const episodes: Episode[] = Object.values(library);
    upsertMany(episodes);

  }
}

// 3) High-level helpers for components to call

export async function addEpisodeToQueueLocal(
  episode: Episode,
  opts?: { toTop?: boolean; playIfEmpty?: boolean }
) {
  usePlayerStore.getState().addToQueueStore(episode, opts);
  persistSnapshot();
}

export async function removeEpisodeFromQueueLocal(episodeId: string) {
  usePlayerStore.getState().removeFromQueueStore(episodeId);
  persistSnapshot();
}

export async function playEpisodesLocal(
  episodes: Episode[],
  startIndex = 0
) {
  usePlayerStore.getState().playEpisode(episodes, startIndex);
  persistSnapshot();
}
