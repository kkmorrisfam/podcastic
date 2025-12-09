import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { FiMenu, FiX } from "react-icons/fi";

export default function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // close menu when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }

    if (mobileOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [mobileOpen]);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `block py-2 text-lg transition-colors ${
      isActive
        ? "text-highlight"
        : "text-text-secondary hover:text-highlight"
    }`;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?term=${encodeURIComponent(query)}`);
    setQuery("");
    setMobileOpen(false);
  };

  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="hidden md:flex items-center gap-6">
        <NavLink to="/" className={linkClasses} title="Go to Home">Home</NavLink>
        <NavLink to="/library" className={linkClasses} title="View Your Library">Library</NavLink>
        <NavLink to="/favorites" className={linkClasses} title="View Favorite Episodes">Favorites</NavLink>
        <NavLink to="/queue" className={linkClasses} title="View Your Playlist">Playlist</NavLink>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center ml-4">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-l-md border border-border bg-surface text-text-primary focus:ring-2 focus:ring-highlight outline-none"
          />
          <button 
          type="submit"
          title="Search"
          className="px-3 py-1.5 bg-highlight text-bg text-sm rounded-r-md hover:opacity-90">
            Go
          </button>
        </form>

        {/* Auth */}
        <div className="ml-6 flex items-center gap-4">
          {!user && (
            <>
              <NavLink to="/login" className={linkClasses} title="Login">
                Login
              </NavLink>
              <NavLink to="/register" className={linkClasses} title="Register">
                Register
              </NavLink>
            </>
          )}

          {user && (
            <>
              <span className="text-text-secondary">Hi, {user.firstName}</span>
              <button
                onClick={logout}
                className="text-red-400 hover:text-red-300 font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* MOBILE NAV TOGGLE */}
      <button
        className="md:hidden text-3xl text-highlight"
        onClick={() => setMobileOpen((s) => !s)}
      >
        {mobileOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 w-full bg-surface border-b border-border shadow-lg md:hidden animate-slideDown z-50"
        >
          <div className="flex flex-col p-4 space-y-3">

            <NavLink onClick={() => setMobileOpen(false)} to="/" className={linkClasses}>
              Home
            </NavLink>
            <NavLink onClick={() => setMobileOpen(false)} to="/library" className={linkClasses}>
              Library
            </NavLink>
            <NavLink onClick={() => setMobileOpen(false)} to="/favorites" className={linkClasses}>
              Favorites
            </NavLink>
            <NavLink onClick={() => setMobileOpen(false)} to="/queue" className={linkClasses}>
              Playlist
            </NavLink>

            {/* Mobile search */}
            <form onSubmit={handleSearchSubmit} className="flex w-full mt-2">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-l border border-border bg-bg"
              />
              <button className="px-4 bg-highlight text-bg rounded-r">
                Go
              </button>
            </form>

            {/* Auth */}
            {!user && (
              <>
                <NavLink to="/login" onClick={() => setMobileOpen(false)} className={linkClasses}>
                  Login
                </NavLink>
                <NavLink to="/register" onClick={() => setMobileOpen(false)} className={linkClasses}>
                  Register
                </NavLink>
              </>
            )}

            {user && (
              <>
                <span className="text-text-secondary">Hi, {user.firstName}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-red-400 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
