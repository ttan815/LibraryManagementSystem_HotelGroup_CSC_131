import "./LoansList.css";
import React, { useContext, useState, useEffect } from 'react'; 

// for the reservation and loan system, if they want to reserve for in-person reading, make a function that'll delete the reservation and make a new one with the same details, but have it's reservation type to in-person reading, if it's a loan, go ahead and just delete the reservation and create it as a loan
function LoansList() {
  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState({});
  const [books, setBooks] = useState({});
  const [overdueloans, setOverdueLoans] = useState([]);

  const createReservation = async () =>{
    const token = localStorage.getItem("token");
    const elements = document.querySelectorAll("[data-id='addReservationID']");
    const dataValues = {};
    for(const elementInput of elements){
        dataValues[elementInput.dataset.field] = elementInput.value;
    }
    let found = false;
    let selectedBookID = undefined;
    for (const key in books) {
        const book = books[key];
        if (book.title.trim().toLowerCase() === dataValues["book_titles"].trim().toLowerCase() && book.author.trim().toLowerCase() === dataValues["author"].trim().toLowerCase() && book.isbn.trim().toLowerCase() === dataValues["isbn"].trim().toLowerCase()) {
            selectedBookID = book.id;
            found = true;
            break;
        }
    }
    let userIDForReservation = undefined
    for (const id in users) {
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
    if(dataValues["reservation_type"].trim().toLowerCase() != "loan" && dataValues["reservation_type"].trim().toLowerCase() != "in-person reading"){
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
        reservation_type : dataValues["reservationType"],
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

  const loadLoans = async () => {
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
  const loadReservations = async () =>{
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
  const loadUsers = async () =>{
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
 const loadBooks = async () =>{
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
  const loadOverdueLoans = async () =>{
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
  useEffect(()=>{
  loadBooks();
  loadUsers();
  loadLoans();
  loadReservations();
  loadOverdueLoans();
  },[])
  const approveReservation = async (reservationID, book_id) =>{
    const token = localStorage.getItem("token");
    const elements = document.querySelectorAll(`[data-id="${reservationID}"]`);
    const dataValues = {};
    for(const elementInput of elements){
        dataValues[elementInput.dataset.field] = elementInput.value;
    }
    let found = false;
    for (const key in books) {
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
    const body = {
        "book_id" : book_id,
        "due_date" : new Date(dataValues["expiration_date_and_due_date"]).toISOString(),
        "loan_date" : new Date(dataValues["reservation_date"]).toISOString(), 
    };
    console.log(dataValues["reservation_type"]);
    if(dataValues["reservation_type"] == "loan"){
        const res = await fetch("http://localhost:8000/api/loans/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        });
        if(res.ok){
            console.log("successfully updated");
        }
        else{
            alert("Unable to approve, make sure all inputs are valid and book isn't already in-use.")
            return;
        }
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
        }
    }
  }

  const cancelReservation = async (reservation_id) =>{
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

  const approveLoanReturn = async (loan_id, book_id, condition) =>{
    const token = localStorage.getItem("token");
    const elements = document.querySelectorAll(`[data-id="loan${loan_id}"]`);
    const options = {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
        }
    };
    const dataValues = {};
    for(const elementInput of elements){
        dataValues[elementInput.dataset.field] = elementInput.value;
    }
    let found = false;
    for (const key in books) {
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
    const return_date = new Date(dataValues["return_date"]).toISOString()
    const overdue_fee = dataValues["overdue_fee"];
    const res = await fetch(`http://localhost:8000/api/loans/${loan_id}/${return_date}/${book_id}/${overdue_fee}/${condition}/return`,options);
    if(res.ok && !condition){
        alert("Successfully returned book. " + loan_id);
        loadLoans();
    }
    else{
        alert("Successfully deleted loan.");
        loadLoans();
    }
  }

  const approveOverdueLoanReturn = async (loan_id, book_id, overdueFee, condition) =>{
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
    body: JSON.stringify({
        overdue_fee: overdueFee, 
    }),
    };
    for (const key in books) {
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
    const return_date = new Date(dataValues["return_date"]).toISOString()
    const res = await fetch(`http://localhost:8000/api/loans/${loan_id}/${return_date}/${book_id}/${condition}return`,options);
    if(res.ok && !condition){
        alert("Successfully returned book. " + loan_id);
        loadLoans();
    }
    else{
        alert("Successfully deleted  overdue loan.");
        loadLoans();
    }
  }
  return (
    <>
    <div className="loanContainer">
        <h2>Add Reservation</h2>
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
                <tr>
                    {/* Usernames */}
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
        <h2>Reversations</h2>
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
                {reservations && reservations.filter(reservation => reservation.status.trim().toUpperCase() !== "CANCELLED").map((reservationObject) =>(
                    <tr key={reservationObject.id}>
                    {/* Usernames */}
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
                {loans && loans.filter(loan => loan.status.trim().toUpperCase() === "ACTIVE" && loan.overdue_fee === 0.0).map((loanObject) =>(
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
                        <button type="button" onClick={()=>approveLoanReturn(loanObject.id,loanObject.book_id,false)} className="loanButtons">Approve Return</button>
                        <button type="button" onClick={()=>approveLoanReturn(loanObject.id,loanObject.book_id,true)}  className="loanButtons">Decline</button>
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
                {overdueloans && overdueloans.filter(loan => loan.status.trim().toUpperCase() === "ACTIVE" && loan.overdue_fee === 0.0).map((loanObject) =>(
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
                    <td><input defaultValue={loanObject.overdue_fee} data-id={"loan"+loanObject.id} data-field="due_date"></input></td>  
                    {/* Actions */}
                    <td>
                        <button type="button" onClick={()=>approveOverdueLoanReturn(loanObject.id,loanObject.book_id,loanObject.overdue_fee, false)} className="loanButtons">Approve Return</button>
                        <button type="button" className="loanButtons" onClick={()=>approveOverdueLoanReturn(loanObject.id,loanObject.book_id,loanObject.overdue_fee, true)}>Decline</button>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="space"></div>
        {/* Past Loans */}
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
                </tr>
            </thead>
            
            <tbody>
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
