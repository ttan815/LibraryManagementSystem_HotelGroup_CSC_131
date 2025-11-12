import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext} from '../context/AuthContext';
import BasePage from './BasePage';
import './UserPage.css';

/**
 * UserPage Component - Arnav
 * User profile and activity dashboard
 * Shows borrowing history, current loans, and user information
 */
const UserPage = () => {
  const { loans, reservations, books } = useContext(AppContext);
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('current');

  if (!user) {
    return (
      <BasePage>
        <div className="user-page">
          <div className="not-logged-in">
            <h2>Please Log In</h2>
            <p>You need to be logged in to view your profile.</p>
            <a href="/auth" className="btn btn-primary">Login</a>
          </div>
        </div>
      </BasePage>
    );
  }

  // Filter user's current and past loans
  const currentLoans = loans.filter(loan => 
    loan.userId === user.id && loan.status === 'active'
  );
  
  const pastLoans = loans.filter(loan => 
    loan.userId === user.id && loan.status === 'returned'
  );

  // Filter user's reservations
  const userReservations = reservations.filter(reservation => 
    reservation.userId === user.id
  );

  // Calculate overdue loans
  const overdueLoans = currentLoans.filter(loan => {
    const dueDate = new Date(loan.dueDate);
    return dueDate < new Date();
  });

  return (
    <BasePage className="user-page">
      {/* User Profile Header */}
      <div className="user-header">
        <div className="user-avatar">
          <div className="user-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        </div>
        <div className="user-info">
          <h1>{user.name}</h1>
          <p className="user-email">{user.email}</p>
          <p className="user-role">Role: {user.role}</p>
          <p className="user-member-since">
            Member since: {new Date(user.joinDate).toLocaleDateString()}
          </p>
        </div>
        <div className="user-actions">
          <button className="btn btn-outline" onClick={logout}>
            Logout
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
          <div className="stat-number">{userReservations.length}</div>
          <div className="stat-label">Active Reservations</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{pastLoans.length}</div>
          <div className="stat-label">Books Read</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="user-tabs">
        <button 
          className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Current Loans
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Borrowing History
        </button>
        <button 
          className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          My Reservations
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Current Loans Tab */}
        {activeTab === 'current' && (
          <div className="loans-section">
            <h3>Current Loans</h3>
            {currentLoans.length > 0 ? (
              <div className="loans-list">
                {currentLoans.map(loan => {
                  const book = books.find(b => b.id === loan.bookId);
                  const isOverdue = new Date(loan.dueDate) < new Date();
                  
                  return (
                    <div key={loan.id} className={`loan-item ${isOverdue ? 'overdue' : ''}`}>
                      <div className="loan-book-info">
                        <h4>{book?.title || 'Unknown Book'}</h4>
                        <p className="book-author">{book?.author}</p>
                      </div>
                      <div className="loan-dates">
                        <p>Due: {new Date(loan.dueDate).toLocaleDateString()}</p>
                        {isOverdue && <span className="overdue-badge">OVERDUE</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-data">No current loans.</p>
            )}
          </div>
        )}

        {/* Borrowing History Tab */}
        {activeTab === 'history' && (
          <div className="history-section">
            <h3>Borrowing History</h3>
            {pastLoans.length > 0 ? (
              <div className="history-list">
                {pastLoans.map(loan => {
                  const book = books.find(b => b.id === loan.bookId);
                  return (
                    <div key={loan.id} className="history-item">
                      <div className="history-book-info">
                        <h4>{book?.title || 'Unknown Book'}</h4>
                        <p className="book-author">{book?.author}</p>
                      </div>
                      <div className="history-dates">
                        <p>Borrowed: {new Date(loan.borrowDate).toLocaleDateString()}</p>
                        <p>Returned: {new Date(loan.returnDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-data">No borrowing history yet.</p>
            )}
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="reservations-section">
            <h3>My Reservations</h3>
            {userReservations.length > 0 ? (
              <div className="reservations-list">
                {userReservations.map(reservation => {
                  const book = books.find(b => b.id === reservation.bookId);
                  return (
                    <div key={reservation.id} className="reservation-item">
                      <div className="reservation-book-info">
                        <h4>{book?.title || 'Unknown Book'}</h4>
                        <p className="book-author">{book?.author}</p>
                        <p className="reservation-type">
                          Type: {reservation.type === 'loan' ? 'Take Home' : 'In-Person Reading'}
                        </p>
                      </div>
                      <div className="reservation-status">
                        <span className={`status-badge ${reservation.status}`}>
                          {reservation.status.toUpperCase()}
                        </span>
                        <p>Reserved: {new Date(reservation.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-data">No active reservations.</p>
            )}
          </div>
        )}
      </div>
    </BasePage>
  );
};

export default UserPage;