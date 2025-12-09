import { useAuthStore } from "../stores/useAuthStore";
import { apiFetch } from "./api";
import { API_BASE } from "./config";
import { getFavorites, setFavorites, getLibrary, getPodcastLibrary, addPodcastToLibrary, isPodcastInLibrary, removePodcastFromLibrary } from "./storage";
import type { Episode, PodcastSummary } from "./storage";


// Retrieves user collections from database via backend api
export async function fetchUserCollections() {
  const res = await apiFetch(`${API_BASE}/api/user/me`);
  if (!res.ok) throw new Error("Failed to load collections");
  return res.json() as Promise<{
    library: Record<string, any>;
    favorites: string[];
    queue: { episodeId: string }[];
    podcastLibrary: Record<string, any>;
  }>;
}


//Saves podcast object update to the database via backend api
export async function saveLibrary(library: Record<string, any>) {
  // console.log("👋 inside saveLibrary");
  const res = await apiFetch(`${API_BASE}/api/user/me/library`, {
    method: "POST",
    body: JSON.stringify({ library }),
  });
  if (!res.ok) throw new Error("Failed to save library");
  return res.json();
}


// Saves changes (add or delete) an episode Id to the database via backend api
export async function saveFavorites(favorites: string[]) {
  // console.log("👋 inside saveFavorites");
  const res = await apiFetch(`${API_BASE}/api/user/me/favorites`, {
    method: "POST",
    body: JSON.stringify({ favorites }),
  });
  if (!res.ok) throw new Error("Failed to save favorites");
  return res.json();
}

// Saves changes (add or delete) an episode Id to the database via backend api
export async function saveQueue(queue: { episodeId: string }[]) {
  const res = await apiFetch(`${API_BASE}/api/user/me/queue`, {
    method: "POST",
    body: JSON.stringify({ queue }),
  });
  if (!res.ok) throw new Error("Failed to save queue");
  return res.json();
}

// Saves changes (add or delete) podcast object to the database via backend api
export async function savePodcasts(podcastLibrary: Record<string, any>) {
  // console.log("Inside savePodcasts");
  // console.log(JSON.stringify({podcastLibrary}));
  // console.log("API_BASE in savePodcast", API_BASE);
  const res = await apiFetch(`${API_BASE}/api/user/me/updateMyPodcasts`, {
    method: "POST",
    body: JSON.stringify({ podcastLibrary }),
  });
  if (!res.ok) throw new Error("Failed to save my podcasts on backend");
  return res.json();
}

// checks of user is logged in, ad or delete Id from favorites array always in local storage and if logged in, in the database
// favorites is saved as an array of Ids, not objects. references the library by Id for the episode object.
export async function toggleFavoriteEpisode(episode: Episode): Promise<boolean> {

  const { isLoggedIn } = useAuthStore.getState();

  // console.log("toggleFavoriteEpisode called with", episode.id, "logged in?", isLoggedIn());

  //toggle locally - add or delete id from favorites array
  const current = new Set(getFavorites());
  if(current.has(episode.id)) {
    current.delete(episode.id);
  } else {
    current.add(episode.id);
  }

  const favArray = Array.from(current);
  setFavorites(favArray);

  //double check that podcast data is in local storage
  const localEpisodeRecord = getLibrary();
  if (!localEpisodeRecord[episode.id]) {
    localEpisodeRecord[episode.id] = episode;
  }

  // if logged in, sync local with database
  // for future - library will update, but not delete on database.  Need to make changes to backend routes, or create separate favorites and queue library
  if(isLoggedIn()) {
    const episodesOnly = Object.fromEntries(
        Object.entries(localEpisodeRecord).filter(([_, item])=> item.durationSec)  //durationSec is only in the episode type
    );
    // console.log("isLoggedIn and episodeOnly object: ", JSON.stringify(episodesOnly));
    // console.log("favArray: ", favArray);
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

//checks if user is logged in. Always adds or deletes podcast object from local storage, if logged in, adds or removes object in database
export async function toggleUpdatePodcastLibrary(podcast: PodcastSummary): Promise<boolean> {
  // console.log("Inside toggleUpdatePodcastLibrary")
  const { isLoggedIn } = useAuthStore.getState();  

  //toggle locally - add or delete id from local
  const podcastId = String(podcast.id);  //get the id from the podcast summary object

  //with id, check if podcast is in local library 
  // if in local library, remove
  let isInLibrary = false;
  
  if (isPodcastInLibrary(podcastId)) {
    removePodcastFromLibrary(podcastId);
    isInLibrary = false;
  } else {
    addPodcastToLibrary(podcast);
    isInLibrary = true;    
  } 

  // if logged in, sync local with database.- there is only a podcastLibrary, not an additional array, like favorites & queue, to sync
  if(isLoggedIn()) {   
    
    try {
      const libraryMap = getPodcastLibrary();  //this only works if local storage is correct.

      await savePodcasts(libraryMap);
    } catch (error) {
      console.error("Failed to sync favorites to backend", error);
    }
  } 

  return isInLibrary;
}