import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import BasePage from './BasePage';
import './style.css';

const HomePage = () => {
  const { books } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  // Use custom event to communicate with App.js navigation
  const navigateTo = (page) => {
    console.log(`Navigating to: ${page}`);
    
    // Dispatch a custom event that App.js is listening for
    const navigationEvent = new CustomEvent('appNavigation', {
      detail: { page: page }
    });
    window.dispatchEvent(navigationEvent);
  };

  // Book data calculations
  const featuredBooks = books.filter(book => book.available_copies > 0).slice(0, 3);
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.available_copies > 0).length;
  const loanedBooks = books.filter(book => book.available_copies === 0).length;

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
                <button onClick={() => navigateTo('profile')} className="btn btn-secondary">
                  My Profile
                </button>
                {user.role === 'admin' && (
                  <button onClick={() => navigateTo('admin')} className="btn btn-outline">
                    Admin Dashboard
                  </button>
                )}
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
            <p>Find books by title, author, or ISBN with our powerful search functionality</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Smart Reminders</h3>
            <p>Get automatic notifications for due dates and reservation availability</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Digital Management</h3>
            <p>Manage all your library activities from one convenient dashboard</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Wishlist</h3>
            <p>Save books you're interested in and get notified when they're available</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Reservations</h3>
            <p>Quickly reserve books for in-person reading or take-home loans</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure & Reliable</h3>
            <p>Your data is protected with modern security practices</p>
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
                <div className="book-cover">
                  <div className="book-cover-placeholder">
                    {book.title.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="book-info">
                  <h4>{book.title}</h4>
                  <p className="book-author">by {book.author}</p>
                  <p className="book-isbn">ISBN: {book.isbn}</p>
                  <div className="book-status available">
                    {book.available_copies} available
                  </div>
                </div>
                <button onClick={() => navigateTo('books')} className="btn btn-small">
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-books-message">
            <p>No books available at the moment. Check back later!</p>
            {user?.role === 'admin' && (
              <button onClick={() => navigateTo('admin')} className="btn btn-primary">
                Add Books
              </button>
            )}
          </div>
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
            <div className="stat-number">{totalBooks}</div>
            <div className="stat-label">Total Books</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{availableBooks}</div>
            <div className="stat-label">Available Now</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{loanedBooks}</div>
            <div className="stat-label">Currently Loaned</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>
            Join thousands of satisfied users who have transformed their reading experience 
            with LibraryMS. Start exploring our collection today!
          </p>
          <div className="cta-buttons">
            {!user ? (
              <>
                <button onClick={() => navigateTo('auth')} className="btn btn-primary btn-large">
                  Create Your Account
                </button>
                <button onClick={() => navigateTo('books')} className="btn btn-secondary btn-large">
                  Browse as Guest
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigateTo('books')} className="btn btn-primary btn-large">
                  Discover New Books
                </button>
                <button onClick={() => navigateTo('profile')} className="btn btn-secondary btn-large">
                  View My Profile
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </BasePage>
  );
};

export default HomePage;