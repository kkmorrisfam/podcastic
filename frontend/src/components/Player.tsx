import { RiForward15Line, RiReplay15Line, RiSkipBackLine, RiSkipForwardLine } from "react-icons/ri"


import PlayButton from "./ui/PlayButton";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useEffect, useRef, useState } from "react";
import { formatEpisodeDate } from "../utils/storage";
import  MusicSlider  from "../components/ui/Slider";
import { pickFirstValidImageUrl } from "../utils/image";


const Player = () => {
  // need to update state for isPlaying, currentEpisode, queue[]
  const {currentEpisode, playPrevious, playNext} = usePlayerStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);


  const audioRef = useRef<HTMLAudioElement | null>(null);

  
  useEffect(()=>{
    //find the audio element from the DOM and send it to this one
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if(!audio) return;

    const updateTime = ()=> {
        setCurrentTime(audio.currentTime);
        console.log("The currentTime attribute has been updated. Again.");
    };

    const updateDuration = () => {
        setDuration(audio.duration);
        console.log(
          "The duration and dimensions of the media and tracks are now known.",
        );
      };

    //time event fires when the currentTime attribute updates
    audio.addEventListener("timeupdate",updateTime);

    //loadedmetadata is fired when the browser has loaded enough of the audio file to determine metadata, including duration
    audio.addEventListener("loadedmetadata", updateDuration);

    //when audio ends, update isPlaying
    const handleEnded = () => {
      //this is one way to set state
      usePlayerStore.setState({ isPlaying: false});
    }


    //ended is fired when the audio has finished playing
    audio.addEventListener("ended", handleEnded);

    //cleanup event listeners
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    }
  },[currentEpisode])

  const handleFwd15Sec = () => {
    if (audioRef.current) {
      audioRef.current.currentTime +=15;
    }
  }

  const handleBack15Sec = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -=15;
    }
  }

  const handleSeek = (value: number)=> {
    if (audioRef.current) {
      audioRef.current.currentTime = value;      
    }
    setCurrentTime(value);
  };

  const playerImageSrc = pickFirstValidImageUrl(
    currentEpisode?.image,
    currentEpisode?.feedImage
  ) || "https://picsum.photos/100";  //fallback image

  // src={currentEpisode?.image || currentEpisode?.feedImage || "https://picsum.photos/100" }
 
  return (
    <>
      {currentEpisode && (
      <div className="flex justify-center items-center gap-5">
        <div className="hidden sm:block">
          {/* Episode Image or if null, Podcast Image, or random image if nothing in currentEpisode */}
          <div className=" h-20 w-20 mb-4 overflow-hidden rounded-md"> 
                    <img
                      src={playerImageSrc}                     
                      alt={currentEpisode?.title || "no episode selected"}
                      className="w-full object-cover" 
                    /></div>
          {/* <img src="https://picsum.photos/100" alt="podcast image"></img> */}
        </div>

        {/* Episode Information */}
        <div className="hidden sm:block">
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
        </div>
        
        {/* Player Controls */}
        <div>

          {/* Back, Forward, Play, Pause */}
          <div className="flex items-center gap-4">          
            <button onClick={playPrevious}  className="play-icon" title="Previous Episode">
              <RiSkipBackLine />
            </button>
            
              {/* Back 15sec control*/}
            <button onClick={handleBack15Sec}  className="play-icon" title="Rewind 15 Seconds">            
              <RiReplay15Line className="play-icon"/>
            </button>

              {/* Play Button/Icon control  If isPlaying=true then show pause button, if isPlaying=false then show play button*/}        
            <div>              
              <PlayButton episode={currentEpisode}  />
            </div>

            {/* Forward 15sec control*/}            
            <button onClick={handleFwd15Sec} className="play-icon" title="Forward 15 Seconds">
              <RiForward15Line />
            </button>
            
            <button onClick={playNext}  className="play-icon" title="Next Episode">
              <RiSkipForwardLine />
            </button>
            
          </div>
          
          {/* player duration bar */}
          <div>
            <MusicSlider 
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />       
              
          </div>
        </div>


        {/* adjust volume control */}
        <div>
          
        </div>        
       </div>
      )}
    </>
  )
  
}

export default Player