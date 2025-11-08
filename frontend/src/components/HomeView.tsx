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
    const res = await fetch("/api/trending");
    const data = await res.json();
    setPodcasts(data.feeds || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] transition-colors duration-300">
      {/* <header className="w-full p-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-center tracking-tight">
          Podcastic
        </h1>
      </header> */}

      <section className="p-6">
        {/* <h2 className="text-2xl font-bold text-center mt-6 mb-4">
          Trending Podcasts
        </h2> */}

        {loading ? (
          <p className="text-center text-lg text-[var(--color-text-secondary)]">
            Loading podcasts...
          </p>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
            style={{ justifyItems: "center" }}
          >
            {podcasts.map((p) => (
              <div key={p.id} className="podcast-card w-full max-w-sm">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-52 object-cover rounded-xl mb-3"
                />
                <h2>{p.title}</h2>
                <p>{p.author}</p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--color-highlight)] hover:underline text-sm"
                >
                  Visit Podcast →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
