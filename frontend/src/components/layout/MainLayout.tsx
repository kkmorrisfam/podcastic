import { Outlet } from "react-router";




export default function MainLayout() {
    return(
        <>
            <div className="min-h-screen flex flex-col" >
                {/* ***TODO*** Navbar goes here */}
                <main className="grow p-4">
                    <Outlet/> {/* Renders current page */}
                </main>
                {/* ***TODO*** Footer goes here */}
            </div>
        </>
    )
}