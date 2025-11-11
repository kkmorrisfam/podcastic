import HomeView from "./components/HomeView";
import "./index.css";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen items-center bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      {/* Header */}
      <header className="w-full py-6 shadow bg-[var(--color-surface)] mb-8">
       
      </header>

      {/* Main */}
      <main className="flex-grow w-full">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <HomeView />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-8 py-6 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto text-center text-[var(--color-text-secondary)] text-sm">
          © {new Date().getFullYear()} Podcastic | Kerri & Erik
        </div>
      </footer>
    </div>
  );
}
