import './UserUpdateOrDeleteForm.css'
import React, { useContext, useState, useEffect } from 'react'; 
function UserUpdateOrDeleteForm(){
    const [users, setUsers] = useState([]); // Users is an array that will hold all the users currently in the database, set by setUsers
    const loadUsers = async () =>{
        const token = localStorage.getItem("token"); // A token is necessary, which contains the info of the currently logged in user and will determine whether or not the user is of a role with admin or just user
        const res = await fetch("http://localhost:8000/api/admin/users",{
            headers:{
                "Authorization": `Bearer ${token}`
            }         
        });
        const data = await res.json();
        setUsers(data);
    }
    useEffect(()=>{ // Function that will load all users from the database into users once the page is loaded or refreshed
        loadUsers();
    },[])
    const updateUser = async (e) =>{ // Function that will modify the information of the user specified (email and full name)
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
            const formData = new FormData(e.target); // Gets the data from the inputs when the form was submitted

            let userID = null; // Will become a value if a user is found with the specifications sent in the form (old email and old full name)
            const userCollectionResponse = await fetch("http://localhost:8000/api/admin/users",{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            });
            let found = false;
            const allUsers = await userCollectionResponse.json();
            console.log(allUsers);
            for(let i = 0; i < allUsers.length; i++){ // Validator to ensure that the oldEmail and oldFullName matches with a user in the database, where if it is, it'll go ahead and update the user, or else it'll not continue with the procedure
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
    const deleteUser = async (e) =>{ // Function that will delete the user with the specified information
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
            for(let i = 0; i < allUsers.length; i++){ // With all the users, a validator logic created to ensure that the information inputted in the form is an actual user in order for that specified user to be deleted.
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
                {/* When the Update User Information button is clicked, the updateUser function is called */}
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
                {/* When the Delete User button is clicked, the deleteUser function is called */}
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
            
            {/* Displays all the current users from the database as a visual aid to find what to modify and delete */}
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