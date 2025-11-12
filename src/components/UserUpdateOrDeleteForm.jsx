import './UserUpdateOrDeleteForm.css'
import React, { useContext, useState, useEffect } from 'react'; 
function UserUpdateOrDeleteForm(){
    const [users, setUsers] = useState([]);
    const loadUsers = async () =>{
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/admin/users",{
            headers:{
                "Authorization": `Bearer ${token}`
            }         
        });
        const data = await res.json();
        setUsers(data);
    }
    useEffect(()=>{
        loadUsers();
    },[])
    const updateUser = async (e) =>{
        e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/users/me",{
        headers:{
            "Authorization": `Bearer ${token}`
        }
        });
        const userInfo = await res.json();
        console.log(userInfo.role)
        if(userInfo.role != 'admin'){
        alert("Insufficient permissions to update user")
        }
        else{
            const formData = new FormData(e.target);

            let userID = null;
            const userCollectionResponse = await fetch("http://localhost:8000/api/admin/users",{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            });
            let found = false;
            const allUsers = await userCollectionResponse.json();
            console.log(allUsers);
            for(let i = 0; i < allUsers.length; i++){
            if(formData.get("oldEmail") == allUsers[i]["email"] && formData.get("oldFullName") == allUsers[i]["full_name"]){
                userID = allUsers[i]["id"];
                found = true;
                break;
            }
            }
            if(found){
            const body = {
                "email" : formData.get('newEmail'),
                "full_name" : formData.get('newFullName')
            }
            const options = {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
                },
                body: JSON.stringify(body),
            };
                const status = await fetch(`http://localhost:8000/api/admin/users/${userID}`, options)
                if(status.ok){
                    alert("Successfully updated user")
                }
                else{
                    alert("Unsuccessful update for user, please try again later.")
                }
            }
            else{
                alert("Unable to find a user under the email: " + formData.get("oldEmail") + " and Full Name: " + formData.get("oldFullName"))
            }
        }
    }
    const deleteUser = async (e) =>{
        e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/users/me",{
        headers:{
            "Authorization": `Bearer ${token}`
        }
        });
        const userInfo = await res.json();
        console.log(userInfo.role)
        if(userInfo.role != 'admin'){
        alert("Insufficient permissions to delete user")
        }
        else{
            const formData = new FormData(e.target);

            let userID = null;
            const userCollectionResponse = await fetch("http://localhost:8000/api/admin/users",{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            });
            let found = false;
            const allUsers = await userCollectionResponse.json();
            console.log(allUsers);
            for(let i = 0; i < allUsers.length; i++){
            if(formData.get("username") == allUsers[i]["username"]){
                userID = allUsers[i]["id"];
                found = true;
                break;
            }
            }
            if(found){
            const options = {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
                }
            };
                const status = await fetch(`http://localhost:8000/api/admin/users/${userID}`, options)
                if(status.ok){
                    alert("Successfully deleted user")
                }
                else{
                    alert("Unsuccessful deletion of user, please try again later.")
                }
            }
            else{
                alert("Unable to find a user to delete by the username: " + formData.get("username"));
            }
        }
    }

    return(
        <>
            <div className="addAndEditBookForm">
                <form onSubmit={updateUser}>
                    <h1 id="addBookTitle">Update User</h1>
                    <div className="column">
                    <label className="inputName" for="oldEmail" htmlFor="oldEmail">Old Email:</label>
                    <input required type="text" className="form-control" name="oldEmail"></input>    
                    </div> 
                    <div className="column">
                    <label className="inputName" for="oldFullName" htmlFor="oldFullName">Old Full Name:</label>
                    <input required type="text" className="form-control" name="oldFullName"></input>    
                    </div> 
                    <div className="column">
                    <label className="inputName" for="newEmail" htmlFor="newEmail">New Email:</label>
                    <input required type="text" className="form-control" name="newEmail"></input>    
                    </div> 
                    <div className="column">
                    <label className="inputName" for="newFullName" htmlFor="newFullName">New Full Name:</label>
                    <input required type="text" className="form-control" name="newFullName"></input>    
                    </div> 
                    <button className="btn btn-primary submitButton" type="submit">Update User Information</button>
                </form>
                <form onSubmit={deleteUser}>
                    <h1 id="addBookTitle">Delete User</h1>
                    <div className="column">
                    <label className="inputName" for="username">Username:</label>
                    <input required type="text" className="form-control" name="username"></input>    
                    </div> 
                    <button className="btn btn-primary submitButton" type="submit">Delete User</button>
                </form>

        <h2>All Users</h2>
        <table>
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Full Name</th>
                </tr>
            </thead>
            
            <tbody>
                {users && users.map((userObject) =>(
                    <tr key={userObject.id}>
                      {/* Book ID */}
                      <td>
                          {userObject.id}
                      </td>
                      {/* Book Email */}
                      <td>
                          {userObject.email}
                      </td>
                      {/* Author */}
                      <td>
                          {userObject.username}
                      </td>
                      {/* Full Name */}
                      <td>
                          {userObject.full_name}
                      </td>
                    </tr>
                ))}
            </tbody>
        </table>
            </div>
        </>
    )
}

export default UserUpdateOrDeleteForm;