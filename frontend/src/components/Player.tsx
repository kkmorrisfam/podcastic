import { RiForward15Line, RiReplay15Line  } from "react-icons/ri";
import { FaPlay, FaPause  } from "react-icons/fa6";

const Player = () => {
// need to update state for isPlaying, currentEpisode, queue[]
const testAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

//get audio element?

  return (
    <div className="flex justify-center items-center">
      <div>
        {/* Episode Image or if null, Podcast Image */}
        <img src="https://picsum.photos/100" alt="podcast image"></img>
      </div>
      <div>
        {/* Back 15sec control*/}
        <RiReplay15Line />
      </div>
      <div>
        {/* Play Button/Icon control  If isPlaying=true then show pause button, if isPlaying=false then show play button*/}
        <FaPlay />
        <FaPause />
      </div>
      <div>
        {/* Forward 15sec control*/}
        <RiForward15Line />
      </div>
      <div>
          <div>
            {/* Episode Title */}
            <h2>"Episode Title"</h2>
          </div>
          <div>
            {/* Could add later - Podcast Title + Month/Year published */}
            <h3>"Podcast Title" - "Month/Year"</h3>
          </div>
          <div>
            {/* player duration bar */}
            {/* includes start time and end time, which changes as the play time moves */}
            <audio controls>
              <source src={testAudioUrl} type="audio/mpeg"></source>
              Your browser does not support the audio element.
            </audio>
          </div>
      </div>
      <div>
        {/* adjust volume control */}
      </div>
      
    </div>
  )
}

export default Player