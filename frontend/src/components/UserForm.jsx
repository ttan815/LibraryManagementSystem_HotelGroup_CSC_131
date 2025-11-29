import React, { useState, useContext } from 'react';
import '../pages/style.css'
import { AuthContext } from '../context/AuthContext'; 
import { jwtDecode } from 'jwt-decode';

const UserForm = ({onLoginSuccess}) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(''); // ONLY ADDED THIS LINE

  // Switches between a login or create account page
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(''); // Clear error when switching forms
  };
// Function that'll call the API to login the user and give the token into localStorage which is used for authentication
  const loginFunc = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    try {
      const elements = document.querySelectorAll(`[data-id="loginInfo"]`);
      const dataValues = {};
      for(const elementInput of elements){
          dataValues[elementInput.dataset.field] = elementInput.value;
      }
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: dataValues["loginUsername"],
          password: dataValues["loginPassword"],
        }),
      };
      
      const res = await fetch("http://localhost:8000/api/auth/login", options);
      
      if(res.ok){
        const data = await res.json();

        // FIX: Get actual user data from backend instead of hardcoding
        const userResponse = await fetch("http://localhost:8000/api/users/me", {
          headers: {
            "Authorization": `Bearer ${data.access_token}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          login(userData);
          localStorage.setItem("token", data.access_token);
          
          if (onLoginSuccess){
            onLoginSuccess();
          }
        }
      } else {
        // FIX: Handle login errors
        const errorData = await res.json().catch(() => ({ detail: 'Login failed' }));
        setError(errorData.detail || 'Login failed');
      }
    } catch (error) {
      // FIX: Handle network errors
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    }
  }
  // Function that'll call the API to create the user in the database and then log them in.
  const registerFunc = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    try {
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
            email: dataValues["registerEmail"],
            username: dataValues["registerUsername"],
            full_name: dataValues["registerFullName"],
            password: dataValues["registerPassword"],
        }),
      };
      
      const res = await fetch("http://localhost:8000/api/auth/register", options);
      
      if(res.ok){
        // Auto-login after successful registration
        const loginOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            username: dataValues["registerUsername"],
            password: dataValues["registerPassword"],
          }),
        };
        
        const loginRes = await fetch("http://localhost:8000/api/auth/login", loginOptions);
        
        if(loginRes.ok){
          const data = await loginRes.json();
          const decryptedUserInfo = jwtDecode(data.access_token);

          // FIX: Get actual user data from backend
          const userResponse = await fetch("http://localhost:8000/api/users/me", {
            headers: {
              "Authorization": `Bearer ${data.access_token}`
            }
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            login(userData);
            localStorage.setItem("token", data.access_token);
            
            if (onLoginSuccess){
              onLoginSuccess();
            }
          }
        } else {
          setError('Registration successful but login failed. Please log in manually.');
        }
      } else {
        // FIX: Handle registration errors
        const errorData = await res.json().catch(() => ({ detail: 'Registration failed' }));
        setError(errorData.detail || 'Registration failed');
      }
    } catch (error) {
      // FIX: Handle network errors
      setError('Network error. Please try again.');
      console.error('Registration error:', error);
    }
  }

  return (
    <div className="registerAndLoginForm">
      {/* ONLY ADDED THIS ERROR DISPLAY */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isLogin ? (
        <form onSubmit={loginFunc}>
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
            <button type="button" className="switchRegisterAndLoginForm" onClick={toggleForm}>
              Create new account
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={registerFunc}>
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
            <button type="button" className="switchRegisterAndLoginForm" onClick={toggleForm}>
              Already have an account? Log in
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserForm;