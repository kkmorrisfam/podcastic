import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from "../stores/useAuthStore";

export default function NavBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // --- Auth state ---
  const { user, logout } = useAuthStore();

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm md:text-base font-medium transition-colors
     ${isActive ? 'text-[var(--color-highlight)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-highlight)]'}`;

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;

    navigate(`/search?term=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <nav className="flex items-center gap-6">

      {/* ---------- Public Links ---------- */}
      <NavLink to="/" className={linkClasses}>Home</NavLink>
      {/* <NavLink to="/search" className={linkClasses}>Search</NavLink> */}
      <NavLink to="/library" className={linkClasses}>Library</NavLink>
      <NavLink to="/favorites" className={linkClasses}>Favorites</NavLink>
      <NavLink to="/queue" className={linkClasses}>Playlist</NavLink>

      {/* ---------- Search Box ---------- */}
      <form onSubmit={handleSearchSubmit} className="flex items-center ml-4">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            hidden sm:block
            px-3 py-1.5 text-sm rounded-l-md border 
            border-border
            bg-surface
            text-text-primary
            focus:outline-none focus:ring-2 focus:ring-highlight
            transition
          "
        />

        <button
          type="submit"
          className="
            hidden sm:block
            px-3 py-1.5 bg-highlight 
            text-bg text-sm rounded-r-md 
            hover:opacity-90 transition
          "
        >
          Go
        </button>
      </form>

      {/* ---------- Right Side Auth Controls ---------- */}
      <div className="ml-6 flex items-center gap-4">

        {!user && (
          <>
            <NavLink to="/login" className={linkClasses}>
              Login
            </NavLink>

            <NavLink to="/register" className={linkClasses}>
              Register
            </NavLink>
          </>
        )}

        {user && (
          <>

            <span className="text-sm md:text-base text-text-secondary">
              Hi, {user.firstName}
            </span>

            <button
              onClick={() => logout()}
              className="text-sm md:text-base font-medium text-red-400 hover:text-red-300 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>

    </nav>
  );
}
