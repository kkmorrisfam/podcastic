

const Logo = () => {
  return (
    <>  
      <div className="flex items-center">
        <div className="h-16">
            <img src="images/owl_logo.webp" alt="Owl logo"  width={65} height={65}/>
        </div>
        <div>
           <h1 className="text-accent logo-title">
               Podcastic
            </h1> 
            <h2>
                listen smarter
            </h2>
        </div>

      </div>
    </>
  )
}

export default Logo