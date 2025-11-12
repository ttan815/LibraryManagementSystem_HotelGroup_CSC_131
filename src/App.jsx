import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import BooksPage from './pages/BooksPage';
import BookForm from './components/BookForm.jsx'
import UserForm from './components/UserForm.jsx'
import UserUpdateOrDeleteForm from './components/UserUpdateOrDeleteForm.jsx';
import LoansList from './components/LoansList.jsx';
import Footer from './components/Footer'
import CreditsPage from './pages/CreditsPage.jsx'
import ContactPage from './pages/ContactsPage.jsx'
import './App.css';

/**
 * Main App Component
 * Simple navigation without React Router for testing
 */
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'credits':
        return (
          <div className="page-content">
            <CreditsPage/>
            <Footer></Footer>
          </div>
        );
      case 'contact':
        return (
          <div className="page-content">
            <ContactPage/>
            <Footer></Footer>
          </div>
        );
      case 'admin':
        return <AdminPage />;
      case 'profile':
        return <UserPage />;
      case 'books':
        return (
          <div className="page-content">
            <BooksPage/>
            <Footer></Footer>
          </div>
        );
      case 'booksForm':
        return (
          <div className="page-content">
            <BookForm></BookForm>
            <Footer></Footer>
          </div>
        );
      case 'userUpdateOrDelete':
        return (
          <div className="page-content">
            <UserUpdateOrDeleteForm></UserUpdateOrDeleteForm>
            <Footer></Footer>
          </div>
        );
      case 'loans':
        return (
          <div className="page-content" style={{ padding: '2rem' }}>
            <LoansList></LoansList>
            <Footer></Footer>
          </div>
        );
      case 'auth':
        return (
          <div className="page-content" style={{ padding: '2rem' }}>
            <UserForm onLoginSuccess={() => setCurrentPage('profile')} />
            <Footer></Footer>
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
          {/* Simple Navigation for Testing */}
          <nav style={{ 
            background: '#343a40', 
            padding: '1rem', 
            display: 'flex', 
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button onClick={() => setCurrentPage('home')} className="btn btn-secondary">
              Home
            </button>
            <button onClick={() => setCurrentPage('books')} className="btn btn-secondary">
              Books
            </button>
            <button onClick={() => setCurrentPage('credits')} className="btn btn-secondary">
              Credits
            </button>
            <button onClick={() => setCurrentPage('contact')} className="btn btn-secondary">
              Contact
            </button>
            <button onClick={() => setCurrentPage('booksForm')} className="btn btn-secondary">
              BooksForm
            </button>
            <button onClick={() => setCurrentPage('userUpdateOrDelete')} className="btn btn-secondary">
              User (Updates & Deletes)
            </button>
            <button onClick={() => setCurrentPage('profile')} className="btn btn-secondary">
              Profile
            </button>
            <button onClick={() => setCurrentPage('admin')} className="btn btn-secondary">
              Admin
            </button>
            <button onClick={() => setCurrentPage('loans')} className="btn btn-secondary">
              My Loans
            </button>
            <button onClick={() => setCurrentPage('auth')} className="btn btn-secondary">
              Login
            </button>
          </nav>
          {renderPage()}
        </div>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;