import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar';
import Footer from '../Footer';
// import HomeView from '../HomeView';


export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
       {/* Main */}
      {/* <main className="grow w-full">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <HomeView />
        </div>
      </main> */}
      <main className="grow p-4">
        <Outlet /> {/* This renders the current page.  This is whatever is found in <Route /> in the App.tsx file */}
      </main>
      <Footer />
    </div>
  );
}
