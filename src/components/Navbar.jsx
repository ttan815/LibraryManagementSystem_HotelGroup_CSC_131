import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Notifications from '../components/Notifications';
import '../components/Navbar.css';

/**
 * Navigation Bar Component
 * Provides main navigation links and user authentication status
 * Includes notifications and user menu
 */
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  // Handle user logout
  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.reload();
  };

  // Simple navigation handler
  const navigateTo = (path) => {
    window.location.hash = path;
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
          📚 LibraryMS
        </a>
      </div>

      {/* Main navigation links */}
      <ul className="nav-links">
        <li><a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></li>
        <li><a href="#books" onClick={(e) => { e.preventDefault(); navigateTo('books'); }}>Books</a></li>
        <li><a href="#books" onClick={(e) => { e.preventDefault(); navigateTo('credits'); }}>Credits</a></li>
        <li><a href="#books" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact</a></li>
        
        {/* Conditional links based on user authentication */}
        {user ? (
          <>
            <li><a href="#loans" onClick={(e) => { e.preventDefault(); navigateTo('loans'); }}>My Loans</a></li>
            <li><a href="#profile" onClick={(e) => { e.preventDefault(); navigateTo('profile'); }}>Profile</a></li>
            {user.role === 'admin' && (
              <li><a href="#admin" onClick={(e) => { e.preventDefault(); navigateTo('admin'); }}>Admin</a></li>
            )}
          </>
        ) : (
          <li><a href="#auth" onClick={(e) => { e.preventDefault(); navigateTo('auth'); }}>Login</a></li>
        )}
      </ul>

      <div className="nav-actions">
        {/* Notifications component */}
        <Notifications />
        
        {/* User menu */}
        {user && (
          <div className="user-menu">
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;