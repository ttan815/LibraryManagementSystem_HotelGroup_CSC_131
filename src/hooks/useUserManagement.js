import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useUserManagement = () => {
  const { refreshData } = useContext(AppContext);

  const updateUser = async (userId, userData) => {
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
        alert("Insufficient permissions to update user");
        return { success: false, error: "Insufficient permissions" };
      }

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(userData),
      };

      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}`, options);
      
      if (response.ok) {
        alert("Successfully updated user");
        refreshData();
        return { success: true };
      } else {
        const errorData = await response.json();
        alert("Unsuccessful update for user, please try again later.");
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert("Error updating user. Please try again.");
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async (userId, username) => {
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
        alert("Insufficient permissions to delete user");
        return { success: false, error: "Insufficient permissions" };
      }

      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        }
      };

      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}`, options);
      
      if (response.ok) {
        alert("Successfully deleted user");
        refreshData();
        return { success: true };
      } else {
        const errorData = await response.json();
        alert(`Unsuccessful deletion of user, please try again later.`);
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert("Error deleting user. Please try again.");
      return { success: false, error: error.message };
    }
  };

  return { updateUser, deleteUser };
};