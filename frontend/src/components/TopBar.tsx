import Logo from "./Logo";
import NavBar from "./NavBar";


export default function TopBar() {
    return (
        <><header className="w-full py-6 shadow bg-surface mb-8">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
                <Logo />
             <NavBar />
           </div>
         </header>
        </>
    )
}
    