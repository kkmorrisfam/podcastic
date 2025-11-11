import { Routes, Route } from "react-router-dom";
import HomeView from "./components/HomeView";
import MainLayout from "./components/layout/MainLayout";
import Trending from "./components/Trending";

export default function App() {
    return(
        <>
            {/* <div className="min-h-screen flex flex-col" > */}
               
                  <Routes>
                    {/* All pages share the MainLayout */}
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<HomeView />} />
                      <Route path="/trending" element={<Trending/>} />
                      {/* ********Any route to a page that shares the MainLayout ******* */}
                      {/* <Route path="/search" element={<Search />} /> */}
                      {/* <Route path="/favorites" element={<Favorites />} /> */}
                    </Route>
                  </Routes>
                
            {/* </div> */}
        </>
    )
}