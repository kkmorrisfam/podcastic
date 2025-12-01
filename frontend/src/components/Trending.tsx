import {  useEffect, useState } from "react";

import { API_BASE } from "../utils/config";

// Podcast interface defines the shape of podcast data
// retrieved from the PodcastIndex API.

interface Podcast {
  id: number;
  title: string;
  image: string;
  author: string;
  url: string;
}

// Trending component
// Displays the "Trending Podcasts" section on the home page.
// Fetches podcast data from the backend and renders reponsive podcast cards.

export default function Trending() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/podcast/trending`);
      if (!res.ok) throw new Error("Failed to fetch podcasts");
      const data = await res.json();
      setPodcasts(data.feeds || []);
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

  return (
    <section className="w-full px-4 py-10 bg-bg">
      <div className="container">
      <h2 className="text-2xl font-bold mb-8 text-center text-text-primary">
        Trending Podcasts
      </h2>

      {loading && (
        <p className="text-center text-lg text-text-secondary animate-pulse">
          Loading podcasts...
        </p>
      )}

      {error && (
        <p className="text-center text-red-400 mt-4">{error}</p>
      )}

      {!loading && !error && (
        <div className="trending-grid">
          {podcasts.map((p) => (
            <div key={p.id} className="podcast-card">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">
                  {p.title}
                </h3>
                <p className="text-sm text-text-secondary mb-2 truncate">
                  {p.author}
                </p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-highlight hover:underline text-sm"
                >
                  Visit Podcast →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
