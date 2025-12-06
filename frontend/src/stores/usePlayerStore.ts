import { create } from 'zustand';
// import { getQueue, getLibrary } from '../utils/storage';
import type { Episode, Library, Queue } from '../utils/storage';

interface PlayerStore {
    //state
    currentEpisode: Episode | null;
    isPlaying: boolean;
    queue: Queue;  // array of episode IDs
    library: Library; // dictionary of episode objects, library[id] retrieves the full episode object
    currentIndex: number;
    isHydrated: boolean; // is the persisstence data loaded yet?
    

    //actions
    hydrateFromPersistence: (library: Library, queue: Queue) => void;    
    // initializeQueue: (queue: Queue) => void;
    togglePlay: ()=> void;
    setCurrentEpisode: (episode: Episode | null) => void;
    playNext: ()=> void;
    playPrevious: () => void;    
    playEpisode: (episodes: Episode[], startIndex: number) => void;
    addToQueueStore: (episode: Episode, opts?:{toTop?: boolean; playIfEmpty?:boolean}) => void;
    removeFromQueueStore: (episodeId: string) => void;
    // getEpisodeRecord: (episodeId: string) => {}
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    //initial state when creating store   
    // get library and queue from local storage if it exists   
    library: {},  //library is a dictionary
    queue: [],   //queue is an array of episode ids
    currentEpisode: null,
    isPlaying: false,     
    currentIndex: -1,
    isHydrated: false,


    
    // initializeQueue: (queue: Queue) => {
    //     // get current library from state, or fallback to storage
    //     const library = get().library || getLibrary();

    //     set({
    //         library,
    //         queue,            
    //         currentEpisode: get().currentEpisode || 
    //             (queue.length > 0 ? library[queue[0].episodeId] : null),
    //         currentIndex: get().currentIndex === -1 && queue.length > 0
    //             ? 0 : get().currentIndex,
    //     });        
    // },

    //change to this way, so that we can sync with DB using async outside of store
    hydrateFromPersistence: (library, queue) => {
        let currentEpisode: Episode | null = null;
        let currentIndex = -1;

        //if queue is not empty, initialize values
        if (queue.length > 0) {
            const firstId = queue[0].episodeId;
            currentEpisode = library[firstId] ?? null;
            currentIndex = currentEpisode ? 0 : -1;
        }

        set({
            library,
            queue,
            currentEpisode,
            currentIndex,
            isHydrated: true,
            
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

        const mergedLibrary: Library = {
            ...library, 
            [episode.id]: episode,
        };

        set({
            library: mergedLibrary,
            currentEpisode: mergedLibrary[episode.id] ?? episode,
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

    


    playEpisode: (episodes: Episode[], startIndex=0) => {
        if (episodes.length === 0) return;  //if no episodes in array, return

        const startEpisode = episodes[startIndex];

        const newQueue: Queue = episodes.map((episode)=> ({ episodeId: episode.id}));
        const newLibrary: Library = episodes.reduce((acc, episode) => {
            acc[episode.id] = episode;
            return acc;
        }, {} as Library);

        const mergedLibrary = {...get().library, ...newLibrary};

        set({
            queue: newQueue,
            library: mergedLibrary,
            currentEpisode: mergedLibrary[startEpisode.id] ?? startEpisode,
            currentIndex: startIndex,
            isPlaying: true,
        });
    },



    addToQueueStore: (episode: Episode, opts) =>{
        const {toTop = false, playIfEmpty = true} = opts ?? {}
        const { queue, library, currentEpisode, currentIndex, isPlaying } = get();

        //avoid duplicates
        const exists = queue.some((item)=> item.episodeId === episode.id);
        const baseQueue = exists ? queue.filter((item)=> item.episodeId !== episode.id) : queue;

        const newItem = { episodeId: episode.id};
        const newQueue = toTop ? [newItem, ...baseQueue] : [...baseQueue, newItem];

        const newLibrary: Library = {
            ...library,
            [episode.id]: episode,
        };

        let nextCurrentEpisode = currentEpisode; 
        let nextIndex = currentIndex;
        let nextPlaying = isPlaying;

        if(!currentEpisode && playIfEmpty && newQueue.length > 0) {
            const firstId = newQueue[0].episodeId;
            const firstEpisode = newLibrary[firstId];
            nextCurrentEpisode = firstEpisode ?? null;
            nextIndex = firstEpisode ? 0 : -1;
            nextPlaying = !!firstEpisode;            
        }

        set ({
            queue: newQueue,
            library: newLibrary,
            currentEpisode: nextCurrentEpisode,
            currentIndex: nextIndex,
            isPlaying: nextPlaying,
        });

    },

    removeFromQueueStore: (episodeId) => {
        const {queue, currentIndex, currentEpisode, library, isPlaying } = get();
        const removeIndex = queue.findIndex((item)=> item.episodeId === episodeId);
        if (removeIndex === -1) return;

        const newQueue = queue.filter((item)=> item.episodeId !== episodeId);

        let nextCurrentEpisode = currentEpisode;
        let nextIndex = currentIndex;

        let nextPlaying = isPlaying;

        if (removeIndex === currentIndex) {
            //remove the current episode
            if(newQueue.length > currentIndex) {
                const nextEpisode = library[newQueue[currentIndex].episodeId];
                nextCurrentEpisode = nextEpisode ?? null;
                nextPlaying = !!nextEpisode;                
            } else if (newQueue.length > 0) {
                const lastIndex = newQueue.length -1;
                const ep = library[newQueue[lastIndex].episodeId];
                nextCurrentEpisode = ep ?? null;
                nextIndex = lastIndex;
                nextPlaying = !! ep;
            } else {
                nextCurrentEpisode = null;
                nextIndex = -1;
                nextPlaying = false;
            }
        } else if (removeIndex < currentIndex) {
            nextIndex = currentIndex -1;
        }

        
        set ({
            queue: newQueue,
            currentEpisode: nextCurrentEpisode,
            currentIndex: nextIndex,
            isPlaying: nextPlaying,
        });
    },
}));