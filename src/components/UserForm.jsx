import React, { useState, useContext } from 'react';
import './UserForm.css';
import { AuthContext } from '../context/AuthContext'; 
import { jwtDecode } from 'jwt-decode';
/**
 * UserForm.jsx
 * -----------------------------------------------------------
 * Component: UserForm
 * Author: Tony Tan
 * Course: CSC-131-05 Software Engineering
 * Project: Library Management System
 *
 */
const UserForm = ({onLoginSuccess}) => {
  const [isLogin, setIsLogin] = useState(true);  // Default to the login page, but this always users to switch between the login and register form
  const { login } = useContext(AuthContext); // Calls the login in AuthContext which sets the username of who is logged in and the user profile.

  const toggleForm = () => { // Function to switch between the login and register form
    setIsLogin(!isLogin);
  };
  const loginFunc = async (e) =>{ // function that will take the data from those that have data-id="loginInfo" and log the user in and give them a token on their localStorage that will allow them to stay logged in even when exiting the page (default limit is 30 minutes)
    e.preventDefault();
    const elements = document.querySelectorAll(`[data-id="loginInfo"]`);
    const dataValues = {};
    for(const elementInput of elements){
        dataValues[elementInput.dataset.field] = elementInput.value;
    }
    const options = {
        method: 'POST',
        body: new URLSearchParams({
          username: dataValues["loginUsername"],
          password: dataValues["loginPassword"],
          role: 'user',
        }),
      };
    const res = await fetch("http://localhost:8000/api/auth/login",options);
    if(res.ok){
        const data = await res.json();
        const decryptedUserInfo = jwtDecode(data.access_token);

        const userData = {
            name: decryptedUserInfo.sub, 
            role: 'user', 
        };
        login(userData);
        if (onLoginSuccess){
            onLoginSuccess();
            localStorage.setItem("token", data.access_token);
        }
    }
  }

  const registerFunc = async (e) =>{ // function that takes the data from those that have data-id="registerInfo" and register the user into the database, then using that registered user's username and password to enact the activities from loginFunc.
      e.preventDefault();
      const elements = document.querySelectorAll(`[data-id="registerInfo"]`);
      const dataValues = {};
      for(const elementInput of elements){
          dataValues[elementInput.dataset.field] = elementInput.value;
      }
      const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email : dataValues["registerEmail"],
            username : dataValues["registerUsername"],
            full_name : dataValues["registerFullName"],
            password : dataValues["registerPassword"],

        }),
      };
      const res = await fetch("http://localhost:8000/api/auth/register",options);
      if(res.ok){
        const loginOptions = {
            method: 'POST',
            body: new URLSearchParams({
              username: dataValues["registerUsername"],
              password: dataValues["registerPassword"],
              role: 'user',
            }),
        };
        const loginRes = await fetch("http://localhost:8000/api/auth/login",loginOptions);
        if(loginRes.ok){
          const data = await loginRes.json();
          const decryptedUserInfo = jwtDecode(data.access_token);

          const userData = {
              name: decryptedUserInfo.sub, 
              role: 'user', 
          };
          login(userData);
          if (onLoginSuccess){
              onLoginSuccess();
              localStorage.setItem("token", data.access_token);
          }
        }
      }
  }

  return (
    <div className="registerAndLoginForm">
      {isLogin ? ( // Ternary operator that will switch between the login and register form when it's state changes from true or false
        <form onSubmit={loginFunc}> {/* When the submit button is clicked, the loginFunc will be fired */}
          <h1 id="addBookTitle">Login</h1>
          <div className="column">
            <label className="inputName" htmlFor="username">Username:</label>
            <input required type="text" className="form-control" name="username" data-id="loginInfo" data-field="loginUsername"/>
          </div> 
          <div className="column">
            <label className="inputName" htmlFor="password">Password:</label>
            <input required type="password" className="form-control" name="password" data-id="loginInfo" data-field="loginPassword"/>
          </div> 
          <button className="btn btn-primary submitButton" type="submit">Login</button>
          <div className="switchFormContainer">
            <button type="button" className="switchRegisterAndLoginForm" onClick={toggleForm}> {/* Will switch the true/false state of the isLogin variable */}
              Create new account
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={registerFunc}> {/* When the submit button is clicked, the registerFunc will be fired */}
          <h1 id="addBookTitle">Register</h1>
          <div className="column">
            <label className="inputName" htmlFor="email">Email:</label>
            <input required type="email" className="form-control" name="email" data-id="registerInfo" data-field="registerEmail"/>
          </div> 
          <div className="column">
            <label className="inputName" htmlFor="username">Username:</label>
            <input required type="text" className="form-control" name="username" data-id="registerInfo" data-field="registerUsername"/>
          </div> 
          <div className="column">
            <label className="inputName" htmlFor="full_name">Full Name:</label>
            <input required type="text" className="form-control" name="full_name" data-id="registerInfo" data-field="registerFullName"/>
          </div> 
          <div className="column">
            <label className="inputName" htmlFor="password">Password:</label>
            <input required type="password" className="form-control" name="password" data-id="registerInfo" data-field="registerPassword"/>
          </div> 
          <button className="btn btn-primary submitButton" type="submit">Register</button>
          <div className="switchFormContainer">
            <button type="button" className="switchRegisterAndLoginForm" onClick={toggleForm}> {/* Will switch the true/false state of the isLogin variable */}
              Already have an account? Log in
            </button>
          </div>
        </form>
      )}

      
    </div>
  );
};

export default UserForm;
