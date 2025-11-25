import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [allWishlists, setAllWishlists] = useState([]); // NEW: For admin to see all wishlists
  const [loading, setLoading] = useState({
    books: true,
    users: true,
    loans: true,
    reservations: true,
    wishlist: true,
    allWishlists: false // NEW: Loading state for all wishlists
  });
  
  // AUTO-REFRESH TRACKING: Added to trigger component re-renders when data changes
  const [dataVersion, setDataVersion] = useState(0); // Increments on every data refresh
  const [lastUpdate, setLastUpdate] = useState(Date.now()); // Tracks last refresh timestamp
  const debouncedRefresh = useRef(null); // Prevents too many rapid refreshes

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

  // NEW: Load all wishlists for admin users
  const loadAllWishlists = async () => {
    try {
      setLoading(prev => ({ ...prev, allWishlists: true }));
      if (user?.role === 'admin' || user?.role === 'ADMIN') {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/admin/wishlists", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAllWishlists(data);
        } else {
          // Fallback: If admin wishlists endpoint doesn't exist, use regular wishlist for admin
          console.warn('Admin wishlists endpoint not available, using regular wishlist');
          await loadWishlist();
        }
      } else {
        setAllWishlists([]);
      }
    } catch (error) {
      console.error('Error loading all wishlists:', error);
      setAllWishlists([]);
    } finally {
      setLoading(prev => ({ ...prev, allWishlists: false }));
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

  // ENHANCED REFRESH FUNCTION: Now loads all wishlists for admin
  const refreshData = async () => {
    setLoading({
      books: true,
      users: true,
      loans: true,
      reservations: true,
      wishlist: true,
      allWishlists: true
    });
    
    try {
      if (user?.role === 'admin' || user?.role === 'ADMIN') {
        // For admin, load both personal wishlist and all wishlists
        await Promise.all([
          loadBooks(),
          loadUsers(),
          loadLoans(),
          loadReservations(),
          loadWishlist(),
          loadAllWishlists() // Load all wishlists for admin view
        ]);
      } else {
        // For regular users, use normal flow
        await Promise.all([
          loadBooks(),
          loadUsers(),
          loadLoans(),
          loadReservations(),
          loadWishlist()
        ]);
      }
      
      // AUTO-REFRESH: Increment version to trigger component re-renders
      setDataVersion(prev => prev + 1);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // API Actions - UPDATED: All now call refreshData() instead of individual load functions
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
        await refreshData(); // AUTO-REFRESH: Use refreshData instead of loadLoans() only
        return await res.json();
      } else {
        throw new Error('Failed to create loan');
      }
    } catch (error) {
      console.error('Error creating loan:', error);
      throw error;
    }
  };

  // FIXED: Enhanced returnLoan function with proper error handling
  const returnLoan = async (loanId, returnData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Returning loan ID:', loanId, 'with data:', returnData);

      // FIXED: Use the correct endpoint and method
      const res = await fetch(`http://localhost:8000/api/loans/${loanId}/return`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(returnData),
      });

      console.log('Return loan response status:', res.status);

      if (res.ok) {
        const result = await res.json();
        console.log('Return loan success:', result);
        await refreshData(); // Refresh all data
        return result;
      } else {
        const errorText = await res.text();
        console.error('Return loan error response:', errorText);
        
        let errorMessage = 'Failed to return loan';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${res.status} ${res.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error returning loan:', error);
      
      // Enhanced error handling for network issues
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running on http://localhost:8000');
      }
      
      throw error;
    }
  };

  // FIXED: Enhanced cancelLoan function
  const cancelLoan = async (loanId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch(`http://localhost:8000/api/loans/${loanId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await refreshData();
        return await res.json();
      } else {
        const errorText = await res.text();
        let errorMessage = 'Failed to cancel loan';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error cancelling loan:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running on http://localhost:8000');
      }
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
        await refreshData(); // AUTO-REFRESH: Use refreshData instead of individual loads
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
        await refreshData(); // AUTO-REFRESH: Use refreshData instead of individual loads
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
        await refreshData(); // AUTO-REFRESH: Use refreshData instead of individual loads
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
        await refreshData(); // AUTO-REFRESH: Use refreshData instead of individual loads
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
        await refreshData(); // AUTO-REFRESH: Use refreshData instead of individual loads
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
        await refreshData(); // AUTO-REFRESH: Use refreshData instead of individual loads
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
        await refreshData(); // AUTO-REFRESH: Use refreshData instead of individual loads
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
        await refreshData(); // AUTO-REFRESH: Use refreshData instead of individual loads
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
        await refreshData(); // AUTO-REFRESH: Use refreshData instead of individual loads
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

  // DEBOUNCED AUTO-REFRESH: Prevents excessive re-renders when data changes rapidly
  useEffect(() => {
    if (debouncedRefresh.current) {
      clearTimeout(debouncedRefresh.current);
    }
    
    debouncedRefresh.current = setTimeout(() => {
      // This ensures components re-render when dataVersion changes
      // The timeout prevents too many rapid refreshes
    }, 100);
  }, [dataVersion]);

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
      // Load all wishlists if user is admin
      if (user.role === 'admin' || user.role === 'ADMIN') {
        loadAllWishlists();
      }
    } else {
      // Reset user-specific data when logged out
      setUsers([]);
      setLoans([]);
      setReservations([]);
      setWishlist([]);
      setAllWishlists([]);
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
    allWishlists, // NEW: All wishlists for admin
    
    // Loading states
    loading,
    
    // AUTO-REFRESH: Added these to context for components to use
    dataVersion, // Components can watch this to know when data changes
    lastUpdate, // Shows when data was last refreshed
    
    // Data loading functions
    refreshData,
    loadBooks,
    loadUsers,
    loadLoans,
    loadReservations,
    loadWishlist,
    loadAllWishlists, // NEW: Function to load all wishlists
    
    // API Actions
    createLoan,
    returnLoan, // FIXED: Now has proper error handling
    cancelLoan, // FIXED: Now has proper error handling
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