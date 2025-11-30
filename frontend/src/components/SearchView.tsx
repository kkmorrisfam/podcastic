import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import {
  upsertMany,
  isFavorite,
  toggleFavorite,
  addPodcastToLibrary,
  removePodcastFromLibrary,
  isPodcastInLibrary,
} from "../utils/storage";

import { LuLibrary } from "react-icons/lu";
interface Podcast {
  id: number;
  title: string;
  image: string;
  author: string;
  url: string;
}

export default function SearchView() {
  const [params] = useSearchParams();
  const term = params.get("term") || "";

  const [results, setResults] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!term) return;
    fetchResults(term);
  }, [term]);

  const fetchResults = async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://localhost:5050/api/podcast/search?term=${encodeURIComponent(
          query
        )}`
      );
      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      const feeds = data.feeds || [];

      setResults(feeds);

      // Save to LocalStorage
      upsertMany(
        feeds.map((p: Podcast) => ({
          id: String(p.id),
          title: p.title,
          image: p.image,
          audioUrl: p.url,
          author: p.author,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Unable to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (id: number) => {
    toggleFavorite(String(id));
    setResults((prev) => [...prev]); // force UI update
  };

  const handleToggleLibrary = (p: Podcast) => {
    const idStr = String(p.id);

    if (isPodcastInLibrary(idStr)) {
      removePodcastFromLibrary(idStr);
    } else {
      addPodcastToLibrary({
        id: idStr,
        title: p.title,
        image: p.image,
        author: p.author,
        url: p.url,
      });
    }

    setResults((prev) => [...prev]); // refresh UI
  };

  return (
    <section className="w-full px-4 py-10 bg-bg">
      <h1 className="text-2xl font-bold text-center mb-8 text-text-primary">
        Search Results for:{" "}
        <span className="text-highlight">{term}</span>
      </h1>

      {loading && (
        <p className="text-center text-text-secondary animate-pulse">
          Searching...
        </p>
      )}

      {error && <p className="text-center text-red-400">{error}</p>}

      {!loading && results.length === 0 && (
        <p className="text-center text-text-secondary">No results found.</p>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((p) => {
            const fav = isFavorite(String(p.id));
            const inLibrary = isPodcastInLibrary(String(p.id));

            return (
              <div
                key={p.id}
                className="rounded-xl overflow-hidden shadow-lg bg-surface hover:shadow-xl transition"
              >
                <img src={p.image} className="w-full h-48 object-cover" />

                <div className="p-4">
                  <h3 className="font-semibold text-lg text-text-primary truncate">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-secondary truncate">
                    {p.author}
                  </p>

                  {/* Favorite Button */}
                  <button
                    onClick={() => handleToggleFavorite(p.id)}
                    className={`text-xl mr-4 ${
                      fav ? "text-pink-400" : "text-text-secondary"
                    } hover:scale-110 transition`}
                    title={fav ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    {fav ? "★" : "☆"}
                  </button>

                 {/* Library Button */}
                  <button
                    onClick={() => handleToggleLibrary(p)}
                    className={`text-xl mr-4 hover:scale-110 transition ${
                      inLibrary ? "text-highlight" : "text-text-secondary"
                    }`}
                    title={inLibrary ? "Remove from Library" : "Add to Library"}
                  >
                    <LuLibrary />
                  </button>

                  {/* Details Link */}
                  <Link
                    to={`/podcast/${p.id}`}
                    className="block mt-3 text-highlight text-sm hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
