import { useEffect, useState } from "react";
import { getFavorites, getEpisode, toggleFavorite } from "../utils/storage";
import PlayButton from "./ui/PlayButton";
import { formatEpisodeDate, formatHHMMSS } from "../utils/storage";

export default function FavoritesView() {
//   const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);

  useEffect(() => {
    const ids = getFavorites();
    const eps = ids
      .map((id) => getEpisode(id))
      .filter(Boolean); // remove nulls if any episodes missing

    setEpisodes(eps);
  }, []);

  useEffect(() => {
  document.title = "Favorite Episodes • Podcastic";
}, []);


  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);

    // Refresh UI
    const ids = getFavorites();
    setEpisodes(ids.map((fid) => getEpisode(fid)).filter(Boolean));
  };

  return (
    <section className="w-full px-4 py-10 bg-bg">
      <h1 className="text-3xl font-bold mb-8 text-text-primary text-center">
        ⭐ Favorite Episodes
      </h1>

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
                onClick={() => handleToggleFavorite(ep.id)}
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
    </section>
  );
}
