import React, { useContext, useState, useEffect } from 'react'; 
import "./BookForm.css"
function BookForm() {
  const [books, setBooks] = useState([]);
  const createBook = async (e) => {
    e.preventDefault(); // stops reloading to main page
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/users/me",{
      headers:{
        "Authorization": `Bearer ${token}`
      }
    });
    const userInfo = await res.json();
    console.log(userInfo.role)
    if(userInfo.role != 'admin'){
      alert("Insufficient permissions to create book")
    }
    else{
      const formData = new FormData(e.target)
      const body = {
        "title" : formData.get('bookTitle'),
        "author" : formData.get('author'),
        "isbn" : formData.get('ISBN')
      }
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(body),
      };
      const status = await fetch("http://localhost:8000/api/admin/books", options)
      if(status.ok){
        alert("Successfully created: " + formData.get('bookTitle') + " Authored By: " + formData.get('author'));
      }
      else{
        alert("Error: Book already exists/input error");
      }
    }
  }

  const updateBook = async (e) =>{
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/books/")
    let found = false;
    const allBooks = await res.json();
    const formData = new FormData(e.target)
    let bookID = null;
    for(let i = 0; i < allBooks.length; i++){
      if(formData.get("oldBookTitle") == allBooks[i]["title"] && formData.get("oldAuthor") == allBooks[i]["author"] &&     formData.get("oldISBN") == allBooks[i]["isbn"]){
        bookID = allBooks[i]["id"];
        found = true;
        break;
      }
    }
    if(!found){
          alert("Unable to find a book with book title: " + formData.get("newBookTitle") + " author: " + formData.get("newAuthor") + " ISBN: " + formData.get("newISBN"))
    }
    else{
        const body = {
          title: formData.get("newBookTitle"),
          author: formData.get("newAuthor"),
          isbn: formData.get("newISBN"),
        };
        const options = {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
            },
            body: JSON.stringify(body),
        };
        const status = await fetch(`http://localhost:8000/api/admin/books/${bookID}`, options)
        if(status.ok){
          alert("Successfully updated the book")
        }
        else{
          alert("Unsuccessful in updating the book with book title: " + formData.get("newBookTitle") + " author: " + formData.get("newAuthor") + " ISBN: " + formData.get("newISBN"))
        }
    }
  }
  const deleteBook = async (e) =>{
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/books/")
    let found = false;
    const allBooks = await res.json();
    const formData = new FormData(e.target)
    let bookID = null;
    for(let i = 0; i < allBooks.length; i++){
      if(formData.get("bookTitle") == allBooks[i]["title"] && formData.get("author") == allBooks[i]["author"] &&     formData.get("ISBN") == allBooks[i]["isbn"]){
        bookID = allBooks[i]["id"];
        found = true;
        break;
      }
    }
    if(!found){
        alert("Unable to find a book called: " + formData.get("newBookTitle") + " By: " + formData.get("newAuthor"));
    }
    else{
          const options = {
              method: "DELETE",
              headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
              }
          };
          const status = await fetch(`http://localhost:8000/api/admin/books/${bookID}`, options);
          if(status.ok){
            alert("Successfully deleted the book with book title: " + formData.get("bookTitle") + " author: " + formData.get("author") + " ISBN: " + formData.get("ISBN"))
          }
          else{
            alert("Unsuccessfuly in deleting the book with book title: " + formData.get("bookTitle") + " author: " + formData.get("author") + " ISBN: " + formData.get("ISBN"))
          }
    }
  }

  async function fetchBooks() {
    const res = await fetch("http://localhost:8000/api/books/");
    const data = await res.json();
    setBooks(data);
  }

  useEffect(()=>{
    fetchBooks();
  },[])
  return (
    <>
    <div className="addAndEditBookForm">
        <form onSubmit={createBook}>
            <h1 id="addBookTitle">Add Book</h1>
            <div className="column">
              <label className="inputName" for="bookTitle" htmlFor="bookTitle">Book Title:</label>
              <input required type="text" className="form-control" name="bookTitle"></input>    
            </div> 
            <div className="column">
              <label className="inputName" for="author" htmlFor="author">Author:</label>
              <input required type="text" className="form-control" name="author"></input>    
            </div> 
            <div className="column">
              <label className="inputName" for="ISBN" htmlFor="ISBN">ISBN:</label>
              <input required type="text" className="form-control" name="ISBN"></input>    
            </div> 
            <button className="btn btn-primary submitButton" type="submit">Add Book</button>
        </form>
        <form onSubmit={updateBook}>
            <h1 id="addBookTitle">Update Book</h1>
            <div className="column">
              <label className="inputName" for="oldBookTitle">Old Book Title:</label>
              <input required type="text" className="form-control" name="oldBookTitle"></input>    
            </div> 
            <div className="column">
              <label className="inputName" for="oldAuthor">Old Author:</label>
              <input required type="text" className="form-control" name="oldAuthor"></input>    
            </div> 
            <div className="column">
              <label className="inputName" for="oldISBN">Old ISBN:</label>
              <input required type="text" className="form-control" name="oldISBN"></input>    
            </div> 
            <div className="column">
              <label className="inputName" for="newBookTitle">New Book Title:</label>
              <input required type="text" className="form-control" name="newBookTitle"></input>    
            </div> 
            <div className="column">
              <label className="inputName" for="newAuthor">New Author:</label>
              <input required type="text" className="form-control" name="newAuthor"></input>    
            </div> 
            <div className="column">
              <label className="inputName" for="newISBN">New ISBN:</label>
              <input required type="text" className="form-control" name="newISBN"></input>    
            </div> 
            <button className="btn btn-primary submitButton" type="submit">Submit Changes</button>
        </form>
        <form onSubmit={deleteBook}>
            <h1 id="addBookTitle">Delete Book</h1>
            <div className="column">
              <label className="inputName" for="bookTitle" htmlFor="bookTitle">Book Title:</label>
              <input required type="text" className="form-control" name="bookTitle"></input>    
            </div> 
            <div className="column">
              <label className="inputName" for="author" htmlFor="author">Author:</label>
              <input required type="text" className="form-control" name="author"></input>    
            </div> 
            <div className="column">
              <label className="inputName" for="ISBN" htmlFor="ISBN">ISBN:</label>
              <input required type="text" className="form-control" name="ISBN"></input>    
            </div> 
            <button className="btn btn-primary submitButton" type="submit">Delete Book</button>
        </form>

      <h2>All Books</h2>
        <table>
            <thead>
                <tr>
                    <th>Book ID</th>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                </tr>
            </thead>
            
            <tbody>
                {books && books.map((bookObject) =>(
                    <tr key={bookObject.id}>
                      {/* Book ID */}
                      <td>
                          {bookObject.id}
                      </td>
                      {/* Book Titles */}
                      <td>
                          {bookObject.title}
                      </td>
                      {/* Author */}
                      <td>
                          {bookObject.author}
                      </td>
                      <td>
                          {bookObject.isbn}
                      </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    </>
  );
}

export default BookForm;
