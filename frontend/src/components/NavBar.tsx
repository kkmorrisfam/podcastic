import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm md:text-base font-medium transition-colors
     ${isActive ? 'text-[var(--color-highlight)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-highlight)]'}`;

  return (
    <nav className="flex items-center gap-6">
      <NavLink to="/" className={linkClasses}>Home</NavLink>
      <NavLink to="/search" className={linkClasses}>Search</NavLink>
      <NavLink to="/favorites" className={linkClasses}>Favorites</NavLink>
    </nav>
  );
}







