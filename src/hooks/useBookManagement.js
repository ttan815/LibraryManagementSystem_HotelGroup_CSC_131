import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useBookManagement = () => {
  const { refreshData } = useContext(AppContext);

  const createBook = async (bookData) => {
    try {
      const token = localStorage.getItem("token");
      
      // Verify admin permissions
      const userRes = await fetch("http://localhost:8000/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const userInfo = await userRes.json();
      if (userInfo.role !== 'admin') {
        alert("Insufficient permissions to create book");
        return { success: false, error: "Insufficient permissions" };
      }

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      };

      const response = await fetch("http://localhost:8000/api/admin/books", options);
      
      if (response.ok) {
        const newBook = await response.json();
        alert("Book created successfully!");
        refreshData();
        return { success: true, data: newBook };
      } else {
        const errorData = await response.json();
        alert("Failed to create book. Please try again.");
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error creating book:', error);
      alert("Error creating book. Please try again.");
      return { success: false, error: error.message };
    }
  };

  const updateBook = async (bookId, bookData) => {
    try {
      const token = localStorage.getItem("token");
      
      // Verify admin permissions
      const userRes = await fetch("http://localhost:8000/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const userInfo = await userRes.json();
      if (userInfo.role !== 'admin') {
        alert("Insufficient permissions to update book");
        return { success: false, error: "Insufficient permissions" };
      }

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      };

      const response = await fetch(`http://localhost:8000/api/admin/books/${bookId}`, options);
      
      if (response.ok) {
        const updatedBook = await response.json();
        alert("Book updated successfully!");
        refreshData();
        return { success: true, data: updatedBook };
      } else {
        const errorData = await response.json();
        alert("Failed to update book. Please try again.");
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error updating book:', error);
      alert("Error updating book. Please try again.");
      return { success: false, error: error.message };
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      
      // Verify admin permissions
      const userRes = await fetch("http://localhost:8000/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const userInfo = await userRes.json();
      if (userInfo.role !== 'admin') {
        alert("Insufficient permissions to delete book");
        return { success: false, error: "Insufficient permissions" };
      }

      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(`http://localhost:8000/api/admin/books/${bookId}`, options);
      
      if (response.ok) {
        alert("Book deleted successfully!");
        refreshData();
        return { success: true };
      } else {
        const errorData = await response.json();
        alert("Failed to delete book. Please try again.");
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert("Error deleting book. Please try again.");
      return { success: false, error: error.message };
    }
  };

  return { createBook, updateBook, deleteBook };
};