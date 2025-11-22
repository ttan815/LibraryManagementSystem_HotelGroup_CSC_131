import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import '../components/Notifications.css';

/**
 * Notifications Component
 * Displays return reminders and system notifications
 * Automatically checks for overdue books
 */
const Notifications = () => {
  const { loans, user } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Check for overdue loans and generate notifications
  useEffect(() => {
    if (!user || !loans.length) return;

    const currentDate = new Date();
    const userNotifications = [];

    loans.forEach(loan => {
      // Only check loans for current user
      if (loan.userId === user.id && loan.status === 'active') {
        const dueDate = new Date(loan.dueDate);
        
        // Check if loan is overdue
        if (dueDate < currentDate) {
          userNotifications.push({
            id: loan.id,
            type: 'overdue',
            message: `OVERDUE: "${loan.bookTitle}" was due on ${dueDate.toLocaleDateString()}`,
            priority: 'high'
          });
        }
        // Check if loan is due soon (within 2 days)
        else if ((dueDate - currentDate) / (1000 * 60 * 60 * 24) <= 2) {
          userNotifications.push({
            id: loan.id,
            type: 'reminder',
            message: `REMINDER: "${loan.bookTitle}" is due on ${dueDate.toLocaleDateString()}`,
            priority: 'medium'
          });
        }
      }
    });

    setNotifications(userNotifications);
  }, [loans, user]);

  // Don't show notifications if user not logged in or no notifications
  if (!user || notifications.length === 0) return null;

  return (
    <div className="notifications-container">
      {/* Notification bell icon */}
      <button 
        className="notification-bell"
        onClick={() => setIsVisible(!isVisible)}
        aria-label="View notifications"
      >
        🔔
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {/* Notifications dropdown */}
      {isVisible && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h4>Notifications</h4>
            <button 
              onClick={() => setIsVisible(false)}
              className="close-btn"
            >
              ×
            </button>
          </div>
          
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.priority}`}
              >
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;