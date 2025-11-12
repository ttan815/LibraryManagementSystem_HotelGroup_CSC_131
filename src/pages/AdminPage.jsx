import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext} from '../context/AuthContext';
import BasePage from './BasePage';
import './AdminPage.css';

/**
 * AdminPage Component - Tony
 * Administrative dashboard for managing users, books, loans, and system settings
 * Restricted to users with admin role
 */
const AdminPage = () => {
  const { user, users, books, loans, reservations } = useContext(AppContext);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <BasePage>
        <div className="admin-page">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You do not have permission to access the admin dashboard.</p>
            <a href="/" className="btn btn-primary">Return to Home</a>
          </div>
        </div>
      </BasePage>
    );
  }

  // Admin statistics
  const stats = {
    totalUsers: users.length,
    totalBooks: books.length,
    activeLoans: loans.filter(loan => loan.status === 'active').length,
    pendingReservations: reservations.filter(res => res.status === 'pending').length,
    overdueLoans: loans.filter(loan => {
      return loan.status === 'active' && new Date(loan.dueDate) < new Date();
    }).length
  };

  return (
    <BasePage className="admin-page">
      {/* Admin Header */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your library system efficiently</p>
      </div>

      {/* Quick Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalBooks}</div>
            <div className="stat-label">Total Books</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-info">
            <div className="stat-number">{stats.activeLoans}</div>
            <div className="stat-label">Active Loans</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <div className="stat-number">{stats.overdueLoans}</div>
            <div className="stat-label overdue">Overdue Loans</div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <nav className="admin-nav">
        <button 
          className={`nav-btn ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeSection === 'users' ? 'active' : ''}`}
          onClick={() => setActiveSection('users')}
        >
          👥 Manage Users
        </button>
        <button 
          className={`nav-btn ${activeSection === 'books' ? 'active' : ''}`}
          onClick={() => setActiveSection('books')}
        >
          📚 Manage Books
        </button>
        <button 
          className={`nav-btn ${activeSection === 'loans' ? 'active' : ''}`}
          onClick={() => setActiveSection('loans')}
        >
          🔄 Manage Loans
        </button>
        <button 
          className={`nav-btn ${activeSection === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveSection('reservations')}
        >
          📋 Reservations
        </button>
      </nav>

      {/* Admin Content Sections */}
      <div className="admin-content">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="overview-section">
            <h2>System Overview</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {loans.slice(0, 5).map(loan => {
                    const userObj = users.find(u => u.id === loan.userId);
                    const bookObj = books.find(b => b.id === loan.bookId);
                    return (
                      <div key={loan.id} className="activity-item">
                        <span className="activity-icon">📖</span>
                        <div className="activity-details">
                          <strong>{userObj?.name}</strong> borrowed 
                          "<em>{bookObj?.title}</em>"
                        </div>
                        <span className="activity-time">
                          {new Date(loan.borrowDate).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="overview-card">
                <h3>System Health</h3>
                <div className="health-metrics">
                  <div className="metric">
                    <span className="metric-label">Database Size:</span>
                    <span className="metric-value">Healthy</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Server Status:</span>
                    <span className="metric-value online">Online</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Last Backup:</span>
                    <span className="metric-value">Today, 02:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management Section */}
        {activeSection === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h2>User Management</h2>
              <button className="btn btn-primary">Add New User</button>
            </div>
            
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                      <td>
                        <span className="status-badge active">Active</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-small">Edit</button>
                          <button className="btn btn-small btn-danger">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Books Management Section */}
        {activeSection === 'books' && (
          <div className="books-section">
            <div className="section-header">
              <h2>Book Management</h2>
              <button className="btn btn-primary">Add New Book</button>
            </div>
            
            <div className="books-grid">
              {books.map(book => (
                <div key={book.id} className="admin-book-card">
                  <h4>{book.title}</h4>
                  <p className="book-author">{book.author}</p>
                  <p className="book-isbn">ISBN: {book.isbn}</p>
                  <div className={`availability ${book.available ? 'available' : 'unavailable'}`}>
                    {book.available ? 'Available' : 'Checked Out'}
                  </div>
                  <div className="book-actions">
                    <button className="btn btn-small">Edit</button>
                    <button className="btn btn-small btn-danger">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loans Management Section */}
        {activeSection === 'loans' && (
          <div className="loans-section">
            <h2>Loan Management</h2>
            <div className="loans-table-container">
              <table className="loans-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Book</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map(loan => {
                    const userObj = users.find(u => u.id === loan.userId);
                    const bookObj = books.find(b => b.id === loan.bookId);
                    const isOverdue = loan.status === 'active' && new Date(loan.dueDate) < new Date();
                    
                    return (
                      <tr key={loan.id} className={isOverdue ? 'overdue' : ''}>
                        <td>{userObj?.name}</td>
                        <td>{bookObj?.title}</td>
                        <td>{new Date(loan.borrowDate).toLocaleDateString()}</td>
                        <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${loan.status} ${isOverdue ? 'overdue' : ''}`}>
                            {loan.status} {isOverdue && '(Overdue)'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {loan.status === 'active' && (
                              <button className="btn btn-small btn-success">
                                Mark Returned
                              </button>
                            )}
                            <button className="btn btn-small">Details</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reservations Management Section */}
        {activeSection === 'reservations' && (
          <div className="reservations-section">
            <h2>Reservation Management</h2>
            <div className="reservations-list">
              {reservations.map(reservation => {
                const userObj = users.find(u => u.id === reservation.userId);
                const bookObj = books.find(b => b.id === reservation.bookId);
                
                return (
                  <div key={reservation.id} className="admin-reservation-card">
                    <div className="reservation-info">
                      <h4>{bookObj?.title}</h4>
                      <p>User: {userObj?.name}</p>
                      <p>Type: {reservation.type}</p>
                      <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
                    </div>
                    <div className="reservation-status">
                      <span className={`status-badge ${reservation.status}`}>
                        {reservation.status}
                      </span>
                    </div>
                    <div className="reservation-actions">
                      <button className="btn btn-small btn-success">Approve</button>
                      <button className="btn btn-small btn-danger">Reject</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </BasePage>
  );
};

export default AdminPage;