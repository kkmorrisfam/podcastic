import { usePlayerStore } from "../../stores/usePlayerStore.ts";
import type { Episode } from "../../utils/storage.ts";
import { FaPause, FaPlay  } from "react-icons/fa6";

// keep track of state: isPlaying, 
const PlayButton = ( {episode}: {episode:Episode}  ) => {
  const {currentEpisode, isPlaying, setCurrentEpisode, togglePlay} = usePlayerStore();
  
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
    >
      {isCurrentEpisode && isPlaying ? (
        <FaPause className="size-5 text-black" />
        
      ) : (
        <FaPlay className="size-5 text-black"/>
      )}

      
    </button>
  )
}

export default PlayButton