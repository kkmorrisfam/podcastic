import Logo from "./Logo";
import NavBar from "./NavBar";


export default function TopBar() {
    return (
        <>
        <header className="w-full shadow bg-surface mb-8">
        {/* <header className="navbar"> */}
            <div className="container flex items-center justify-between gap-4 px-4">
            {/* <div> */}
                <Logo />
             <NavBar />
           </div>
         </header>
        </>
    )
}
    