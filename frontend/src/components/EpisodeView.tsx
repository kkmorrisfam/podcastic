import type { Episode } from "../utils/storage"

interface Episodes {
    episodes: Episode[];
}



export default function EpisodeView({ feedId }: { feedId: number })  {
  // console.log("Feed ID:", feedId);

  //get store variables 
    

  //fetch episodes with feedId from backend in useEffect

  //style episide list  - map results
  //paginate (initially, backend only gets 10 episodes **change later with pagination)
  return (
    <>
    
      <div>
         Episodes will go here for feed {feedId}

      </div>        
    </>
  )
}
