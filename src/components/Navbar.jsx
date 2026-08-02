import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header-bar">
        <Link to="/" style={{ fontWeight: 700, fontSize: 18, color: '#111827' }} onClick={closeMenu}>
          📚 UniLibrary
        </Link>

        <button
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/universities" onClick={closeMenu}>Universities</Link>
          <Link to="/search" onClick={closeMenu}>Search</Link>

          {user ? (
            <>
              <Link to="/favorites" onClick={closeMenu}>Favorites</Link>
              <Link to="/profile" onClick={closeMenu}>Profile</Link>
              {isAdmin && <Link to="/admin" onClick={closeMenu}>Admin</Link>}
              <button
                className="btn secondary"
                onClick={() => {
                  closeMenu();
                  logout();
                  navigate('/');
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Log in</Link>
              <Link to="/register" className="btn" onClick={closeMenu}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
