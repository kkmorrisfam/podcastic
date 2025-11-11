import { Outlet } from 'react-router-dom';
import TopBar from '../TopBar';
import Footer from '../Footer';
// import HomeView from '../HomeView';


export default function MainLayout() {
  return (
    <>   
    <div className="min-h-screen flex flex-col bg-bg text-text-primary items-center">
      <div className="w-full max-w-7xl p-4">
        <TopBar    />
          <main className="grow p-4">      
            {/* <Outlet />  */}
          </main>
        <Footer />
      </div>
    </div>
    </>
  );
}
