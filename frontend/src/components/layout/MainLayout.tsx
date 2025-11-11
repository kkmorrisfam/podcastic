import { Outlet } from 'react-router-dom';
import TopBar from '../TopBar';
import Footer from '../Footer';
// import HomeView from '../HomeView';


export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar    />
      <main className="grow p-4">
        <Outlet /> {/*This renders the current page.  This is whatever is found in <Route /> in the App.tsx file */}
      </main>
      <Footer />
    </div>
  );
}
