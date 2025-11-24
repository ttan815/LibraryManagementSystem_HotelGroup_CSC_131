import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import BasePage from './BasePage';
import BookForm from '../components/BookForm';
import UserUpdateOrDeleteForm from '../components/UserUpdateOrDeleteForm';
import LoansList from '../components/LoansList';
import './style.css';

const AdminPage = () => {
  // AUTO-REFRESH: Added dataVersion and lastUpdate to watch for changes
  const { user, users, books, loans, reservations, wishlist, allWishlists, refreshData, loading, dataVersion, lastUpdate } = useContext(AppContext);
  
  const [activeSection, setActiveSection] = useState('overview');
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeLoans: 0,
    pendingReservations: 0,
    overdueLoans: 0,
    totalWishlists: 0,
    availableBooks: 0
  });

  // Simple navigation function - matches BookSearch.jsx pattern
  const navigate = (page) => {
    window.location.hash = page;
    if (page === 'home') {
      window.location.reload();
    } else {
      setActiveSection('overview');
    }
  };

  // Enhanced admin check using AppContext user - matches LoansList.jsx admin pattern
  const isAdmin = () => {
    if (!user) {
      return false;
    }
    
    const role = user.role;
    if (!role) {
      return false;
    }
    
    const roleStr = String(role).toLowerCase().trim();
    const isAdminUser = roleStr === 'admin' || 
                       roleStr === 'administrator' || 
                       roleStr === 'superadmin' ||
                       roleStr === 'admin_user';
    
    return isAdminUser;
  };

  // Admin override for testing - matches LoansList.jsx pattern
  const isAdminOverride = () => {
    const adminUsernames = ['admin', 'administrator', 'superuser', 'testadmin', 'library_admin'];
    if (user && adminUsernames.includes(user.username)) {
      return true;
    }
    
    return isAdmin(); // FIXED: Call isAdmin() instead of isAdminOverride()
  };

  // Calculate statistics from AppContext data - AUTO REFRESHES when data changes
  useEffect(() => {
    const stats = {
      totalUsers: users.length,
      totalBooks: books.length,
      activeLoans: loans.filter(loan => {
        const status = loan.status?.toLowerCase();
        return status === 'active' || status === 'borrowed' || status === 'checked_out' || status === 'loaned';
      }).length,
      pendingReservations: reservations.filter(res => {
        const status = res.status?.toLowerCase();
        return status === 'pending' || status === 'waiting' || status === 'reserved';
      }).length,
      overdueLoans: loans.filter(loan => {
        const isActive = loan.status?.toLowerCase() === 'active' || 
                        loan.status?.toLowerCase() === 'borrowed' ||
                        loan.status?.toLowerCase() === 'loaned';
        const isOverdue = loan.due_date && new Date(loan.due_date) < new Date();
        return isActive && isOverdue;
      }).length,
      totalWishlists: allWishlists.length, // Updated to use allWishlists instead of wishlist
      availableBooks: books.filter(book => book.available_copies > 0).length
    };
    
    setAdminStats(stats);
  }, [users, books, loans, reservations, allWishlists, dataVersion]); // AUTO-REFRESH: Added dataVersion dependency

  // Auto-refresh indicator - logs when data changes
  useEffect(() => {
    console.log('AdminPage: Data updated, refreshing display...');
  }, [dataVersion]);

  // Check admin access - matches LoansList.jsx admin pattern
  if (!user || !isAdminOverride()) {
    return (
      <BasePage>
        <div className="admin-page">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You do not have permission to access the admin dashboard.</p>
            <div className="access-denied-actions">
              <button onClick={() => navigate('auth')} className="btn btn-primary">
                Go to Login Page
              </button>
              <button onClick={() => window.location.reload()} className="btn btn-outline">
                Refresh Page
              </button>
              <button onClick={() => navigate('home')} className="btn btn-outline">
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </BasePage>
    );
  }

  // Admin dashboard content
  return (
    <BasePage className="admin-page">
      <div className="admin-header">
        <div className="admin-header-main">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user.full_name || user.username}!</p>
            <small className="admin-badge">
              Role: {user.role} • Admin Access Granted
            </small>
          </div>
          <div className="admin-header-actions">
            {/* AUTO-REFRESH: Updated button to show loading state */}
            <button onClick={refreshData} className="btn btn-outline" disabled={loading.users || loading.books || loading.loans}>
              {loading.users || loading.books || loading.loans ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Statistics */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-number">{adminStats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-number">{adminStats.totalBooks}</div>
            <div className="stat-label">Total Books</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-number">{adminStats.availableBooks}</div>
            <div className="stat-label">Available Books</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-info">
            <div className="stat-number">{adminStats.activeLoans}</div>
            <div className="stat-label">Active Loans</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <div className="stat-number">{adminStats.overdueLoans}</div>
            <div className="stat-label overdue">Overdue Loans</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-number">{adminStats.pendingReservations}</div>
            <div className="stat-label">Pending Reservations</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-info">
            <div className="stat-number">{adminStats.totalWishlists}</div>
            <div className="stat-label">Wishlist Items</div>
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
          📖 Manage Loans
        </button>
        <button 
          className={`nav-btn ${activeSection === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveSection('reservations')}
        >
          ⏰ Reservations
        </button>
        <button 
          className={`nav-btn ${activeSection === 'wishlists' ? 'active' : ''}`}
          onClick={() => setActiveSection('wishlists')}
        >
          ❤️ All Wishlists
        </button>
      </nav>

      {/* Admin Content Sections */}
      <div className="admin-content">
        {activeSection === 'overview' && (
          <div className="overview-section">
            <h2>System Overview</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📈 Recent Activity</h3>
                <div className="activity-list">
                  {loans.slice(0, 5).map(loan => {
                    const userObj = users.find(u => u.id === loan.user_id);
                    const bookObj = books.find(b => b.id === loan.book_id);
                    return (
                      <div key={loan.id} className="activity-item">
                        <span className="activity-icon">📖</span>
                        <div className="activity-details">
                          <strong>{userObj?.username || userObj?.full_name || 'Unknown User'}</strong> borrowed 
                          "<em>{bookObj?.title || 'Unknown Book'}</em>"
                        </div>
                        <span className="activity-time">
                          {loan.loan_date ? new Date(loan.loan_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    );
                  })}
                  {loans.length === 0 && (
                    <div className="no-activity">No recent loan activity</div>
                  )}
                </div>
              </div>

              <div className="overview-card">
                <h3>🛠️ System Health</h3>
                <div className="health-metrics">
                  <div className="metric">
                    <span className="metric-label">Database Connection:</span>
                    <span className={`metric-value ${books.length > 0 ? 'online' : 'offline'}`}>
                      {books.length > 0 ? '✅ Connected' : '❌ Disconnected'}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Data Loaded:</span>
                    <span className="metric-value">
                      {books.length} books, {users.length} users, {loans.length} loans
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Available Books:</span>
                    <span className="metric-value">
                      {adminStats.availableBooks}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Pending Reservations:</span>
                    <span className="metric-value">
                      {adminStats.pendingReservations}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Overdue Loans:</span>
                    <span className={`metric-value ${adminStats.overdueLoans > 0 ? 'warning' : ''}`}>
                      {adminStats.overdueLoans} {adminStats.overdueLoans > 0 ? '⚠️' : '✅'}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Wishlist Items:</span>
                    <span className="metric-value">
                      {adminStats.totalWishlists}
                    </span>
                  </div>
                </div>
              </div>  
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h2>👥 User Management</h2>
              <p>Manage user accounts, roles, and permissions across the system</p>
            </div>
            <div className="section-content">
              <UserUpdateOrDeleteForm />
            </div>
          </div>
        )}

        {activeSection === 'books' && (
          <div className="books-section">
            <div className="section-header">
              <h2>📚 Book Management</h2>
              <p>Add, edit, or remove books from the library collection</p>
            </div>
            <div className="section-content">
              <BookForm />
            </div>
          </div>
        )}

        {activeSection === 'loans' && (
          <div className="loans-section">
            <div className="section-header">
              <h2>📖 Loan Management</h2>
              <p>Manage book loans, returns, and overdue items</p>
            </div>
            <div className="section-content">
              <LoansList></LoansList>
            </div>
          </div>
        )}

        {activeSection === 'reservations' && (
          <div className="reservations-section">
            <div className="section-header">
              <h2>⏰ Reservation Management</h2>
              <p>View and manage all book reservations</p>
            </div>
            <div className="section-content">
              <div className="reservations-list">
                <h3>All Reservations ({reservations.length})</h3>
                {reservations.length > 0 ? (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Book</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Reservation Date</th>
                          <th>Expiry Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map(reservation => {
                          const userObj = users.find(u => u.id === reservation.user_id);
                          const bookObj = books.find(b => b.id === reservation.book_id);
                          return (
                            <tr key={reservation.id}>
                              <td>{userObj?.username || 'Unknown'}</td>
                              <td>{bookObj?.title || 'Unknown Book'}</td>
                              <td>{reservation.reservation_type}</td>
                              <td>
                                <span className={`status-badge ${reservation.status?.toLowerCase()}`}>
                                  {reservation.status}
                                </span>
                              </td>
                              <td>{reservation.reservation_date ? new Date(reservation.reservation_date).toLocaleDateString() : 'N/A'}</td>
                              <td>{reservation.expiry_date ? new Date(reservation.expiry_date).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No reservations found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'wishlists' && (
          <div className="wishlists-section">
            <div className="section-header">
              <h2>❤️ All User Wishlists</h2>
              <p>View wishlists from all users across the system</p>
              <button onClick={refreshData} className="btn btn-outline" disabled={loading.allWishlists}>
                {loading.allWishlists ? 'Refreshing...' : 'Refresh All Data'}
              </button>
            </div>
            <div className="section-content">
              <div className="wishlists-list">
                <h3>All Wishlist Items ({allWishlists.length})</h3>
                
                {allWishlists.length > 0 ? (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Book Title</th>
                          <th>Author</th>
                          <th>ISBN</th>
                          <th>Added Date</th>
                          <th>Book Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allWishlists.map(item => {
                          const userObj = users.find(u => u.id === item.user_id);
                          const bookObj = books.find(b => b.id === item.book_id);
                          
                          return (
                            <tr key={item.id}>
                              <td>
                                <div className="user-info">
                                  <strong>{userObj?.username || `User ${item.user_id}`}</strong>
                                  <small>{userObj?.email || 'N/A'}</small>
                                  {userObj?.role === 'admin' && <span className="admin-badge">Admin</span>}
                                </div>
                              </td>
                              <td>
                                <strong>{bookObj?.title || `Book ${item.book_id}`}</strong>
                              </td>
                              <td>{bookObj?.author || 'Unknown'}</td>
                              <td>{bookObj?.isbn || 'N/A'}</td>
                              <td>{item.added_at ? new Date(item.added_at).toLocaleDateString() : 'N/A'}</td>
                              <td>
                                <span className={`status-badge ${bookObj?.available_copies > 0 ? 'available' : 'unavailable'}`}>
                                  {bookObj?.available_copies > 0 ? 'Available' : 'Checked Out'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No wishlist items found across all users.</p>
                    {loading.allWishlists && <p>Loading wishlists...</p>}
                  </div>
                )}
              </div>
              
              {/* Wishlist Statistics */}
              <div className="wishlist-stats">
                <h4>Wishlist Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">
                      {[...new Set(allWishlists.map(item => item.user_id))].length}
                    </span>
                    <span className="stat-label">Users with Wishlists</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{allWishlists.length}</span>
                    <span className="stat-label">Total Wishlist Items</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {[...new Set(allWishlists.map(item => item.book_id))].length}
                    </span>
                    <span className="stat-label">Unique Books</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {allWishlists.filter(item => {
                        const book = books.find(b => b.id === item.book_id);
                        return book?.available_copies > 0;
                      }).length}
                    </span>
                    <span className="stat-label">Available Books</span>
                  </div>
                </div>
              </div>
              
              {/* User Wishlist Breakdown */}
              <div className="user-wishlist-breakdown">
                <h4>User Wishlist Breakdown</h4>
                <div className="user-list">
                  {users.map(user => {
                    const userWishlist = allWishlists.filter(item => item.user_id === user.id);
                    if (userWishlist.length === 0) return null;
                    
                    return (
                      <div key={user.id} className="user-wishlist-item">
                        <div className="user-header">
                          <strong>{user.username}</strong>
                          <span className="wishlist-count">{userWishlist.length} items</span>
                        </div>
                        <div className="wishlist-books">
                          {userWishlist.slice(0, 3).map(item => {
                            const book = books.find(b => b.id === item.book_id);
                            return (
                              <span key={item.book_id} className="book-tag">
                                {book?.title || `Book ${item.book_id}`}
                              </span>
                            );
                          })}
                          {userWishlist.length > 3 && (
                            <span className="more-books">+{userWishlist.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    );
                  }).filter(Boolean)}
                  
                  {users.every(user => allWishlists.filter(item => item.user_id === user.id).length === 0) && (
                    <div className="empty-state">
                      <p>No users have items in their wishlists.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Most Wishlisted Books */}
              <div className="popular-wishlist-books">
                <h4>Most Wishlisted Books</h4>
                <div className="popular-books-list">
                  {(() => {
                    const bookCounts = {};
                    allWishlists.forEach(item => {
                      const bookId = item.book_id;
                      bookCounts[bookId] = (bookCounts[bookId] || 0) + 1;
                    });
                    
                    const popularBooks = Object.entries(bookCounts)
                      .map(([bookId, count]) => {
                        const book = books.find(b => b.id === parseInt(bookId));
                        return { book, count };
                      })
                      .filter(item => item.book)
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 5);
                    
                    return popularBooks.length > 0 ? (
                      popularBooks.map((item, index) => (
                        <div key={item.book.id} className="popular-book-item">
                          <span className="rank">#{index + 1}</span>
                          <span className="book-title">{item.book.title}</span>
                          <span className="wishlist-count">{item.count} users</span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <p>No wishlist data available for popular books.</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with system info - UPDATED: Shows auto-refresh status */}
      <div className="admin-footer">
        <div className="system-info">
          <span>Library Management System v1.0</span>
          <span>•</span>
          <span>Admin Dashboard</span>
          <span>•</span>
          {/* AUTO-REFRESH: Added real-time status indicator */}
          <span>Auto-refresh: {loading.users || loading.books ? '🔄 Updating...' : '✅ Active'}</span>
          <span>•</span>
          {/* AUTO-REFRESH: Use lastUpdate from context instead of current time */}
          <span>Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
        </div>
      </div>
    </BasePage>
  );
};

export default AdminPage;