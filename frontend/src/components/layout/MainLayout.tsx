import { Outlet } from 'react-router-dom';
import TopBar from '../TopBar';
import Footer from '../Footer';
import { AudioElement } from '../AudioElement';
// import HomeView from '../HomeView';


export default function MainLayout() {
  return (
    <>   
    <div className="min-h-screen flex flex-col bg-bg text-text-primary items-center">
      <AudioElement />
      <div className="w-full max-w-7xl p-4">
        <TopBar />
      <div/>
        <main className=" =flex-1 p-4 max-w-7x1 mx-auto ">      
          <Outlet /> 
        </main>
        <div className='w-full max-w-7x1 mx-auto sticky bottom-0'>
          <Footer />
        </div>
      </div>
    </div>
    </>
  );
}
