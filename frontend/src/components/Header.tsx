import NavBar from "./NavBar";


export default function Header() {
    return (
        <>
          <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
            <h1 className="text-3xl font-extrabold text-accent]">
                Podcastic
            </h1>
            <NavBar />
         </div>
        </>
    )
}
    
