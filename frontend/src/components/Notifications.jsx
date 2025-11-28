import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import '../pages/style.css';

/**
 * Enhanced Notifications Component
 * Displays all types of system notifications with priority handling
 */
const Notifications = () => {
  const { loans, user, books, reservations, wishlist } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Generate comprehensive notifications
  useEffect(() => {
    if (!user) return;

    const currentDate = new Date();
    const userNotifications = [];

    // 1. Overdue and due soon notifications
    if (loans && loans.length > 0) {
      loans.forEach(loan => {
        if (loan.userId === user.id && loan.status === 'active') {
          const dueDate = new Date(loan.dueDate);
          
          // Overdue books
          if (dueDate < currentDate) {
            userNotifications.push({
              id: `overdue-${loan.id}`,
              type: 'overdue',
              message: `OVERDUE: "${loan.bookTitle}" was due on ${dueDate.toLocaleDateString()}`,
              priority: 'high',
              timestamp: new Date(),
              read: false,
              action: 'return'
            });
          }
          // Due soon (within 2 days)
          else if ((dueDate - currentDate) / (1000 * 60 * 60 * 24) <= 2) {
            userNotifications.push({
              id: `reminder-${loan.id}`,
              type: 'reminder',
              message: `REMINDER: "${loan.bookTitle}" is due on ${dueDate.toLocaleDateString()}`,
              priority: 'medium',
              timestamp: new Date(),
              read: false,
              action: 'return'
            });
          }
        }
      });
    }

    // 2. Reservation notifications
    if (reservations && reservations.length > 0) {
      reservations.forEach(reservation => {
        if (reservation.user_id === user.id) {
          const expiryDate = reservation.expiry_date ? new Date(reservation.expiry_date) : null;
          
          // Reservation available
          if (reservation.status === 'available') {
            userNotifications.push({
              id: `reservation-available-${reservation.id}`,
              type: 'reservation',
              message: `AVAILABLE: "${reservation.bookTitle || 'Your reserved book'}" is ready for pickup`,
              priority: 'high',
              timestamp: new Date(),
              read: false,
              action: 'collect'
            });
          }
          
          // Reservation expiring soon (within 1 day)
          if (expiryDate && (expiryDate - currentDate) / (1000 * 60 * 60 * 24) <= 1) {
            userNotifications.push({
              id: `reservation-expiring-${reservation.id}`,
              type: 'reservation',
              message: `EXPIRING: Your reservation for "${reservation.bookTitle || 'book'}" expires on ${expiryDate.toLocaleDateString()}`,
              priority: 'medium',
              timestamp: new Date(),
              read: false,
              action: 'collect'
            });
          }
        }
      });
    }

    // 3. Wishlist notifications
    if (wishlist && books && wishlist.length > 0 && books.length > 0) {
      wishlist.forEach(item => {
        if (item.user_id === user.id) {
          const book = books.find(b => b.id === item.book_id);
          if (book && book.available_copies > 0) {
            // Check if we haven't already notified about this book
            const alreadyNotified = userNotifications.some(n => 
              n.id === `wishlist-available-${book.id}`
            );
            
            if (!alreadyNotified) {
              userNotifications.push({
                id: `wishlist-available-${book.id}`,
                type: 'wishlist',
                message: `BACK IN STOCK: "${book.title}" from your wishlist is now available`,
                priority: 'medium',
                timestamp: new Date(),
                read: false,
                action: 'reserve'
              });
            }
          }
        }
      });
    }

    // 4. System notifications (example - could be expanded)
    userNotifications.push({
      id: `system-welcome-${user.id}`,
      type: 'system',
      message: `Welcome back, ${user.full_name || user.username}!`,
      priority: 'low',
      timestamp: new Date(),
      read: false,
      action: null
    });

    // Sort by priority and timestamp (high priority first, then newest)
    userNotifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    setNotifications(userNotifications);
    
    // Calculate unread count
    const unread = userNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
    
  }, [loans, user, books, reservations, wishlist]);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Handle notification action
  const handleNotificationAction = (notification) => {
    markAsRead(notification.id);
    
    switch (notification.action) {
      case 'return':
        // Navigate to user page to return book
        window.location.hash = 'user';
        break;
      case 'collect':
        // Navigate to reservations
        window.location.hash = 'user?tab=reservations';
        break;
      case 'reserve':
        // Navigate to books page
        window.location.hash = 'books';
        break;
      default:
        break;
    }
  };

  // Don't show notifications if user not logged in
  if (!user) return null;

  return (
    <div className="notifications-container">
      {/* Notification bell icon */}
      <button 
        className="notification-bell"
        onClick={() => setIsVisible(!isVisible)}
        aria-label="View notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Notifications dropdown */}
      {isVisible && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <div className="notifications-title">
              <h4>Notifications</h4>
              {unreadCount > 0 && (
                <span className="unread-count">{unreadCount} unread</span>
              )}
            </div>
            <div className="notifications-actions">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="btn-text"
                  title="Mark all as read"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="btn-text"
                  title="Clear all notifications"
                >
                  Clear all
                </button>
              )}
              <button 
                onClick={() => setIsVisible(false)}
                className="close-btn"
                aria-label="Close notifications"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.priority} ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationAction(notification)}
                >
                  <div className="notification-content">
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-meta">
                      <span className="notification-type">{notification.type}</span>
                      <span className="notification-time">
                        {new Date(notification.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="notification-indicator"></div>
                  )}
                  {notification.action && (
                    <div className="notification-action">
                      <button className="btn-action">
                        {notification.action === 'return' && 'Return'}
                        {notification.action === 'collect' && 'Collect'}
                        {notification.action === 'reserve' && 'Reserve'}
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <div className="no-notifications-icon">📭</div>
                <p>No notifications</p>
                <small>You're all caught up!</small>
              </div>
            )}
          </div>
          
          <div className="notifications-footer">
            <small>Notifications update automatically</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;