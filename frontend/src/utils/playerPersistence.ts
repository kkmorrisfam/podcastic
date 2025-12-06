import { usePlayerStore } from "../stores/usePlayerStore";
import { getEpisode, getFavorites, getLibrary, getQueue, setFavorites, setQueue, upsertMany} from "../utils/storage";
import type { Episode } from "../utils/storage";
import { useAuthStore } from "../stores/useAuthStore";
import { fetchUserCollections, saveFavorites, saveLibrary, saveQueue } from "./collectionApi";

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

// 2) Snapshot current Zustand state back into localStorage or if logged in: database
async function persistSnapshot() {
  const { queue, library } = usePlayerStore.getState();
  const { isLoggedIn } = useAuthStore.getState();

  if(isLoggedIn()) {
    try {

      //make sure you are just saving episode data (local storage includes podcast and episoce data)
      const episodesOnly = Object.fromEntries(
        Object.entries(library).filter(([_, item])=> item.durationSec)  //durationSec is only in the episode type
      );

      await Promise.all([
        saveQueue(queue),
        saveLibrary(episodesOnly),
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
  usePlayerStore.getState().addToQueueStore(episode, opts);  //adds episode to queue state
  await persistSnapshot();                                  // adds episode state to queue database or local storage
}

export async function removeEpisodeFromQueueLocal(episodeId: string) {
  usePlayerStore.getState().removeFromQueueStore(episodeId);  //removed episode from queue state
  await persistSnapshot();                                    // removes episode state from queue database or local storage
}

// do I need this?
// export async function playEpisodesLocal(
//   episodes: Episode[],
//   startIndex = 0
// ) {
//   usePlayerStore.getState().playEpisode(episodes, startIndex);
//   await persistSnapshot();
// }


//***** use toggleFavoriteEpisode in collectionApi.ts */
// export async function updateEpisodeFromFavoritesLocal(episodeId: string) {
//   const {isLoggedIn} = useAuthStore.getState();

//   if(isLoggedIn()) {
//     try {
//       //get favorites from database
//       const { favorites } = await fetchUserCollections();
//       const isFav = favorites.includes(episodeId);
//       const nextFavorites = isFav ? favorites.filter((fid) => fid!==episodeId) : [...favorites, episodeId];
      
//       await saveFavorites(nextFavorites);
            
//     } catch (err) {
//       console.error("Failed to toggle favorite on backend", err);
//     }
//   } else {
//     //get favorites from localstorage
//     const localFavorites = getFavorites(); //returns string []
//     const isFav = localFavorites.includes(episodeId);
//     const nextFavorites = isFav ? localFavorites.filter((fid) => fid!==episodeId) : [...localFavorites, episodeId];
//     setFavorites(nextFavorites)   
    
//   }

// }

export async function loadFavoriteEpisodes(): Promise<Episode[]> {
  const { isLoggedIn } = useAuthStore.getState();

  if(isLoggedIn()) {
    const { favorites, library } = await fetchUserCollections();

    return favorites
      .map((id)=> library[id])
      .filter(Boolean);
  } else {
    const ids = getFavorites();
    const eps = ids
      .map((id) => getEpisode(id))
      .filter(Boolean) as Episode[];  

    return eps;
  }
}

