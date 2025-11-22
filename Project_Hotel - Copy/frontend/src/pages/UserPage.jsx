import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import BasePage from './BasePage';
import './style.css';

const UserPage = () => {
  const { 
    loans, 
    reservations, 
    books, 
    wishlist, 
    returnLoan, 
    cancelReservation,
    removeFromWishlist,
    refreshData 
  } = useContext(AppContext);
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('current');
  const [userLoans, setUserLoans] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [userWishlist, setUserWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple navigation function - matches BookSearch.jsx pattern
  const navigate = (page) => {
    window.location.hash = page;
  };

  // Load user-specific data from AppContext - SIMPLIFIED
  useEffect(() => {
    const loadUserData = () => {
      if (!user) return;

      try {
        // Filter data for current user from AppContext
        const userLoansData = loans.filter(loan => 
          loan.user_id === user.id
        );
        setUserLoans(userLoansData);

        const userReservationsData = reservations.filter(reservation => 
          reservation.user_id === user.id
        );
        setUserReservations(userReservationsData);

        // SIMPLIFIED: Filter wishlist by user_id - matches BookSearch.jsx pattern
        const userWishlistData = wishlist.filter(item => 
          item.user_id === user.id
        );
        setUserWishlist(userWishlistData);

      } catch (error) {
        console.error('❌ Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, loans, reservations, wishlist]);

  // Helper function for due date calculations - matches Notifications.jsx pattern
  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return { status: 'unknown', days: 0 };
    
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return { status: 'overdue', days: Math.abs(daysUntilDue) };
    if (daysUntilDue <= 2) return { status: 'due-soon', days: daysUntilDue };
    return { status: 'ok', days: daysUntilDue };
  };

  // Handle returning a loan - matches LoansList.jsx pattern
  const handleReturnLoan = async (loanId) => {
    try {
      const returnData = {
        return_date: new Date().toISOString(),
        overdue_fee: 0
      };
      await returnLoan(loanId, returnData);
      alert('Book returned successfully!');
      refreshData();
    } catch (error) {
      console.error('Error returning loan:', error);
      alert('Error returning loan: ' + error.message);
    }
  };

  // Handle cancelling a reservation - matches LoansList.jsx pattern
  const handleCancelReservation = async (reservationId) => {
    try {
      await cancelReservation(reservationId);
      alert('Reservation cancelled successfully!');
      refreshData();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Error cancelling reservation: ' + error.message);
    }
  };

  // Handle wishlist removal - matches BookSearch.jsx pattern
  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await removeFromWishlist(bookId);
      alert('Book removed from wishlist!');
      refreshData();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Error removing from wishlist: ' + error.message);
    }
  };

  // Check if user is logged in - matches BookSearch.jsx pattern
  if (!user) {
    return (
      <BasePage>
        <div className="user-page">
          <div className="not-logged-in">
            <h2>Please Log In</h2>
            <p>You need to be logged in to view your profile.</p>
            <button onClick={() => navigate('auth')} className="btn btn-primary">
              Login
            </button>
          </div>
        </div>
      </BasePage>
    );
  }

  // Filter user's data from AppContext - matches LoansList.jsx filtering pattern
  const currentLoans = userLoans.filter(loan => 
    loan.status === 'active' || loan.status === 'ACTIVE' || loan.status === 'borrowed'
  );
  
  const pastLoans = userLoans.filter(loan => 
    loan.status === 'returned' || loan.status === 'RETURNED' || loan.status === 'completed'
  );

  const activeReservations = userReservations.filter(reservation => 
    reservation.status === 'pending' || reservation.status === 'PENDING' || 
    reservation.status === 'active' || reservation.status === 'ACTIVE' ||
    reservation.status === 'reserved'
  );

  // Calculate overdue loans - matches Notifications.jsx pattern
  const overdueLoans = currentLoans.filter(loan => {
    if (!loan.due_date) return false;
    const dueDate = new Date(loan.due_date);
    return dueDate < new Date();
  });

  // Get available books count from AppContext
  const availableBooksCount = books.filter(book => book.available_copies > 0).length;

  if (loading) {
    return (
      <BasePage>
        <div className="user-page">
          <div className="loading-container">
            <div className="loading-spinner">Loading your profile...</div>
          </div>
        </div>
      </BasePage>
    );
  }

  return (
    <BasePage className="user-page">
      {/* User Profile Header */}
      <div className="user-header">
        <div className="user-avatar">
          {user.username ? user.username.charAt(0).toUpperCase() : 
           user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="user-info">
          <h1>{user.full_name || user.username}</h1>
          <p className="user-email">{user.email}</p>
          <p className="user-role">
            Role: <span className={`role-badge ${user.role}`}>{user.role}</span>
          </p>
          {user.created_at && (
            <p className="user-member-since">
              Member since: {new Date(user.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="user-actions">
          <button className="btn btn-outline" onClick={logout}>
            Logout
          </button>
          <button className="btn btn-outline" onClick={refreshData}>
            Refresh Data
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-number">{currentLoans.length}</div>
          <div className="stat-label">Current Loans</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{overdueLoans.length}</div>
          <div className="stat-label overdue">Overdue</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeReservations.length}</div>
          <div className="stat-label">Active Reservations</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{userWishlist.length}</div>
          <div className="stat-label">Wishlist Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{availableBooksCount}</div>
          <div className="stat-label">Books Available</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="user-tabs">
        <button 
          className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Current Loans ({currentLoans.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Borrowing History ({pastLoans.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          My Reservations ({activeReservations.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          My Wishlist ({userWishlist.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'current' && (
          <div className="loans-section">
            <h3>Current Loans</h3>
            {currentLoans.length > 0 ? (
              <div className="loans-list">
                {currentLoans.map(loan => {
                  const book = books.find(b => b.id === loan.book_id);
                  const dueStatus = getDueDateStatus(loan.due_date);
                  
                  return (
                    <div key={loan.id} className={`loan-item ${dueStatus.status}`}>
                      <div className="loan-book-info">
                        <h4>{book?.title || 'Unknown Book'}</h4>
                        <p className="book-author">{book?.author || 'Unknown Author'}</p>
                        <p className="book-isbn">ISBN: {book?.isbn || 'N/A'}</p>
                      </div>
                      <div className="loan-dates">
                        <p><strong>Due:</strong> {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'N/A'}</p>
                        {dueStatus.status === 'overdue' && (
                          <span className="status-badge overdue">OVERDUE ({dueStatus.days} days)</span>
                        )}
                        {dueStatus.status === 'due-soon' && (
                          <span className="status-badge due-soon">Due in {dueStatus.days} days</span>
                        )}
                        {dueStatus.status === 'ok' && (
                          <span className="status-badge ok">On track</span>
                        )}
                      </div>
                      <div className="loan-actions">
                        <button 
                          onClick={() => handleReturnLoan(loan.id)}
                          className="btn btn-small btn-primary"
                        >
                          Return Book
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <p>No current loans.</p>
                <button onClick={() => navigate('books')} className="btn btn-primary">
                  Browse Available Books
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h3>Borrowing History</h3>
            {pastLoans.length > 0 ? (
              <div className="history-list">
                {pastLoans.map(loan => {
                  const book = books.find(b => b.id === loan.book_id);
                  return (
                    <div key={loan.id} className="history-item">
                      <div className="history-book-info">
                        <h4>{book?.title || 'Unknown Book'}</h4>
                        <p className="book-author">{book?.author || 'Unknown Author'}</p>
                        <p className="book-isbn">ISBN: {book?.isbn || 'N/A'}</p>
                      </div>
                      <div className="history-dates">
                        <p><strong>Borrowed:</strong> {loan.loan_date ? new Date(loan.loan_date).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Returned:</strong> {loan.return_date ? new Date(loan.return_date).toLocaleDateString() : 'Not returned'}</p>
                        {loan.overdue_fee > 0 && (
                          <p><strong>Overdue Fee:</strong> ${loan.overdue_fee.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📖</div>
                <p>No borrowing history yet.</p>
                <button onClick={() => navigate('books')} className="btn btn-primary">
                  Start Borrowing
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="reservations-section">
            <h3>My Reservations</h3>
            {activeReservations.length > 0 ? (
              <div className="reservations-list">
                {activeReservations.map(reservation => {
                  const book = books.find(b => b.id === reservation.book_id);
                  return (
                    <div key={reservation.id} className="reservation-item">
                      <div className="reservation-book-info">
                        <h4>{book?.title || 'Unknown Book'}</h4>
                        <p className="book-author">{book?.author || 'Unknown Author'}</p>
                        <p className="reservation-type">
                          <strong>Type:</strong> {reservation.reservation_type === 'loan' ? 'Take Home' : 'In-Person Reading'}
                        </p>
                      </div>
                      <div className="reservation-status">
                        <span className={`status-badge ${reservation.status?.toLowerCase()}`}>
                          {reservation.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                        <p><strong>Reserved:</strong> {reservation.reservation_date ? new Date(reservation.reservation_date).toLocaleDateString() : 'N/A'}</p>
                        {reservation.expiry_date && (
                          <p><strong>Expires:</strong> {new Date(reservation.expiry_date).toLocaleDateString()}</p>
                        )}
                      </div>
                      <div className="reservation-actions">
                        <button 
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="btn btn-small btn-outline"
                        >
                          Cancel Reservation
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">⏰</div>
                <p>No active reservations.</p>
                <button onClick={() => navigate('books')} className="btn btn-primary">
                  Make a Reservation
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="wishlist-section">
            <div className="section-header">
              <h3>My Wishlist</h3>
              <button onClick={refreshData} className="btn btn-small btn-outline">
                Refresh Data
              </button>
            </div>
            
            {userWishlist.length > 0 ? (
              <div className="wishlist-list">
                {userWishlist.map(item => {
                  // Find book details from books array - matches BookSearch.jsx pattern
                  const book = books.find(b => b.id === item.book_id);
                  const isAvailable = book?.available_copies > 0;
                  
                  return (
                    <div key={item.id} className="wishlist-item">
                      <div className="wishlist-book-info">
                        <h4>{book?.title || 'Book Not Found'}</h4>
                        <p className="book-author">{book?.author || 'Unknown Author'}</p>
                        <p className="book-isbn">ISBN: {book?.isbn || 'N/A'}</p>
                        {book?.category && (
                          <p className="book-category">{book.category}</p>
                        )}
                        <div className={`availability ${isAvailable ? 'available' : 'unavailable'}`}>
                          {isAvailable ? 'Available Now' : 'Currently Unavailable'}
                        </div>
                        <p className="wishlist-added">
                          Added on: {item.added_at ? new Date(item.added_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="wishlist-actions">
                        {isAvailable && (
                          <button 
                            onClick={() => navigate('books')}
                            className="btn btn-small btn-primary"
                          >
                            Reserve Now
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemoveFromWishlist(item.book_id)}
                          className="btn btn-small btn-outline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">❤️</div>
                <p>Your wishlist is empty.</p>
                <p>Add books to your wishlist from the Books page.</p>
                <button onClick={() => navigate('books')} className="btn btn-primary">
                  Browse Books
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Data Source Info */}
      <div className="data-source-info">
        <small>Data loaded from AppContext • Last refresh: {new Date().toLocaleTimeString()}</small>
      </div>
    </BasePage>
  );
};

export default UserPage;