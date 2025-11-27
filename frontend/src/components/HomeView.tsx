import { useEffect, useState } from "react";
import {
  upsertMany,
  addToQueue,
  toggleFavorite,
  isFavorite,
} from "../utils/storage";

import { Link } from "react-router-dom";
import { MdOutlineAddToQueue } from "react-icons/md";


// Interface for podcast data from backend
interface Podcast {
  id: number;
  title: string;
  image: string;
  author: string;
  url: string;
}

/**
 * HomeView Component
 * Displays Trending Podcasts
 * Fetches from backend API and allows adding to favorites & queue.
 */
export default function HomeView() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Fetch trending podcasts from backend
  const fetchTrending = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:5050/api/podcast/trending");
      if (!res.ok) throw new Error("Failed to fetch podcasts");
      const data = await res.json();
      const feeds = data.feeds || [];

      // Convert & store in LocalStorage library
      upsertMany(
        feeds.map((f: Podcast) => ({
          id: String(f.id),
          podcastId: f.id,
          title: f.title,
          image: f.image,
          audioUrl: f.url, // not always an audio file, but kept for structure
          author: f.author,
          publishedAt: undefined,
          durationSec: undefined,
        }))
      );

      // Set state
      setPodcasts(feeds);
    } catch (err) {
      console.error(err);
      setError("Unable to load podcasts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  // Handle toggling favorites
  const handleToggleFavorite = (id: number) => {
    const newState = toggleFavorite(String(id));
    setFavorites((prev) => {
      const next = new Set(prev);
      if (newState) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  // Handle adding to queue
  const handleAddToQueue = (id: number) => {
    addToQueue(String(id));
  };

  return (
    <section className="w-full px-4 py-10 bg-bg)]">
      <h2 className="text-2xl font-bold mb-8 text-center text-text-primary)]">
        Trending Podcasts
      </h2>

      {loading && (
        <p className="text-center text-lg text-text-secondary)] animate-pulse">
          Loading podcasts...
        </p>
      )}

      {error && (
        <p className="text-center text-red-400 mt-4">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {podcasts.map((p) => {
            const fav = isFavorite(String(p.id));

            return (
              <div
                key={p.id}
                className="podcast-card rounded-xl overflow-hidden shadow-lg bg-surface)] hover:shadow-xl transition duration-300"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col justify-between min-h-[150px]">
                  <div>
                    <h3 className="font-semibold text-lg mb-1 truncate text-text-primary)]">
                      {p.title}
                    </h3>
                    <p className="text-sm text-text-secondary)] mb-3 truncate">
                      {p.author}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {/* Favorite Button */}
                    <button
                      onClick={() => handleToggleFavorite(p.id)}
                      className={`text-xl ${
                        fav ? "text-pink-400" : "text-text-secondary)]"
                      } hover:scale-110 transition`}
                      title={fav ? "Remove Favorite" : "Add Favorite"}
                    >
                      {fav ? "★" : "☆"}
                    </button>

                    {/* Add to Queue Button */}
                    <button
                      onClick={() => handleAddToQueue(p.id)}
                      className="text-2xl hover:scale-110 transition text-[var(--color-text-secondary)]"
                      title="Add to Queue"
                    >
                      <MdOutlineAddToQueue />
                    </button>

                    <Link
                      to={`/podcast/${p.id}`}
                      className="text-highlight)] text-sm hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
