import { useEffect, useState } from "react";
import {
  listPodcastLibrary,
  removePodcastFromLibrary,
  type PodcastSummary,
} from "../utils/storage";
import { Link } from "react-router-dom";
import { CiCircleRemove } from "react-icons/ci";

export default function LibraryView() {
  const [podcasts, setPodcasts] = useState<PodcastSummary[]>([]);

  const refresh = () => {
    setPodcasts(listPodcastLibrary());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleRemove = (id: string) => {
    removePodcastFromLibrary(id);
    refresh();
  };

  return (
    <section className="w-full px-4 py-10 bg-bg">
      <h1 className="text-3xl font-bold mb-8 text-center text-text-primary">
        📚 Your Library
      </h1>

      {podcasts.length === 0 && (
        <p className="text-center text-text-secondary">
          Your library is empty. Add some podcasts from the Trending or Search
          pages.
        </p>
      )}

      {podcasts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {podcasts.map((p) => (
            <div
              key={p.id}
              className="rounded-xl overflow-hidden shadow-lg bg-surface hover:shadow-xl transition"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col min-h-[150px]">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg truncate text-text-primary">
                    {p.title}
                  </h3>
                  {p.author && (
                    <p className="text-sm text-text-secondary truncate">
                      {p.author}
                    </p>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleRemove(p.id)}
                    className="text-2xl text-red-400 hover:text-red-500 hover:scale-110 transition"
                    title="Remove from Library"
                  >
                    <CiCircleRemove />
                  </button>

                  <Link
                    to={`/podcast/${p.id}`}
                    className="text-highlight text-sm hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
