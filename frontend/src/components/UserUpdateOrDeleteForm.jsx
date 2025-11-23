import '../pages/style.css'
import React, { useContext, useState, useEffect } from 'react'; 
import { AppContext } from '../context/AppContext';

function UserUpdateOrDeleteForm(){
    const { users, updateUser, deleteUser, refreshData } = useContext(AppContext);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        full_name: '',
        role: 'user',
        is_active: true
    });
    const [deleteConfirm, setDeleteConfirm] = useState('');

    const selectedUser = users.find(user => user.id.toString() === selectedUserId);

    // Auto-fill form when user is selected
    useEffect(() => {
        if (selectedUser) {
            setFormData({
                email: selectedUser.email || '',
                username: selectedUser.username || '',
                full_name: selectedUser.full_name || '',
                role: selectedUser.role || 'user',
                is_active: selectedUser.is_active !== false
            });
            setDeleteConfirm('');
        }
    }, [selectedUser]);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedUserId) {
            alert("Please select a user to update");
            return;
        }

        try {
            const body = {
                email: formData.email,
                username: formData.username,
                full_name: formData.full_name,
                role: formData.role,
                is_active: formData.is_active
            };
            
            await updateUser(parseInt(selectedUserId), body);
            alert("Successfully updated user");
            
            // Reset form
            setSelectedUserId('');
            setFormData({
                email: '',
                username: '',
                full_name: '',
                role: 'user',
                is_active: true
            });
            
            // Refresh data
            refreshData();
            
        } catch (error) {
            console.error('Error updating user:', error);
            alert(`Update failed: ${error.message}`);
        }
    };

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedUserId) {
            alert("Please select a user to delete");
            return;
        }

        // PREVENT DELETING ADMIN USERS
        if (selectedUser?.role === 'admin') {
            alert("Cannot delete admin users. Please change their role to 'user' first if you want to remove admin privileges.");
            return;
        }

        if (deleteConfirm !== selectedUser?.username) {
            alert(`Please type "${selectedUser?.username}" to confirm deletion`);
            return;
        }

        const finalConfirmation = window.confirm(
            `ARE YOU ABSOLUTELY SURE?\n\nThis will PERMANENTLY DEACTIVATE user "${selectedUser.username}" and anonymize their data.\n\nThis action cannot be undone!`
        );
        
        if (!finalConfirmation) {
            return;
        }

        try {
            await deleteUser(parseInt(selectedUserId));
            alert("User permanently deactivated successfully");
            
            // Reset form
            setSelectedUserId('');
            setFormData({
                email: '',
                username: '',
                full_name: '',
                role: 'user', 
                is_active: true
            });
            setDeleteConfirm('');
            
            // Refresh data
            refreshData();
            
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(`Deletion failed: ${error.message}`);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Check if user can be deleted
    const canDeleteUser = selectedUser && selectedUser.role !== 'admin';

    return(
        <div className="addAndEditBookForm">
            {/* User Selection */}
            <div className="column">
                <label className="inputName" htmlFor="userSelect">Select User:</label>
                <select 
                    id="userSelect"
                    className="form-control"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="">Choose a user...</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.username} ({user.email}) - {user.role} - {user.is_active ? 'Active' : 'Inactive'}
                        </option>
                    ))}
                </select>
            </div>

            {selectedUser && (
                <>
                    {/* Update User Form */}
                    <form onSubmit={handleUpdateSubmit}>
                        <h2>Update User</h2>
                        
                        <div className="column">
                            <label className="inputName" htmlFor="email">Email:</label>
                            <input 
                                required 
                                type="email" 
                                className="form-control" 
                                id="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />    
                        </div>
                        
                        <div className="column">
                            <label className="inputName" htmlFor="username">Username:</label>
                            <input 
                                required 
                                type="text" 
                                className="form-control" 
                                id="username"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                            />    
                        </div>
                        
                        <div className="column">
                            <label className="inputName" htmlFor="full_name">Full Name:</label>
                            <input 
                                required 
                                type="text" 
                                className="form-control" 
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => handleInputChange('full_name', e.target.value)}
                            />    
                        </div>
                        
                        <div className="column">
                            <label className="inputName" htmlFor="role">Role:</label>
                            <select 
                                className="form-control"
                                id="role"
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="column">
                            <label className="inputName">
                                <input 
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                                />
                                Active User
                            </label>
                        </div>
                        
                        <button className="btn btn-primary submitButton" type="submit">
                            Update User
                        </button>
                    </form>
                    
                    {/* Delete User Form - Only show for non-admin users */}
                    {canDeleteUser ? (
                        <form onSubmit={handleDeleteSubmit}>
                            <h2>Delete User</h2>
                            
                            <div className="column">
                                <label className="inputName" htmlFor="confirmDelete">
                                    Type username to confirm deletion:
                                </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="confirmDelete"
                                    placeholder={`Type "${selectedUser.username}" to confirm`}
                                    value={deleteConfirm}
                                    onChange={(e) => setDeleteConfirm(e.target.value)}
                                />    
                            </div>
                            
                            <button className="btn btn-danger submitButton" type="submit">
                                Delete User Permanently
                            </button>
                        </form>
                    ) : (
                        <div className="alert alert-warning">
                            <strong>Admin User Protection:</strong> Admin users cannot be deleted. 
                            To remove admin privileges, change their role to "User" first.
                        </div>
                    )}
                </>
            )}

            <h2>All Users</h2>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {users && users.map((userObject) => (
                            <tr key={userObject.id}>
                                <td>{userObject.id}</td>
                                <td>{userObject.email}</td>
                                <td>{userObject.username}</td>
                                <td>{userObject.full_name}</td>
                                <td>
                                    <span className={`role-badge ${userObject.role}`}>
                                        {userObject.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${userObject.is_active ? 'active' : 'inactive'}`}>
                                        {userObject.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserUpdateOrDeleteForm;