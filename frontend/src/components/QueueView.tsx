import { useState, useEffect } from "react"
// import { getEpisode, toggleFavorite, formatEpisodeDate, formatHHMMSS, isFavorite } from "../utils/storage"
import { formatEpisodeDate, formatHHMMSS } from "../utils/storage"
import PlayButton from "./ui/PlayButton";
import { MdOutlineAddToQueue } from "react-icons/md";
import type { Episode } from "../utils/storage";
import { usePlayerStore } from "../stores/usePlayerStore";
import { addEpisodeToQueueLocal, removeEpisodeFromQueueLocal } from "../utils/playerPersistence";

export const QueueView = () => {

  const queue = usePlayerStore((state) => state.queue);  //get ids
  const episodeLibrary = usePlayerStore((state) => state.library);  //get library
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //get on initial render
  useEffect(()=> {
    try {
        setLoading(true);
        setError(null);

        //get queue from store, which get's from storage        
        const episodes = queue
            .map((item) => episodeLibrary[item.episodeId])  //look up id
            .filter((ep): ep is Episode => Boolean(ep));   // don't inclue missing ones

            // queue.forEach((key) => {
        //   if (episodeLibrary.hasOwnProperty(key)) {
        //     episodes[key] = episodeLibrary[key];
        //   }
        // })

        setEpisodes(episodes);
    } catch (err) {
        console.error(err);
        setError("Unable to load queue. Please try again later.");
    } finally {
        setLoading(false);
    }

  },[queue]);

  useEffect(() => {
  document.title = "My Playlist • Podcastic";
}, []);
 
 
  if (!episodes.length) return <h2>Your queue is empty.</h2>;

  const handleQueueClick = async (episode: Episode) => {
      const isInQueue = queue.some((item) => item.episodeId === episode.id);
  
      if (isInQueue) {
        await removeEpisodeFromQueueLocal(episode.id);
      } else {
        await addEpisodeToQueueLocal(episode, {
          toTop: false,
          playIfEmpty: true,
        });
      }
    };

  return (
    <>
      <div>
        <div className="mb-4 text-xl font-semibold">My Playlist</div>

        {loading && (
          <p className="text-center text-lg text-text-secondary animate-pulse">
            Loading Playlist...
          </p>
        )}

        {error && <p className="text-center text-accent mt-4">{error}</p>}

        {!loading && !error && (
          <div>
            {episodes.map((episode) => (             

              <div
                key={episode.id}
                className="flex flex-col items-center gap-2 py-3 border-b border-slate-200
                  sm:grid sm:items-center sm:gap4
                  sm:grid-cols-[80px_60px_minmax(0,2fr)_120px_auto]"
              >
                {/* Thumbnail */}
                <div className="hidden sm:block h-20 w-20 overflow-hidden rounded-md">
                  <img
                    src={episode.image || episode.feedImage}
                    alt={episode.title}
                    className="w-full h-20 object-cover"
                  />
                </div>

                {/* Episode number */}
                {episode.episode ? (
                  <div className="hidden sm:block text-sm text-text-secondary">
                    # {episode.episode}
                  </div>
                ) : (
                  <div></div>
                )}

                {/* Title */}
                <div className="min-w-0 sm:col-span-1 w-full overflow-hidden">
                  <p className="truncate font-medium">{episode.title}</p>
                </div>
                {/* Episode Date */}
                <div className="hidden sm:block text-sm text-text-secondary 
                      whitespace-nowrap"> 
                    {formatEpisodeDate(episode.publishedAt)} 
                </div>

                {/* Duration + Favorite + Queue + Play (ALL INLINE) */}
                <div className="flex items-center justify-start gap-6">
                  {/* Duration */}
                  <span className="text-sm text-text-secondary">
                    {formatHHMMSS(episode.durationSec) ?? "00"}
                  </span>

                  {/* Favorite Button */}
                  <button
                    onClick={() => {
                      toggleFavorite(episode.id.toString());
                      setEpisodes((prev) => [...prev]);
                    }}
                    className={`text-xl transition hover:scale-110 ${
                      isFavorite(episode.id.toString())
                        ? "text-pink-400"
                        : "text-text-secondary"
                    }`}
                    title={
                      isFavorite(episode.id.toString())
                        ? "Remove from Favorites"
                        : "Add to Favorites"
                    }
                  >
                    {isFavorite(episode.id.toString()) ? "★" : "☆"}
                  </button>

                  {/* Queue Button */}
                  
                  <button
                    onClick={() => { void handleQueueClick(episode); }}
                    className="text-2xl hover:scale-110 transition text-text-secondary"
                    title={
                      queue.some((item) => item.episodeId === episode.id)
                        ? "Remove from Queue"
                        : "Add to Queue"
                    } 
                  >
                    <MdOutlineAddToQueue />
                  </button>

                  {/* Play Button */}
                  <PlayButton episode={episode} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </>
  )
}
