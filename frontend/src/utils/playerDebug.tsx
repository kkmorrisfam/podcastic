import { usePlayerStore } from "../stores/usePlayerStore";
import {
  addEpisodeToQueueLocal,
  removeEpisodeFromQueueLocal,
  playEpisodesLocal,
} from "../utils/playerPersistence";
import type { Episode } from "../utils/storage";

const makeFakeEpisode = (id: string): Episode => ({
  id,
  title: `Test Episode ${id}`,
  audioUrl: "https://example.com/audio.mp3",
  episode: Number(id) || 0,
  image: "",
  author: "Debug Author",
  durationSec: 1234,
  publishedAt: Date.now() / 1000,
});

export function PlayerDebug() {
  const queue = usePlayerStore((s) => s.queue);
  const currentEpisode = usePlayerStore((s) => s.currentEpisode);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentIndex = usePlayerStore((s) => s.currentIndex);

  const handleAdd = async () => {
    const id = (queue.length + 1).toString();
    const ep = makeFakeEpisode(id);
    await addEpisodeToQueueLocal(ep, { toTop: false, playIfEmpty: true });
  };

  const handlePlayList = async () => {
    const episodes: Episode[] = ["101", "102", "103"].map(makeFakeEpisode);
    await playEpisodesLocal(episodes, 0);
  };

  const handleRemoveFirst = async () => {
    if (!queue.length) return;
    const firstId = queue[0].episodeId;
    await removeEpisodeFromQueueLocal(firstId);
  };

  return (
    <div
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        fontSize: "0.9rem",
      }}
    >
      <strong>PlayerDebug</strong>
      <div>isPlaying: {isPlaying ? "yes" : "no"}</div>
      <div>currentIndex: {currentIndex}</div>
      <div>
        currentEpisode:{" "}
        {currentEpisode ? `${currentEpisode.id} – ${currentEpisode.title}` : "none"}
      </div>
      <div>queue length: {queue.length}</div>
      <div>
        queue:{" "}
        {queue.map((q) => q.episodeId).join(", ") || "(empty)"}
      </div>

      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
        <button onClick={handleAdd}>Add test episode to queue</button>
        <button onClick={handlePlayList}>Play test list (3 episodes)</button>
        <button onClick={handleRemoveFirst}>Remove first in queue</button>
      </div>
    </div>
  );
}
