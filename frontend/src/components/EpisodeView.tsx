import type { Episode } from "../utils/storage"
import { useEffect, useState } from "react";

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
}

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
    }
}

//******move to utils when no one is working in there.
export function formatEpisodeDate(publishedSeconds?: number): string {
   if (!publishedSeconds) return "Unknown date";

  // Convert seconds to milliseconds
  const date = new Date(publishedSeconds * 1000);

  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();

  const options: Intl.DateTimeFormatOptions = sameYear
    ? { month: "short", day: "numeric" }              // "Nov 18"
    : { month: "short", day: "numeric", year: "numeric" }; // "Nov 18, 2023"

  return date.toLocaleDateString(undefined, options);
}

//******move to utils when no one is working in there.



export default function EpisodeView({ feedId }: { feedId: number })  {
  // console.log("Feed ID:", feedId);

  //get store variables 

 
  // set state
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  //fetch episodes with feedId from backend in useEffect
  useEffect(() => {
      if (!feedId) return;
  
      const fetchDetail = async () => {
        try {
          setLoading(true);
          setError(null);
  
          const res = await fetch(
            `http://localhost:5050/api/podcast/episodes/byfeedid/${feedId}`
          );
  
          if (!res.ok) {
            throw new Error("Failed to fetch episode details");
          }
  
          const data = await res.json();
  
          // PodcastIndex /episodes/byfeedid returns { "items": [{ ... },... ]}
          const apiEpisodes: ApiEpisode[] = data.items;

          // get api episode fields to match up with Episode type
          const mappedEpisodes: Episode[] = apiEpisodes.map(mapApiEpisodeToEpisode);

          //set State
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
  


  //style episide list  - map results
  //paginate (initially, backend only gets 10 episodes **change later with pagination)
  return (
    <>
      <div>
        <div>Episodes for ... </div>

        {loading && (
            <p className="text-center text-lg text-text-secondary animate-pulse">
              Loading podcasts...
            </p>
        )}

        {error && (
            <p className="text-center text-red-400 mt-4">{error}</p>
        )}
        
        {!loading && !error && (
        <div>
          {episodes.map((episode) => {

            return (
              <div key={episode.id}>
                <div> 
                  <img
                    src={episode.image || episode.feedImage }
                    alt={episode.title}
                    className="w-full h-15 object-cover" 
                  /></div>
                <div># {episode.episode}</div>
                <div> {episode.title} </div>
                <div> {formatEpisodeDate(episode.publishedAt)} </div>
                <div> duration </div>
                <div>Play Button </div>          
            </div>);

          })}
        </div>
        )}        
      </div>
    </>
  )
}
