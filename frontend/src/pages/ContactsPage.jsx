import React from 'react';
import './style.css';

const ContactsPage = () => {

  return (
    <div className="registerAndLoginForm">

          <form
          action="mailto:librarymanagementsystem_hotelgroup_csc_131@googlegroups.com?subject=Hotel%20Group%20Contact%20Form" method="POST" encType="text/plain">

          <h1 id="addBookTitle">Contact Us</h1>

          <div className="column">
            <label className="inputName">Name:</label>
            <input required type="text" className="form-control" name="Name" />
          </div> 

          <div className="column">
            <label className="inputName">Email:</label>
            <input required type="email" className="form-control" name="Email" />
          </div> 

          <div className="column">
            <label className="inputName">Phone Number:</label>
            <input required type="text" className="form-control" name="Phone" />
          </div> 

          <label className="inputName">Message:</label>
          <textarea
            required className="textAreaContact form-control message-box" name="Message" rows="4" placeholder="Message here"></textarea>

          <button className="btn btn-primary submitButton" type="submit">
            Submit
          </button>

        </form>

    </div>
  );
};

export default ContactsPage;
