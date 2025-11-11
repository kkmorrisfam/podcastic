import { Link } from 'react-router';

export default function NavBar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/favorties">Favorites</Link>
        </nav>
    )
}