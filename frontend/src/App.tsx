import { Routes, Route } from "react-router-dom";
import HomeView from "./components/HomeView";
import SearchView from "./components/SearchView";
import MainLayout from "./components/layout/MainLayout";
import Trending from "./components/Trending";
import PodcastDetailView from "./components/PodcastDetailView";
import FavoritesView from "./components/FavoritesView";
import { useEffect } from "react";
import { hydratePlayerFromLocalStorage } from "./utils/playerPersistence";
import { PlayerDebug } from "./utils/playerDebug";

export default function App() {

    // get data from local storage and sync to state
    useEffect(() => {
      hydratePlayerFromLocalStorage();
    }, []);


    return(
        <>
            {/* <div className="min-h-screen flex flex-col" > */}
               <PlayerDebug />
                  <Routes>
                    {/* All pages share the MainLayout */}
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<HomeView />} />
                      <Route path="/trending" element={<Trending/>} />
                      {/* ********Any route to a page that shares the MainLayout ******* */}
                      <Route path="/search" element={<SearchView />} />
                      <Route path="/favorites" element={<FavoritesView />} />
                      <Route path="/podcast/:id" element={<PodcastDetailView />} />
                    </Route>
                  </Routes>
                
            {/* </div> */}
        </>
    )
}