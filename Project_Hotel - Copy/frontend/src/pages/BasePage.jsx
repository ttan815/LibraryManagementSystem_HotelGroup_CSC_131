import React from 'react';
import './BasePage.css';

/**
 * BasePage Component - Thomas
 * Layout wrapper that provides consistent structure for all pages
 * Footer is now handled by App.jsx
 */
const BasePage = ({ children, className = '' }) => {
  return (
    <div className="base-page">
      {/* Main Content Area */}
      <main className={`page-content ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default BasePage;