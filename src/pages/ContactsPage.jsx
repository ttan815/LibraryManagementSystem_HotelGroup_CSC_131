import React, { useState, useContext } from 'react';
import '../pages/ContactsPage.css';
const ContactsPage = () => {

  return (
    <div className="registerAndLoginForm">
        <form action="https://formspree.io/f/mblqjwkz" method="POST">
          <h1 id="addBookTitle">Contact Us</h1>
          <div className="column">
            <label className="inputName" htmlFor="name">Name:</label>
            <input required type="text" className="form-control" name="username" />
          </div> 
          <div className="column">
            <label className="inputName" htmlFor="email">Email:</label>
            <input required className="form-control" name="email" />
          </div> 
          <div className="column">
            <label className="inputName" htmlFor="phone_number">Phone Number:</label>
            <input required type="text" className="form-control" name="phone_number" />
          </div> 
            <label className="inputName" htmlFor="message">Message:</label>
            <textarea required className="textAreaContact form-control message-box" name="message" rows="4" placeholder="Message here"></textarea>
          <button className="btn btn-primary submitButton" type="submit">Submit</button>
        </form>
    </div>
  );
};

export default ContactsPage;
