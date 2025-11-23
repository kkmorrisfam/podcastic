import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EpisodeView from "./EpisodeView";
import { api } from "../utils/api";

interface PodcastDetail {
  id: number;
  title: string;
  author: string;
  podcastId: number;
  image: string;
  description: string;
  durationSec?: number;
  publishedAt: number;
  link?: string; // website link
}

export default function PodcastDetailView() {
  const { id } = useParams<{ id: string }>();

  const [podcast, setPodcast] = useState<PodcastDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

const fetchDetail = async () => {
  try {
    setLoading(true);
    setError(null);

    // Use API helper
    const data = await api.fetchPodcastDetail(id);

    const feed = data.feed;

        const mapped: PodcastDetail = {
          id: feed.id,
          podcastId: feed.id,
          title: feed.title,
          author: feed.author || feed.ownerName || "Unknown",
          image: feed.image || feed.artwork || "",
          description: feed.description || feed.summary || "No description available.",
          link: feed.link,
          publishedAt: feed.lastUpdateTime || 0, 
        };

    setPodcast(mapped);
  } catch (err) {
    console.error(err);
    setError("Unable to load podcast details. Please try again later.");
  } finally {
    setLoading(false);
  }
};

    fetchDetail();
  }, [id]);

  return (
    <>
    <section className="w-full px-4 py-10 bg-bg)]">
      {loading && (
        <p className="text-center text-text-secondary)] animate-pulse">
          Loading podcast…
        </p>
      )}

      {error && !loading && (
        <p className="text-center text-red-400">{error}</p>
      )}

      {!loading && !error && podcast && (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            {podcast.image ? (
              <img
                src={podcast.image}
                alt={podcast.title}
                className="w-64 h-64 object-cover rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-64 h-64 rounded-xl bg-surface)] flex items-center justify-center text-text-secondary)]">
                No Artwork
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-text-primary)]">
              {podcast.title}
            </h1>
            <p className="text-lg text-text-secondary)] mb-4">
              by <span className="font-medium">{podcast.author}</span>
            </p>

            {podcast.link && (
              <p className="mb-4">
                <a
                  href={podcast.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-highlight)] hover:underline"
                >
                  Visit Website →
                </a>
              </p>
            )}

            <h2 className="text-xl font-semibold mb-2 text-text-primary)]">
              Description
            </h2>
            <p className="text-text-secondary)] leading-relaxed whitespace-pre-wrap">
              {podcast.description}
            </p>
          </div>
        </div>
      )}
    </section>
      {podcast && (
        <section>
          <EpisodeView feedId={podcast.id} />
        </section>
      )}
    </>
  );
}
