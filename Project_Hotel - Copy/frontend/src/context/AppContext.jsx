import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import ApiService from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState({
    books: true,
    users: true,
    loans: true,
    reservations: true,
    wishlist: true
  });

  // Load books from API - matches BookSearch.jsx pattern
  const loadBooks = async (search = '', category = '') => {
    try {
      setLoading(prev => ({ ...prev, books: true }));
      const res = await fetch("http://localhost:8000/api/books/");
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(prev => ({ ...prev, books: false }));
    }
  };

  // Load users (admin only) - matches LoansList.jsx pattern
  const loadUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      if (user?.role === 'admin' || user?.role === 'ADMIN') {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/admin/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Load loans for current user - matches LoansList.jsx pattern
  const loadLoans = async () => {
    try {
      setLoading(prev => ({ ...prev, loans: true }));
      if (user) {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/loans/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setLoans(data);
        }
      } else {
        setLoans([]);
      }
    } catch (error) {
      console.error('Error loading loans:', error);
    } finally {
      setLoading(prev => ({ ...prev, loans: false }));
    }
  };

  // Load reservations for current user - matches LoansList.jsx pattern
  const loadReservations = async () => {
    try {
      setLoading(prev => ({ ...prev, reservations: true }));
      if (user) {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/reservations/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setReservations(data);
        }
      } else {
        setReservations([]);
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(prev => ({ ...prev, reservations: false }));
    }
  };

  // Load wishlist for current user - matches BookSearch.jsx pattern
  const loadWishlist = async () => {
    try {
      setLoading(prev => ({ ...prev, wishlist: true }));
      if (user) {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/users/me/wishlist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          // Use data as-is from backend - simple array of {id, user_id, book_id, added_at}
          setWishlist(data);
        }
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(prev => ({ ...prev, wishlist: false }));
    }
  };

  // Load overdue loans - matches LoansList.jsx pattern
  const loadOverdueLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/admin/loans/overdue", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      return [];
    } catch (error) {
      console.error('Error loading overdue loans:', error);
      return [];
    }
  };

  // API Actions - matches patterns from all components
  const createLoan = async (loanData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/loans/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(loanData),
      });
      if (res.ok) {
        await loadLoans();
        await loadBooks();
        return await res.json();
      } else {
        throw new Error('Failed to create loan');
      }
    } catch (error) {
      console.error('Error creating loan:', error);
      throw error;
    }
  };

  const returnLoan = async (loanId, returnData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/loans/${loanId}/return`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(returnData),
      });
      if (res.ok) {
        await loadLoans();
        await loadBooks();
        return await res.json();
      } else {
        throw new Error('Failed to return loan');
      }
    } catch (error) {
      console.error('Error returning loan:', error);
      throw error;
    }
  };

  const cancelLoan = async (loanId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/loans/${loanId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        await loadLoans();
        await loadBooks();
        return await res.json();
      } else {
        throw new Error('Failed to cancel loan');
      }
    } catch (error) {
      console.error('Error cancelling loan:', error);
      throw error;
    }
  };

  const createReservation = async (reservationData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/reservations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });
      if (res.ok) {
        await loadReservations();
        return await res.json();
      } else {
        throw new Error('Failed to create reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  };

  const cancelReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/reservations/${reservationId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        await loadReservations();
        return await res.json();
      } else {
        throw new Error('Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  };

  const addToWishlist = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const body = { book_id: bookId };
      const res = await fetch("http://localhost:8000/api/users/me/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await loadWishlist();
        return await res.json();
      } else {
        throw new Error('Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/users/me/wishlist/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        await loadWishlist();
        return { message: "Successfully removed from wishlist" };
      } else {
        throw new Error('Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  // Admin actions - matches LoansList.jsx pattern
  const createBook = async (bookData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/admin/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
      if (res.ok) {
        await loadBooks();
        return await res.json();
      } else {
        throw new Error('Failed to create book');
      }
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  };

  const updateBook = async (bookId, bookData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/admin/books/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
      if (res.ok) {
        await loadBooks();
        return await res.json();
      } else {
        throw new Error('Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/admin/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        await loadBooks();
        return { message: "Book deleted successfully" };
      } else {
        throw new Error('Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        await loadUsers();
        return await res.json();
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        await loadUsers();
        return { message: "User deleted successfully" };
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const getDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/admin/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error('Failed to get dashboard stats');
      }
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  };

  const getOverdueLoans = async () => {
    return await loadOverdueLoans();
  };

  // Refresh all data
  const refreshData = async () => {
    setLoading({
      books: true,
      users: true,
      loans: true,
      reservations: true,
      wishlist: true
    });
    
    try {
      await Promise.all([
        loadBooks(),
        loadUsers(),
        loadLoans(),
        loadReservations(),
        loadWishlist()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Initial data load - only load public data
  useEffect(() => {
    loadBooks();
  }, []);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      loadUsers();
      loadLoans();
      loadReservations();
      loadWishlist();
    } else {
      // Reset user-specific data when logged out
      setUsers([]);
      setLoans([]);
      setReservations([]);
      setWishlist([]);
    }
  }, [user]);

  const contextValue = {
    // Data
    user,
    users,
    books,
    loans,
    reservations,
    wishlist,
    
    // Loading states
    loading,
    
    // Data loading functions
    refreshData,
    loadBooks,
    loadUsers,
    loadLoans,
    loadReservations,
    loadWishlist,
    
    // API Actions
    createLoan,
    returnLoan,
    cancelLoan,
    createReservation,
    cancelReservation,
    addToWishlist,
    removeFromWishlist,
    
    // Admin Actions
    createBook,
    updateBook,
    deleteBook,
    updateUser,
    deleteUser,
    getDashboardStats,
    getOverdueLoans
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};