import { usePlayerStore } from "../stores/usePlayerStore";
import { useEffect, useRef } from 'react'

export const AudioElement = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const prevEpisodeRef = useRef<string | null>(null); //keep track up previous episode in this component/placeholder

    const {currentEpisode, isPlaying, playNext} = usePlayerStore();

    //handle play/pause logic, watch isPlaying
    useEffect(()=> {
        if (isPlaying) audioRef.current?.play();
        else audioRef.current?.pause();
    },[isPlaying]);   //when isPlaying updates, run this block

    //handle episode ends
    useEffect(()=> {
        const audio = audioRef.current; //get current audio DOM element
        const handleEnded = () => {
            playNext();
        }
        audio?.addEventListener("ended", handleEnded);

        //cleanup event listener after playNext fired
        return ()=> audio?.removeEventListener("ended", handleEnded);

    },[playNext]);


    //handle episode changes
    useEffect(()=> {
        if (!audioRef.current || !currentEpisode) return;

        const audio = audioRef.current;

        //check if this is actually a new episode
        const isEpisodeChange = prevEpisodeRef.current !== currentEpisode?.audioUrl;
        if(isEpisodeChange) {
            audio.src = currentEpisode?.audioUrl;
            //reset the playback position
            audio.currentTime = 0;
            prevEpisodeRef.current = currentEpisode?.audioUrl;

            if(isPlaying)  audio.play();
        }

    },[currentEpisode, isPlaying]);


  return (
    <>
        <audio ref={audioRef} />
    </>
  )
}
