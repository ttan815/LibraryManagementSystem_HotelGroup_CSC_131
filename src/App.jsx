import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import BooksPage from './pages/BooksPage';
import BookForm from './components/BookForm.jsx';
import AuthPage from './pages/AuthPage.jsx';
import UserUpdateOrDeleteForm from './components/UserUpdateOrDeleteForm.jsx';
import LoansList from './components/LoansList.jsx';
import Footer from './components/Footer';
import CreditsPage from './pages/CreditsPage.jsx';
import ContactPage from './pages/ContactsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import './App.css';

/**
 * Main App Component
 * Uses React state-based navigation through Navbar only
 */
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Listen for navigation events from components
  useEffect(() => {
    const handleAppNavigation = (event) => {
      const { page } = event.detail;
      console.log(`App received navigation request: ${page}`);
      setCurrentPage(page);
    };

    window.addEventListener('appNavigation', handleAppNavigation);
    
    return () => {
      window.removeEventListener('appNavigation', handleAppNavigation);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'credits':
        return <CreditsPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPage />;
      case 'profile':
        return <UserPage />;
      case 'books':
        return <BooksPage />;
      case 'booksForm':
        return <BookForm />;
      case 'userUpdateOrDelete':
        return <UserUpdateOrDeleteForm />;
      case 'loans':
        return <LoansList />;
      case 'auth':
        return <AuthPage onLoginSuccess={() => setCurrentPage('profile')} />;
      case 'privacy':
        return (
          <div className="page-content" style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Privacy Policy</h1>
            <p>Privacy policy page coming soon...</p>
          </div>
        );
      case 'terms':
        return (
          <div className="page-content" style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Terms of Service</h1>
            <p>Terms of service page coming soon...</p>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <AuthProvider>
      <AppProvider>
        <div className="app">
          {/* Only one navbar - the main Navbar component */}
          <Navbar onNavigate={setCurrentPage} />
          <main className="app-main">
            {renderPage()}
          </main>
          {/* Footer with navigation capability */}
          <Footer onNavigate={setCurrentPage} />
        </div>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;