import { usePlayerStore } from "../stores/usePlayerStore";
import { getLibrary, getQueue, setQueue, upsertMany} from "../utils/storage";
import type { Episode } from "../utils/storage";

// 1) Hydrate store from localStorage
export async function hydratePlayerFromLocalStorage() {
  const library = getLibrary() ?? {};
  const queue = getQueue() ?? [];

  usePlayerStore.getState().hydrateFromPersistence(library, queue);
}

// 2) Snapshot current Zustand state back into localStorage
function persistSnapshotToLocalStorage() {
  const { queue, library } = usePlayerStore.getState();

  // Save queue exactly
  setQueue(queue);

  // Make sure all episodes currently in the store's library
  // are at least upserted into storage
  const episodes: Episode[] = Object.values(library);
  upsertMany(episodes);
}

// 3) High-level helpers for components to call

export async function addEpisodeToQueueLocal(
  episode: Episode,
  opts?: { toTop?: boolean; playIfEmpty?: boolean }
) {
  usePlayerStore.getState().addToQueueStore(episode, opts);
  persistSnapshotToLocalStorage();
}

export async function removeEpisodeFromQueueLocal(episodeId: string) {
  usePlayerStore.getState().removeFromQueueStore(episodeId);
  persistSnapshotToLocalStorage();
}

export async function playEpisodesLocal(
  episodes: Episode[],
  startIndex = 0
) {
  usePlayerStore.getState().playEpisode(episodes, startIndex);
  persistSnapshotToLocalStorage();
}
