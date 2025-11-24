import { create } from 'zustand';
import { getQueue, getLibrary } from '../utils/storage';
import type { Episode, Library, Queue } from '../utils/storage';

interface PlayerStore {
    //state
    currentEpisode: Episode | null;
    isPlaying: boolean;
    queue: Queue;  // array of episode IDs
    library: Library; // dictionary of episode objects, library[id] retrieves the full episode object
    currentIndex: number;
   

    //actions
    initializeQueue: (queue: Queue) => void;
    togglePlay: ()=> void;
    setCurrentEpisode: (episode: Episode | null) => void;
    playNext: ()=> void;
    playPrevious: () => void;
    back15Sec: () => void;
    forward15Sec: () => void;
    playEpisode: (episodes: Episode[], startIndex: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    //initial state when creating store   
    // get library and queue from local storage if it exists   
    library: getLibrary() ?? {},  //library is a dictionary
    queue: getQueue() ?? [],   //queue is an array of episode ids
    currentEpisode: null,
    isPlaying: false,     
    currentIndex: -1,

    
    initializeQueue: (queue: Queue) => {
        // get current library from state, or fallback to storage
        const library = get().library || getLibrary();

        set({
            library,
            queue,            
            currentEpisode: get().currentEpisode || 
                (queue.length > 0 ? library[queue[0].episodeId] : null),
            currentIndex: get().currentIndex === -1 && queue.length > 0
                ? 0 : get().currentIndex,
        });        
    },

    togglePlay: () => {
        const willStartPlaying = !get().isPlaying;  //get whatever it's not

        set({
            isPlaying: willStartPlaying,
        })
    },

    setCurrentEpisode: (episode: Episode | null) => {
        if (!episode) return;
        
        const { queue, library, currentIndex } = get();

        const episodeIndex = queue.findIndex( ep => ep.episodeId === episode.id);

        set({
            currentEpisode: library[episode.id] ?? episode,
            isPlaying: true,
            currentIndex: episodeIndex !== -1 ? episodeIndex : currentIndex,
        });
    },

    playNext: () => {
        const {currentIndex, queue, library} = get();
        const nextIndex = currentIndex + 1;
      

        //if there is a next episode to play, then play it
        if(nextIndex < queue.length) {            
            const nextEpisode = library[queue[nextIndex].episodeId];

            set({
                currentEpisode: nextEpisode ?? null,
                currentIndex: nextIndex,
                isPlaying: !!nextEpisode,  //only true if we found it
            });
        } else { 
            // no episode next in the queue
            set({ isPlaying: false });
        }
    },

    playPrevious: () => {
        const { currentIndex, queue, library } = get();
        const previousIndex = currentIndex - 1;

        if(previousIndex >=0 ) {
            const previousEpisode = library[queue[previousIndex].episodeId];
            set({
                currentEpisode: previousEpisode ?? null,
                currentIndex: previousIndex,
                isPlaying: !!previousEpisode,  //only true if not found
            });            
        } else {
            set({ isPlaying: false});
        }
    },

    back15Sec: () => {},

    forward15Sec: () => {},


    playEpisode: (episodes: Episode[], startIndex=0) => {
        if (episodes.length === 0) return;  //if no episodes in array, return

        const startEpisode = episodes[startIndex];

        const newQueue: Queue = episodes.map((episode)=> ({ episodeId: episode.id}));
        const newLibrary: Library = episodes.reduce((acc, episode) => {
            acc[episode.id] = episode;
            return acc;
        }, {} as Library);

        set({
            queue: newQueue,
            library: {...get().library, ...newLibrary},
            currentEpisode: startEpisode,
            currentIndex: startIndex,
            isPlaying: true,
        });
    },

}));