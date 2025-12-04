import { usePlayerStore } from "../../stores/usePlayerStore.ts";
import type { Episode } from "../../utils/storage.ts";
import { FaPause, FaPlay, FaRegCirclePlay   } from "react-icons/fa6";

// keep track of state: isPlaying, 
const PlayButton = ( {episode}: {episode:Episode | null}  ) => {
  const {currentEpisode, isPlaying, setCurrentEpisode, togglePlay} = usePlayerStore();
  
  // handle initial render when episode is null
   if (!episode) {
    return (
      <button className="player-button" disabled>
        <FaPlay className="size-5 text-text-primary hover:bg-highlight" />
      </button>
    );
  }

  //set passed in episode as isCurrentEpisode
  const isCurrentEpisode = currentEpisode?.id === episode.id;
  
  // function for clicking button
  const handleClick = () => {
    if(isCurrentEpisode) togglePlay();
    else setCurrentEpisode(episode);
  }

  return (
    <button 
      onClick={handleClick}
      className="player-button"
      title={isCurrentEpisode && isPlaying ? "Pause" : "Play"}
    >
      {isCurrentEpisode && isPlaying ? (
        <FaPause className="size-5 play-icon" />
        
      ) : (
        <FaRegCirclePlay  className="size-5 play-icon"/>
      )}

      
    </button>
  )
}

export default PlayButton