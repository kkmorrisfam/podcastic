import Player from './Player'

const Footer = () => {
  return (
    <>
      <footer className="w-full mt-8 py-6 border-t border-border bg-bg">
        <div className="max-w-6xl mx-auto text-center text-text-secondary text-sm">          
          <Player />
        </div>
        <div className="w-full border-t border-border bg-bg">
          © {new Date().getFullYear()} Podcastic | Kerri & Erik
        </div>

      </footer>
    </>
  )
}

export default Footer