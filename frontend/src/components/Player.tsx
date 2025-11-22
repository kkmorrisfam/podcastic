import { RiForward15Line, RiReplay15Line  } from "react-icons/ri";

import PlayButton from "./ui/PlayButton";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useEffect } from "react";
import { formatEpisodeDate } from "../utils/storage";

const Player = () => {
  // need to update state for isPlaying, currentEpisode, queue[]
  const testAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  const {currentEpisode} = usePlayerStore();

  useEffect(()=>{
    
  },[currentEpisode])


  return (
    <div className="flex justify-center items-center">
      <div>
        {/* Episode Image or if null, Podcast Image */}
        <div className=" h-20 w-20 overflow-hidden rounded-md"> 
                  <img
                    src={currentEpisode?.image || currentEpisode?.feedImage || "https://picsum.photos/100" }
                    alt={currentEpisode?.title || "no episode selected"}
                    className="w-full h-10 object-cover" 
                  /></div>
        {/* <img src="https://picsum.photos/100" alt="podcast image"></img> */}
      </div>
      <div>
        {/* Back 15sec control*/}
        <RiReplay15Line />
      </div>
      <div>
        {/* Play Button/Icon control  If isPlaying=true then show pause button, if isPlaying=false then show play button*/}        
        <PlayButton episode={currentEpisode} />
      </div>
      <div>
        {/* Forward 15sec control*/}
        <RiForward15Line />
      </div>
      <div>
          <div>
            {/* Episode Title */}
            <h2>{currentEpisode?.title || ""}</h2>
          </div>
          <div>
            {/* Could add later - Podcast Title + Month/Year published */}
            {currentEpisode && (
            <h3>{currentEpisode.author} - {formatEpisodeDate(currentEpisode.publishedAt)} </h3>
            )}
          </div>
          <div>
            {/* player duration bar */}
            {/* includes start time and end time, which changes as the play time moves */}
            {/* <audio controls>
              <source src={testAudioUrl} type="audio/mpeg"></source>
              Your browser does not support the audio element.
            </audio> */}
          </div>
      </div>
      <div>
        {/* adjust volume control */}
      </div>
      
    </div>
  )
}

export default Player