import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './BasePage.css';

/**
 * BasePage Component - Thomas
 * Layout wrapper that provides consistent structure for all pages
 * Includes navbar, main content area, and footer
 */
const BasePage = ({ children, className = '' }) => {
  return (
    <div className="base-page">
      {/* Navigation Header */}
      <header className="page-header">
        <Navbar />
      </header>

      {/* Main Content Area */}
      <main className={`page-content ${className}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="page-footer">
        <Footer />
      </footer>
    </div>
  );
};

export default BasePage;