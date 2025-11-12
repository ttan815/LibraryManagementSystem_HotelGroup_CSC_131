import React, { useState, useContext } from 'react';
import './UserForm.css';
import { AuthContext } from '../context/AuthContext'; 
import { jwtDecode } from 'jwt-decode';
const UserForm = ({onLoginSuccess}) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useContext(AuthContext);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    let options;
    const endpoint = isLogin
      ? 'http://localhost:8000/api/auth/login'
      : 'http://localhost:8000/api/auth/register';

    if (isLogin) {
      options = {
        method: 'POST',
        body: new URLSearchParams({
          username: formData.get('username'),
          password: formData.get('password'),
        }),
      };
    } else {
      const body = Object.fromEntries(formData.entries());
      options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      };
    }

    try {
      const response = await fetch(endpoint, options);
      const data = await response.json();

      if (response.ok) {
        console.log('Server response:', data);
        if(isLogin){
            const decoded = jwtDecode(data.access_token);

            const userData = {
                name: decoded.sub, 
                role: 'user', 
            };

            login(userData);
            if (onLoginSuccess){
                onLoginSuccess();
                localStorage.setItem("token", data.access_token);
            }
        }
        else {
            const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            role: 'user',
            };
            login(userData);
            if (onLoginSuccess) onLoginSuccess();
        }
      } else {
        console.error('Error:', data);
        alert(data.detail || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  return (
    <div className="registerAndLoginForm">
      {isLogin ? (
        <form onSubmit={handleSubmit}>
          <h1 id="addBookTitle">Login</h1>
          <div className="column">
            <label className="inputName" htmlFor="username">Username:</label>
            <input required type="text" className="form-control" name="username" />
          </div> 
          <div className="column">
            <label className="inputName" htmlFor="password">Password:</label>
            <input required type="password" className="form-control" name="password" />
          </div> 
          <button className="btn btn-primary submitButton" type="submit">Login</button>
          <div className="switchFormContainer">
            <button 
              type="button"
              className="switchRegisterAndLoginForm"
              onClick={toggleForm}
            >
              Create new account
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1 id="addBookTitle">Register</h1>
          <div className="column">
            <label className="inputName" htmlFor="email">Email:</label>
            <input required type="email" className="form-control" name="email" />
          </div> 
          <div className="column">
            <label className="inputName" htmlFor="username">Username:</label>
            <input required type="text" className="form-control" name="username" />
          </div> 
          <div className="column">
            <label className="inputName" htmlFor="full_name">Full Name:</label>
            <input required type="text" className="form-control" name="full_name" />
          </div> 
          <div className="column">
            <label className="inputName" htmlFor="password">Password:</label>
            <input required type="password" className="form-control" name="password" />
          </div> 
          <button className="btn btn-primary submitButton" type="submit">Register</button>
          <div className="switchFormContainer">
            <button 
              type="button"
              className="switchRegisterAndLoginForm"
              onClick={toggleForm}
            >
              Already have an account? Log in
            </button>
          </div>
        </form>
      )}

      
    </div>
  );
};

export default UserForm;
