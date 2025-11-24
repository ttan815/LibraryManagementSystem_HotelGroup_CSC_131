import "../pages/style.css";
import React, { useContext, useState, useEffect } from 'react'; 

function LoansList() {
  const [loans, setLoans] = useState([]); // Default empty array to prevent errors in .map while waiting for data to be fetched, setLoans is used to set the data within loans of type array
  const [reservations, setReservations] = useState([]); // Default empty array to prevent errors in .map while waiting for data to be fetched, setReservations is used to set the data within loans of type array
  const [overdueloans, setOverdueLoans] = useState([]);
  // Default empty array to prevent errors in .map while waiting for data to be fetched, setOverdueLoans is used to set the data within loans of type array
  const [users, setUsers] = useState({});  // Users is a object, also known as a hashmap, that holds the user ID as the key which allows fast indexing into that info for that key. setUsers sets the key-value pairs for users.
    // Here is what a sample dataset for what users looks like.
    //   users = {
    //   0: {
    //     email: "user@example.com",
    //     username: "string",
    //     full_name: "string",
    //     id: 0,
    //     role: "user",
    //     is_active: true,
    //     membership_dues: 0,
    //     created_at: "2025-11-13T23:25:41.844Z"
    //   }
    // }
  const [books, setBooks] = useState({}); // Books is an object, also known as a hashmap/dictionary, that holds the book ID as the key which allows fast indexing into that info for that key. setBooks sets the key-value pairs for books.
    // Here is what a sample dataset for what books looks like.
    // books = {
    //   0: {
    //     title: "string",
    //     author: "string",
    //     isbn: "string",
    //     publisher: "string",
    //     publication_year: 0,
    //     category: "string",
    //     description: "string",
    //     id: 0,
    //     total_copies: 0,
    //     available_copies: 0,
    //     created_at: "2025-11-13T23:25:20.458Z"
    //   }
    // }

  const createReservation = async () =>{ // Function that will take inputs from those with data-id='addReservationID' in them, and validation logic for the book, user, and reservation type to make sure the input is allowed before creating the reservation.
    const token = localStorage.getItem("token"); // Token that will have the user's information, more importantly, their role which dictate if these GET, POST, PUT, DELETE methods will go through.
    const elements = document.querySelectorAll("[data-id='addReservationID']"); // gets all inputs from those input elements with data-id='addReservationID' as an array.
    const dataValues = {}; // dataValues is an object, also known as a hashmap/dictionary that will hold key-value pairs
    for(const elementInput of elements){
        dataValues[elementInput.dataset.field] = elementInput.value;
    }
    // Here is a sample dataset for what dataValues looks like
    // {
    //   "username": "tony",
    //   "book_titles": "Hunger Games",
    //   "author": "Bob",
    //   "isbn": "1234567890",
    //   "reservation_date": "2025-11-13",
    //   "expiration_date_and_due_date": "2025-11-27",
    //   "reservation_type": "loan"
    // }

    let found = false; // validator to ensure the book wanting to be reserved exists in the database of books, which is held in books.
    let selectedBookID = undefined; // Holds the book ID if it has been found

    for (const key in books) { // iterates through each book key-value pair and compares the info the info inputted by the user to validate if it exists before breaking out, or else found stays false and the user is informed the book inputted isn't valid.
        const book = books[key];
        if (book.title.trim().toLowerCase() === dataValues["book_titles"].trim().toLowerCase() && book.author.trim().toLowerCase() === dataValues["author"].trim().toLowerCase() && book.isbn.trim().toLowerCase() === dataValues["isbn"].trim().toLowerCase()) {
            selectedBookID = book.id;
            found = true;
            break;
        }
    }
    let userIDForReservation = undefined // Holds the user ID if it has been found
    for (const id in users) { // iterates through each book key-value pair and compares the info the info inputted by the user to validate if that user exists, or else it'll stay false and the user is informed the inputted username does not exist.
        if(users[id].username == dataValues["username"].trim()){
            userIDForReservation = id;
        }
    }
    if(userIDForReservation == undefined){
        alert("No user found matching that username.");
        return;
    }
    if (!found) {
        alert("No book found matching your specifications (title or author or isbn). " + dataValues["book_titles"]);
        return;
    }
    if(dataValues["reservation_type"].trim().toLowerCase() != "loan" && dataValues["reservation_type"].trim().toLowerCase() != "in-person reading"){  // validates if the selected reservation type is "loan" or "in-person reading" or else it'll stop the process and inform the user of the error in input.
        console.log("Compared: "+ dataValues["reservation_type"])
        alert("Reservation type can only be 'loan' or 'in-person reading'.");
        return;
    }
    const options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
        book_id : selectedBookID,
        reservation_date: dataValues["reservation_date"],
        reservation_type : dataValues["reservation_type"],
        expiry_date : dataValues["expiration_date_and_due_date"],
        user_id : userIDForReservation,

    }),
    };
    const res = await fetch("http://localhost:8000/api/reservations/",options);
    if(res.ok){
        loadReservations();
    }
    else{
        alert("An error occured trying to add a reservation. Please try again later.")
    }

  }

  const loadLoans = async () => { // Function that will load in the loans currently in the database
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/loans/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if(res.ok){
        const allLoans = await res.json();
        console.log("Our loans: " + allLoans[0]);
        setLoans(allLoans);
    }
  };
  const loadReservations = async () =>{ // Function that will load the reservations currently in the database
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/reservations/",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if(res.ok){
        const allReservations = await res.json();
        console.log("Our reservations: " + allReservations[0])
        setReservations(allReservations);
    }
  }
  const loadUsers = async () =>{ // Function that will load the users, but makes it as a hashmap, which allows ID's to be indexed easily later to get the user info associated with it.
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/admin/users",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    if(res.ok){
        const allUserHashMap = {}
        const allUsers = await res.json();
        for(const user of allUsers){
            if(!allUserHashMap[user.id]){
                allUserHashMap[user.id] = user;
            }
        }
        setUsers(allUserHashMap);
    }
  }
 const loadBooks = async () =>{ // Function to load the books, but makes it as a hashmap, which allows the book IDs to be indexed easily later to get the book info associated with it.
    const res = await fetch("http://localhost:8000/api/books/",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if(res.ok){
        const allBooksHashMap = {}
        const allBooks = await res.json();
        for(const book of allBooks){
            if(!allBooksHashMap[book.id]){
                allBooksHashMap[book.id] = book;
            }
        }
        setBooks(allBooksHashMap);
    }
  }
  const loadOverdueLoans = async () =>{ // Function to load the over due loans (loans with an overdue_fee value > 0.0)
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/admin/loans/overdue",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    if(res.ok){
        const allOverdueLoans = await res.json();
        setOverdueLoans(allOverdueLoans);
    }
  }
  useEffect(()=>{ // useEffect, which will automatically load all the data for books, users, loans, reservations, and overdueloans on refresh/loading of the page
  loadBooks();
  loadUsers();
  loadLoans();
  loadReservations();
  loadOverdueLoans();
  },[])
  const approveReservation = async (reservationID, book_id) =>{ // Function that will take the inputs from the field for the reservation and passed in parameters to approve the reervation
    const token = localStorage.getItem("token"); // token that is used to authorize usage to admins only
    const elements = document.querySelectorAll(`[data-id="${reservationID}"]`); // gets all the input values that share the data-id of the reservationID (tagged with the reservation row)
    const dataValues = {}; // gets all the values as a object, also known as a hashmap/dictionary that will allow easy access to the values from the reservation input fields by key-value pairs

    for(const elementInput of elements){
        dataValues[elementInput.dataset.field] = elementInput.value;
    }
    //Example data of dataValues after making the key-value pairs
    // Example of the dataValues:
    // {
    //   username: "tony",
    //   book_titles: "Hunger Games",
    //   author: "Bob",
    //   isbn: "123",
    //   reservation_date: "2025-11-13",
    //   expiration_date_and_due_date: "2025-11-27",
    //   reservation_type: "loan"
    // }
    let found = false;
    for (const key in books) { // Validator to see if the book exists before allowing users to add the modification to the reservation
        const book = books[key];
        if (book.title.trim().toLowerCase() === dataValues["book_titles"].trim().toLowerCase() && book.author.trim().toLowerCase() === dataValues["author"].trim().toLowerCase() && book.isbn.trim().toLowerCase() === dataValues["isbn"].trim().toLowerCase()) {
            book_id = book.id;
            found = true;
            break;
        }
    }
    if (!found) {
        alert("No book found matching your specifications (title or author or isbn). " + dataValues["book_titles"]);
        return;
    }
    const body = { // Construct the book that will be sent as a POST with the reservation
        "book_id" : book_id,
        "due_date" : new Date(dataValues["expiration_date_and_due_date"]).toISOString(),
        "loan_date" : new Date(dataValues["reservation_date"]).toISOString(), 
    };
    console.log(dataValues["reservation_type"]);
    if(dataValues["reservation_type"] == "loan" || dataValues["reservation_type"] == "in-person reading"){
        const res = await fetch("http://localhost:8000/api/loans/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        });
        if(res.ok){
            alert("Successfully approved reservation")
        }
        else{
            alert("Unable to approve, make sure all inputs are valid and book isn't already in-use.")
            return;
        }
        // Once the reservation is approved to be a loan, we cancel the reservation.
        const cancelReservationRes = await fetch(`http://localhost:8000/api/reservations/${reservationID}/cancel`,
        {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        }
        );
        if(cancelReservationRes.ok){
            console.log("Successfully deleted reservation.");
            loadReservations();
            loadLoans();
            loadOverdueLoans();
        }
    }
    else{
        alert("Valid options for reservation type: loan or in-person reading")
    }
  }

  const cancelReservation = async (reservation_id) =>{ // If the user decides to decline the reservation, this option allows for that
    const token = localStorage.getItem("token");
    const options = {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
        }
    };
    const res = await fetch(`http://localhost:8000/api/reservations/${reservation_id}/cancel`,options)
    console.log("Our Res: " + res.ok);
    if(res.ok){
        alert("Successfully canceled reservation.");
        loadReservations();
    }
  }

  const approveLoanReturn = async (loan_id, book_id, condition) =>{ // Function that will approve the loan, meaning the user paid it off and will take it off their account.
    const token = localStorage.getItem("token");
    const elements = document.querySelectorAll(`[data-id="loan${loan_id}"]`);
    const options = {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
        }
    };
    const dataValues = {}; // Hashmap that will store key-value pairs from the loan inputs of the specify loan_id
    for(const elementInput of elements){
        dataValues[elementInput.dataset.field] = elementInput.value;
    }
    // Sample of what the dataValues look like:
    // {
    //   username: "tony",
    //   book_titles: "Hunger Games",
    //   author: "Suzanne Collins",
    //   isbn: "1234567890",
    //   loan_date: "2025-11-01T12:00:00.000Z",
    //   due_date: "2025-11-15T12:00:00.000Z",
    //   return_date: "2025-11-20T12:00:00.000Z",
    //   overdue_fee: "0.00"
    // }
    let found = false;
    for (const key in books) { // Validator that will check if the book actually exists based on what the user modified for the book's values (title, author, isbn)
        const book = books[key];
        if (book.title.trim().toLowerCase() === dataValues["book_titles"].trim().toLowerCase() && book.author.trim().toLowerCase() === dataValues["author"].trim().toLowerCase() && book.isbn.trim().toLowerCase() === dataValues["isbn"].trim().toLowerCase()) {
            book_id = book.id;
            found = true;
            break;
        }
    }
    if (!found) {
        alert("No book found matching your specifications (title or author or isbn). ");
        return;
    }
    const loan_date = new Date(dataValues["loan_date"]).toISOString()
    const due_date = new Date(dataValues["due_date"]).toISOString()
    const return_date = new Date(dataValues["return_date"]).toISOString()
    const overdue_fee = dataValues["overdue_fee"];
    if(condition == true){
        options.body = JSON.stringify({
        loan_date: loan_date,
        due_date: due_date,
        return_date: return_date,
        overdue_fee: overdue_fee,
        });
        const res = await fetch(`http://localhost:8000/api/loans/${loan_id}/return`,options);
        if(res.ok){
            alert("Successfully returned book. " + loan_id);
        }
        else{
            alert("Error returning the book.")
        }
        loadLoans();
    }
    else{
        const res = await fetch(`http://localhost:8000/api/loans/${loan_id}/cancel`, options);
        if(res.ok){
            alert("Successfully deleted loan.");
        }
        else{
            alert("Error deleting the loan. " + loan_id)
        }
        loadLoans();
    }
  }

  const approveOverdueLoanReturn = async (loan_id, book_id, condition) =>{ // Function that will approve the loan and take it off the person's account
    const token = localStorage.getItem("token");
    const elements = document.querySelectorAll(`[data-id="loan${loan_id}"]`);
    const dataValues = {};
    for(const elementInput of elements){
        dataValues[elementInput.dataset.field] = elementInput.value;
    }
    let found = false;
    const options = {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    };
    for (const key in books) { // Validator to make sure that the book modified by the user exists (or else it'll just stop and not go past the conditional statement for boolean value of found)
        const book = books[key];
        if (book.title.trim().toLowerCase() === dataValues["book_titles"].trim().toLowerCase() && book.author.trim().toLowerCase() === dataValues["author"].trim().toLowerCase() && book.isbn.trim().toLowerCase() === dataValues["isbn"].trim().toLowerCase()) {
            book_id = book.id;
            found = true;
            break;
        }
    }
    if (!found) {
        alert("No book found matching your specifications (title or author or isbn). ");
        return;
    }
    const loan_date = new Date(dataValues["loan_date"]).toISOString()
    const due_date = new Date(dataValues["due_date"]).toISOString()
    const return_date = new Date(dataValues["return_date"]).toISOString()
    const overdue_fee = dataValues["overdue_fee"];
    if(condition == true){
        options.body = JSON.stringify({
        loan_date: loan_date,
        due_date: due_date,
        return_date: return_date,
        overdue_fee: overdue_fee,
        });
        const res = await fetch(`http://localhost:8000/api/loans/${loan_id}/return`,options);
        if(res.ok){
            alert("Successfully returned over-due book. " + loan_id);
        }
        else{
            alert("Error returning the over-due book.")
        }
        loadLoans();
        loadOverdueLoans();
    }
    else{
        const res = await fetch(`http://localhost:8000/api/loans/${loan_id}/cancel`, options);
        if(res.ok){
            alert("Successfully deleted loan.");
        }
        else{
            alert("Error deleting the loan. " + loan_id)
        }
        loadLoans();
        loadOverdueLoans();
    }
  }

  const now = new Date();
  return (
    <>
    <div className="loanContainer">
        <h2>Add Reservation</h2>
        <table className="loanAdminTable">
            <thead className="loanAdminTHead">
                <tr>
                    <th>Username</th>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Reservation Date</th>
                    <th>Expiration Date & Due Date</th>
                    <th>Reservation Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            
            <tbody>
                <tr>
                    {/* Usernames */}
                    {/* Note that the data-id are what's targetted by document.querySelectorAll in order to get the values for that specific row of reservations/loans/overdue_loans, etc. While the data-field is what's used as essentially the way to access what type of data is at this data-id */}
                    <td>
                        <input data-id="addReservationID" className="inputStyle" data-field="username"></input>
                    </td>
                    {/* Book Titles */}
                    <td> 
                        <input data-id="addReservationID" data-field="book_titles"></input>
                    </td>
                    {/* Author */}
                    <td>
                        <input data-id="addReservationID" data-field="author"></input>
                    </td>
                    {/* ISBN */}
                    <td>
                        <input data-id="addReservationID" data-field="isbn"></input>
                    </td>
                    {/* Reservation Date */}
                    <td>
                        <input data-id="addReservationID" data-field="reservation_date"></input>
                    </td>  
                    {/* Expiration Date */}
                    <td>
                        <input data-id="addReservationID" data-field="expiration_date_and_due_date"></input>
                    </td>  
                    {/* Reservation Type */}
                    <td>
                        <input data-id="addReservationID" data-field="reservation_type"></input>
                    </td>  
                    {/* Actions */}
                    <td>
                        <button type="button" onClick={()=>createReservation()} className="loanButtons">Add Reservation</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div className="space"></div>
        <h2>Reservations</h2>
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Reservation Date</th>
                    <th>Expiration Date & Due Date</th>
                    <th>Reservation Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            
            <tbody>
                {/* Filters for all reservations currently present in the database that aren't of status CANCELLED */}
                {reservations && reservations.filter(reservation => reservation.status.trim().toUpperCase() !== "CANCELLED").map((reservationObject) =>(
                    <tr key={reservationObject.id}>
                    {/* Usernames */}
                    {/* Following alongside many filters below, we have ternary operators to make sure that an actual reservation exists for that specific info */}
                    <td>{users[reservationObject.user_id] ? <input className="inputStyle" data-id={reservationObject.id} data-field="username" defaultValue={users[reservationObject.user_id].username}></input> : "Loading"}
                    </td>
                    {/* Book Titles */}
                    <td>{books[reservationObject.book_id] ? <input defaultValue={books[reservationObject.book_id].title} data-id={reservationObject.id} data-field="book_titles"></input> : "Loading..."}
                    </td>
                    {/* Author */}
                    <td>{books[reservationObject.book_id] ? <input defaultValue={books[reservationObject.book_id].author} data-id={reservationObject.id} data-field="author"></input> : "Loading..."}
                    </td>
                    {/* ISBN */}
                    <td>{books[reservationObject.book_id] ? <input defaultValue={books[reservationObject.book_id].isbn} data-id={reservationObject.id} data-field="isbn"></input> : "Loading..."}
                    </td>
                    {/* Reservation Date */}
                    <td><input defaultValue={reservationObject.reservation_date} data-id={reservationObject.id} data-field="reservation_date"></input></td>  
                    {/* Expiration Date */}
                    <td><input defaultValue={reservationObject.expiry_date} data-id={reservationObject.id} data-field="expiration_date_and_due_date"></input></td>  
                    {/* Reservation Type */}
                    <td><input defaultValue={reservationObject.reservation_type} data-id={reservationObject.id} data-field="reservation_type"></input></td>  
                    {/* Actions */}
                    <td>
                        <button type="button" onClick={()=>approveReservation(reservationObject.id, reservationObject.book_id)} className="loanButtons">Approve</button>
                        <button type="button" onClick={()=>cancelReservation(reservationObject.id)} className="loanButtons">Decline</button>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="space"></div>
        {/* Loans */}
        <h2>Loans</h2>
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Loan Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Overdue Fees</th>
                    <th>Actions</th>
                </tr>
            </thead>
    
            <tbody>
                {/* Filters for loans that are currently of status "ACTIVE" and have no overdue_fee since that's a separate category */}
                {loans && loans
                .filter(loan => loan.status.trim().toUpperCase() === "ACTIVE" && loan.overdue_fee === 0.0 && new Date(loan.due_date) >= now).map
                    ((loanObject) => (
                    <tr key={loanObject.id}>
                    {/* Usernames */}
                    <td>{users[loanObject.user_id] ? <input className="inputStyle" data-id={"loan"+loanObject.id} data-field="username" defaultValue={users[loanObject.user_id].username}></input> : "Loading"}
                    </td>
                    {/* Book Titles */}
                    <td>{books[loanObject.book_id] ? <input defaultValue={books[loanObject.book_id].title} data-id={"loan"+loanObject.id} data-field="book_titles"></input> : "Loading..."}
                    </td>
                    {/* Author */}
                    <td>{books[loanObject.book_id] ? <input defaultValue={books[loanObject.book_id].author} data-id={"loan"+loanObject.id} data-field="author"></input> : "Loading..."}
                    </td>
                    {/* ISBN */}
                    <td>{books[loanObject.book_id] ? <input defaultValue={books[loanObject.book_id].isbn} data-id={"loan"+loanObject.id} data-field="isbn"></input> : "Loading..."}
                    </td>
                    {/* Loan Date */}
                    <td><input defaultValue={loanObject.loan_date} data-id={"loan"+loanObject.id} data-field="loan_date"></input></td>  
                    {/* Due Date */}
                    <td><input defaultValue={loanObject.due_date} data-id={"loan"+loanObject.id} data-field="due_date"></input></td>  
                    {/* Return Date */}
                    <td><input defaultValue={new Date().toISOString()} data-id={"loan"+loanObject.id} data-field="return_date"></input></td>  
                    {/* Overdue Fee */}
                    <td><input defaultValue={loanObject.overdue_fee} data-id={"loan"+loanObject.id} data-field="overdue_fee"></input></td>  
                    {/* Actions */}
                    <td>
                        <button type="button" onClick={()=>approveLoanReturn(loanObject.id,loanObject.book_id,true)} className="loanButtons">Approve Return</button>
                        <button type="button" onClick={()=>approveLoanReturn(loanObject.id,loanObject.book_id,false)}  className="loanButtons">Decline</button>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="space"></div>
        <h2>Overdue Loans</h2>
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Loan Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Overdue fee</th>
                    <th>Actions</th>
                </tr>
            </thead>
            
            <tbody>
                {/* Filters for overdue loans, which are loans that have the datafield for an overdue due to the date where it's supposed to be returned isn't done */}
                {overdueloans && overdueloans.filter(loan => loan.status.trim().toUpperCase() === "ACTIVE").map((loanObject) =>(
                    <tr key={loanObject.id}>
                    {/* Usernames */}
                    <td>{users[loanObject.user_id] ? <input className="inputStyle" data-id={"loan"+loanObject.id} data-field="username" defaultValue={users[loanObject.user_id].username}></input> : "Loading"}
                    </td>
                    {/* Book Titles */}
                    <td>{books[loanObject.book_id] ? <input defaultValue={books[loanObject.book_id].title} data-id={"loan"+loanObject.id} data-field="book_titles"></input> : "Loading..."}
                    </td>
                    {/* Author */}
                    <td>{books[loanObject.book_id] ? <input defaultValue={books[loanObject.book_id].author} data-id={"loan"+loanObject.id} data-field="author"></input> : "Loading..."}
                    </td>
                    {/* ISBN */}
                    <td>{books[loanObject.book_id] ? <input defaultValue={books[loanObject.book_id].isbn} data-id={"loan"+loanObject.id} data-field="isbn"></input> : "Loading..."}
                    </td>
                    {/* Loan Date */}
                    <td><input defaultValue={loanObject.loan_date} data-id={"loan"+loanObject.id} data-field="loan_date"></input></td>  
                    {/* Due Date */}    
                    <td><input defaultValue={loanObject.due_date} data-id={"loan"+loanObject.id} data-field="due_date"></input></td>  
                    {/* Return Date */}
                    <td><input defaultValue={new Date().toISOString()} data-id={"loan"+loanObject.id} data-field="return_date"></input></td>  
                    {/* Overdue Fee */}
                    <td><input defaultValue={loanObject.overdue_fee} data-id={"loan"+loanObject.id} data-field="overdue_fee"></input></td>

                    {/* Actions */}
                    <td>
                        <button type="button" onClick={()=>approveOverdueLoanReturn(loanObject.id,loanObject.book_id,loanObject.overdue_fee, true)} className="loanButtons">Approve Return</button>
                        <button type="button" className="loanButtons" onClick={()=>approveOverdueLoanReturn(loanObject.id,loanObject.book_id,loanObject.overdue_fee, false)}>Decline</button>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="space"></div>
        {/* Past Loans */}
        <h2>History of Loans</h2>
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Loan Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Overdue Fees</th>
                </tr>
            </thead>
            
            <tbody>
                {/* Filters all loans that have a status of RETURNED for the user to view */}
                {loans && loans.filter(loan => loan.status.trim().toUpperCase() === "RETURNED").map((loanObject) =>(
                    <tr key={loanObject.id}>
                    {/* Usernames */}
                    <td>{users[loanObject.user_id] ? <input readOnly className="inputStyle" data-id={"loan"+loanObject.id} data-field="username" defaultValue={users[loanObject.user_id].username}></input> : "Loading"}
                    </td>
                    {/* Book Titles */}
                    <td>{books[loanObject.book_id] ? <input readOnly defaultValue={books[loanObject.book_id].title} data-id={"loan"+loanObject.id} data-field="book_titles"></input> : "Loading..."}
                    </td>
                    {/* Author */}
                    <td>{books[loanObject.book_id] ? <input readOnly defaultValue={books[loanObject.book_id].author} data-id={"loan"+loanObject.id} data-field="author"></input> : "Loading..."}
                    </td>
                    {/* ISBN */}
                    <td>{books[loanObject.book_id] ? <input readOnly defaultValue={books[loanObject.book_id].isbn} data-id={"loan"+loanObject.id} data-field="isbn"></input> : "Loading..."}
                    </td>
                    {/* Loan Date */}
                    <td><input readOnly defaultValue={loanObject.loan_date} data-id={"loan"+loanObject.id} data-field="loan_date"></input></td>  
                    {/* Due Date */}
                    
                    <td><input readOnly defaultValue={loanObject.due_date} data-id={"loan"+loanObject.id} data-field="due_date"></input></td>  
                    {/* Return Date */}
                    <td><input readOnly defaultValue={new Date().toISOString()} data-id={"loan"+loanObject.id} data-field="return_date"></input></td>  
                    {/* Overdue Fee */}
                    <td><input readOnly defaultValue={loanObject.overdue_fee} data-id={"loan"+loanObject.id} data-field="overdue_fee"></input></td>  
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    </>
  );
}

export default LoansList;