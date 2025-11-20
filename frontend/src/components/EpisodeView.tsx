import type { Episode } from "../utils/storage"
import { useEffect, useState } from "react";
import PlayButton from "./ui/PlayButton";

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
export function formatEpisodeDate(secondsToDate?: number): string {
   if (!secondsToDate) return "Unknown date";

  // Convert seconds to milliseconds
  const date = new Date(secondsToDate * 1000);

  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();

  const options: Intl.DateTimeFormatOptions = sameYear
    ? { month: "short", day: "numeric" }              // "Nov 18"
    : { month: "short", day: "numeric", year: "numeric" }; // "Nov 18, 2023"

  return date.toLocaleDateString(undefined, options);
}

//******move to utils when no one is working in there.
export function formatHHMMSS(secondsToHours?: number): string {
  if (!secondsToHours) return "00";

  const dateObject = new Date(secondsToHours * 1000);
  const hours = dateObject.getUTCHours();
  const minutes = dateObject.getUTCMinutes();
  const seconds = dateObject.getSeconds();

  const timeString = hours.toString().padStart(2,'0') + ':' + minutes.toString().padStart(2,'0') + ':' + seconds.toString().padStart(2, '0');

  return timeString;

}


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
        <div>Latest Episodes </div>

        {loading && (
            <p className="text-center text-lg text-text-secondary animate-pulse">
              Loading podcasts...
            </p>
        )}

        {error && (
            <p className="text-center text-accent mt-4">{error}</p>
        )}
        
        {!loading && !error && (
        <div className="">
          {episodes.map((episode) => {

            return (
              <div key={episode.id} className=" grid items-center gap-x-4 py-3 border-b border-slate-200
                          grid-cols-[80px_60px_minmax(0,1fr)_110px_90px_90px]">
                <div className=" h-20 w-20 overflow-hidden rounded-md"> 
                  <img
                    src={episode.image || episode.feedImage }
                    alt={episode.title}
                    className="w-full h-15 object-cover" 
                  /></div>
                <div className="text-sm text-text-secondary"># {episode.episode}</div>
                <div className="min-w-0">
                    <p className="truncate font-medium"> {episode.title} 
                    </p>
                  </div>
                <div className="text-sm text-text-secondary"> {formatEpisodeDate(episode.publishedAt)} </div>
                <div className="text-sm text-text-secondary"> {formatHHMMSS(episode.durationSec) ?? "00"} </div>
                <div><PlayButton episode={episode}/> </div>          
            </div>);

          })}
        </div>
        )}        
      </div>
    </>
  )
}
