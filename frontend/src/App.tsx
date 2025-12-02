import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import RequireAuth from "./components/auth/RequireAuth";
import HomeView from "./components/HomeView";
import SearchView from "./components/SearchView";
import MainLayout from "./components/layout/MainLayout";
import Trending from "./components/Trending";
import PodcastDetailView from "./components/PodcastDetailView";
import FavoritesView from "./components/FavoritesView";
import LibraryView from "./components/LibraryView";
import { useEffect } from "react";
import { hydratePlayerFromLocalStorage } from "./utils/playerPersistence";
import { useAuthStore } from "./stores/useAuthStore";
import { QueueView } from "./components/QueueView";
// import { PlayerDebug } from "./utils/playerDebug";

export default function App() {

    // get data from local storage and sync to state
    useEffect(() => {
      hydratePlayerFromLocalStorage();

    useAuthStore.getState().hydrate();
  }, []);

    return(
        <>
            {/* <div className="min-h-screen flex flex-col" > */}
               {/* <PlayerDebug /> */}
                  <Routes>
                    {/* All pages share the MainLayout */}
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<HomeView />} />
                      <Route path="/trending" element={<Trending/>} />
                      {/* ********Any route to a page that shares the MainLayout ******* */}
                      <Route path="/library" element={<LibraryView />} />
                      <Route path="/search" element={<SearchView />} />
                      <Route path="/favorites" element={
                        <RequireAuth>
                          <FavoritesView />
                        </RequireAuth>
                      } />
                      <Route path="/queue" element={<QueueView />} />
                      <Route path="/podcast/:id" element={<PodcastDetailView />} />
                      {/* auth pages */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                    </Route>
                  </Routes>
                
            {/* </div> */}
        </>
    )
}