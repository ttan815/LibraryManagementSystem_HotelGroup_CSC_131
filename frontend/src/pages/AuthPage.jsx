import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserForm from '../components/UserForm';
import './style.css';

/**
 * AuthPage Component - Wrapper for UserForm
 * Provides authentication page layout and context
 */
const AuthPage = ({ onLoginSuccess }) => {
  const { user } = useContext(AuthContext);

  // If user is already logged in, show a message
  if (user) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="already-logged-in">
              <h2>Already Logged In</h2>
              <p>You are already logged in as {user.name || user.username}.</p>
              <p>Redirecting to your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Library Management System</h1>
            <p>Sign in or create an account to access our library services</p>
          </div>
          
          {/* Use the UserForm component */}
          <UserForm onLoginSuccess={onLoginSuccess} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;