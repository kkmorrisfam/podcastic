import { useEffect, useState } from "react";
import PlayButton from "./ui/PlayButton";
import { formatEpisodeDate, formatHHMMSS, type Episode } from "../utils/storage";
// import { useAuthStore } from "../stores/useAuthStore";
// import { fetchUserCollections } from "../utils/collectionApi";
import { loadFavoriteEpisodes } from "../utils/playerPersistence";
import { toggleFavoriteEpisode } from "../utils/collectionApi";

export default function FavoritesView() {
//   const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
  
    async function load() {
        try{
          setLoading(true);
          setError(null);

          const favoriteEpisodes = await loadFavoriteEpisodes();
          setEpisodes(favoriteEpisodes);
        } catch (error) {
          console.error("Failed to get favorites.", error);
          setError("Failed to load favorites");
        } finally {
          setLoading(false);
        }     
     }

    load()

  }, []);

  useEffect(() => {
  document.title = "Favorite Episodes • Podcastic";
}, []);


  const handleToggleFavorite = async (episode: Episode) => {
    
    try {
      setLoading(true);
      setError(null);
      // add or remove from database or from local storage
      // await updateEpisodeFromFavoritesLocal(id);
      await toggleFavoriteEpisode(episode);
      const favoriteEpisodes = await loadFavoriteEpisodes(); 
      setEpisodes(favoriteEpisodes);  
    } catch(err) {
      console.error("Failed to toggle favorite.", err);
      setError("Failed to update favorites");
    } finally {
      setLoading(false);
    }
    

  };

  return (
    <>
      <section className="w-full px-4 py-10 bg-bg">
        <h1 className="text-3xl font-bold mb-8 text-text-primary text-center">
          ⭐ Favorite Episodes
        </h1>
      
      {loading && (
        <p className="text-center text-lg text-text-secondary animate-pulse">
            Loading Favorite Episodes...
        </p>        
      )}
      { error && <p className="text-center text-accent mt-4">{error}</p>}
    
      {!loading && !error && (
       <>
        {episodes.length === 0 && (
          <p className="text-center text-text-secondary">
              You haven’t favorited any episodes yet.
           </p>
         )}

         {episodes.length > 0 && (
          <div className="space-y-4 max-w-4xl mx-auto">
           {episodes.map((ep) => (
            <div
              key={ep.id}
              className="grid items-center gap-x-4 py-3 border-b border-slate-300 
                         grid-cols-[80px_1fr_120px_90px_80px]"
            >
              {/* Episode Image */}
              <div className="h-20 w-20 overflow-hidden rounded-md">
                <img
                  src={ep.image || ep.feedImage}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <div className="min-w-0">
                <p className="truncate font-medium">{ep.title}</p>
                <p className="text-sm text-text-secondary">
                  {formatEpisodeDate(ep.publishedAt)}
                </p>
              </div>

              {/* Duration */}
              <div className="text-sm text-text-secondary">
                {formatHHMMSS(ep.durationSec)}
              </div>

              {/* Unfavorite button */}
              <button
                onClick={() => handleToggleFavorite(ep)}
                className="text-xl text-pink-400 hover:scale-110 transition"
                title="Remove from Favorites"
              >
                ★
              </button>

              {/* Play */}
              <PlayButton episode={ep} />
            </div>
            ))}
          </div>
        )}


       </>
      )}
    

      

      
    </section>
    </>
  );
}
