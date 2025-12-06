import type { Episode } from "../utils/storage";
import {
  formatEpisodeDate,
  formatHHMMSS,
  isFavorite,
  toggleFavorite,
  // addToQueue,
} from "../utils/storage";
import { addEpisodeToQueueLocal, removeEpisodeFromQueueLocal } from "../utils/playerPersistence";
import { usePlayerStore } from "../stores/usePlayerStore";
import { API_BASE } from "../utils/config";

import { useEffect, useState } from "react";
import PlayButton from "./ui/PlayButton";
import { MdOutlineAddToQueue } from "react-icons/md";
import { toggleFavoriteEpisode } from "../utils/collectionApi";


type ApiEpisode = {
  id: number;
  title: string;
  episode: number;
  image: string | null;
  feedImage?: string;
  datePublished: number;
  duration: number;
  enclosureUrl: string;
  feedId: number;
};

function mapApiEpisodeToEpisode(api: ApiEpisode): Episode {
  return {
    id: api.id.toString(),
    title: api.title,
    image: api.image ?? api.feedImage ?? "",
    publishedAt: api.datePublished,
    durationSec: api.duration,
    audioUrl: api.enclosureUrl,
    feedImage: api.feedImage,
    episode: api.episode,
  };
}

export default function EpisodeView({ feedId }: { feedId: number }) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queue = usePlayerStore((state) => state.queue);

  useEffect(() => {
    if (!feedId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE}/api/podcast/episodes/byfeedid/${feedId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch episode details");
        }

        const data = await res.json();
        const apiEpisodes: ApiEpisode[] = data.items;

        const mappedEpisodes: Episode[] =
          apiEpisodes.map(mapApiEpisodeToEpisode);

        setEpisodes(mappedEpisodes);
      } catch (err) {
        console.error(err);
        setError("Unable to load episode details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [feedId]);


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
        <div className="mb-4 text-xl font-semibold">Latest Episodes</div>

        {loading && (
          <p className="text-center text-lg text-text-secondary animate-pulse">
            Loading podcasts...
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
                      toggleFavoriteEpisode(episode);
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
  );
}
