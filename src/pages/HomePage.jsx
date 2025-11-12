import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext} from '../context/AuthContext';
import BasePage from './BasePage';
import './HomePage.css';

/**
 * HomePage Component - Thomas
 * Landing page that introduces the library management system
 * Shows featured books and quick actions
 */
const HomePage = () => {
  const { user, books } = useContext(AppContext);

  // Get featured books (first 3 available books)
  const featuredBooks = books
    .filter(book => book.available)
    .slice(0, 3);

  // Simple navigation
  const navigateTo = (page) => {
    window.location.hash = page;
    window.location.reload();
  };

  return (
    <BasePage className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to LibraryMS</h1>
          <p className="hero-subtitle">
            Discover, Borrow, and Manage Books with Ease
          </p>
          <p className="hero-description">
            Your digital gateway to our extensive library collection. 
            Search thousands of books, manage your loans, and explore new worlds.
          </p>
          
          {/* Call-to-Action Buttons */}
          <div className="hero-actions">
            {!user ? (
              <>
                <button onClick={() => navigateTo('auth')} className="btn btn-primary">
                  Get Started - Sign Up
                </button>
                <button onClick={() => navigateTo('books')} className="btn btn-secondary">
                  Browse Collection
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigateTo('books')} className="btn btn-primary">
                  Browse Books
                </button>
                <button onClick={() => navigateTo('loans')} className="btn btn-secondary">
                  My Loans
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Hero Visual */}
        <div className="hero-visual">
          <div className="book-stack">
            <div className="book book-1">📚</div>
            <div className="book book-2">📖</div>
            <div className="book book-3">📕</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose LibraryMS?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Easy Search</h3>
            <p>Find books by title, author, or ISBN with our powerful search</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Smart Reminders</h3>
            <p>Get automatic notifications for due dates and reservations</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Digital Management</h3>
            <p>Manage all your library activities from one dashboard</p>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-books-section">
        <h2>Featured Books</h2>
        {featuredBooks.length > 0 ? (
          <div className="featured-books-grid">
            {featuredBooks.map(book => (
              <div key={book.id} className="featured-book-card">
                <h4>{book.title}</h4>
                <p className="book-author">by {book.author}</p>
                <div className="book-status available">Available</div>
                <button onClick={() => navigateTo('books')} className="btn btn-small">
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-books-message">No books available at the moment.</p>
        )}
        
        <div className="view-all-books">
          <button onClick={() => navigateTo('books')} className="btn btn-outline">
            View All Books →
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{books.length}</div>
            <div className="stat-label">Total Books</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {books.filter(book => book.available).length}
            </div>
            <div className="stat-label">Available Now</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {books.filter(book => !book.available).length}
            </div>
            <div className="stat-label">Currently Loaned</div>
          </div>
        </div>
      </section>
    </BasePage>
  );
};

export default HomePage;