import React, { useEffect, useState } from "react";

interface Podcast {
  id: number;
  title: string;
  image: string;
  author: string;
  url: string;
}

export default function HomeView() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5050/api/podcast/trending");
    const data = await res.json();
    setPodcasts(data.feeds || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
        Trending Podcasts
      </h2>

      {loading ? (
        <p className="text-center text-lg text-[var(--color-text-secondary)]">
          Loading podcasts...
        </p>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl"
          style={{ justifyItems: "center" }}
        >
          {podcasts.map((p) => (
            <div
              key={p.id}
              className="podcast-card rounded-xl overflow-hidden shadow hover:shadow-lg bg-[var(--color-surface)] transition-all duration-200"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">
                  {p.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-2 truncate">
                  {p.author}
                </p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--color-highlight)] hover:underline text-sm"
                >
                  Visit Podcast →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}