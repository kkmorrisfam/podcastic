import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

function App() {
  

  return (
    <>
      <BrowserRouter>
         <Routes>
          {/* All pages share the MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            {/*  ***TODO*** Add Favorites or other routes here <Route path="/favorites" element={<Favorites />} />*/}
          </Route>
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
