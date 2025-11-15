import React, { useContext, useState, useEffect } from 'react'; 
import './BookSearch.css'

function BookSearch() {
/**
 * BookSearch.jsx
 * -----------------------------------------------------------
 * Component: BookSearch
 * Author: Tony Tan
 * Course: CSC-131-05 Software Engineering
 * Project: Library Management System
 *
 */
  const [inputValue, setInputValue] = useState(''); // User's input as well as a setter function to update inputValue
  const [query, setQuery] = useState('');  // What will be used as the input to search for as well as a setter function update query
  const [bookLibrary, setBooks] = useState([]); // The books from the database stored in an array (bookLibrary) and a setter function to define books in the array
  const [wishlists, setWishlists] = useState([]); // Books wishlisted by the user stored in wishLists and a setter function to set books for wishlist in the array
  const [currentUser, setCurrentUser] = useState(null); // gets the user for the website currently as currentUser, with setCurrentUuser to initialize currentUser as whoeerver is using it (by their ID)

  const handleSearch = () => { // Function for search button, set's the users input for querying in the database
    setQuery(inputValue);
  };


  const addToWishlist = async (bookID) => { // Function that will add the book's ID to the wishlist database once the user clicks on "Wishlist Book"
    const token = localStorage.getItem("token");
    const body = {
      book_id: bookID,
    };
    const res = await fetch("http://localhost:8000/api/users/me/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if(res.ok){ // If the call to POST the bookID as a wishlisted book is successful, update the current wishlist and update buttons (Wishlist book --> Remove Book from Wishlist)
      const updatedWishlist = await fetch("http://localhost:8000/api/users/me/wishlist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
      const updatedData = await updatedWishlist.json();
      setWishlists(updatedData);
    }
    else{
      console.log("Unsuccessful in wishlisting the book.");
    }
  };

  const removeFromWishList = async (bookID) => { // Function that will remove the book associated with the bookID from the wishlist database once the user clicks on "Remove Book from Wishlist"
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/users/me/wishlist/${bookID}`,{
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    if(res.ok){ // If the call to DELETE the wishlisted book associated with the bookID is successful, update the current wishlist and update buttons (Remove Book from Wishlist --> Wishlist Book)
      alert("Successfully removed from your wishlist.");

      const updatedWishlist = await fetch("http://localhost:8000/api/users/me/wishlist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
      const updatedData = await updatedWishlist.json();
      setWishlists(updatedData);

    }
    else{
      alert("Error removing from your wishlist.")
    }
  };

  async function fetchBooks() { // function to retrieves all books from the database and return as a JSON
    const res = await fetch("http://localhost:8000/api/books/");
    return await res.json();
  }

  useEffect(()=>{ // calls all functions within once every time this component is loaded up
    const loadUsersReservationsAndWishlists = async () =>{ // Attempts to sets the variables of currentUser and wishlists
      try{
        const token = localStorage.getItem("token");
        const userRes = await fetch("http://localhost:8000/api/users/me", {
          headers:{
            Authorization: `Bearer ${token}`,
          }
        });
        const user = await userRes.json();
        setCurrentUser(user.id)
        const wishlistRes = await fetch("http://localhost:8000/api/users/me/wishlist",{
          headers:{
            Authorization: `Bearer ${token}`,
          }
        });
        const wishlistsFound = await wishlistRes.json();
        setWishlists(wishlistsFound);
      }
      catch(error){
        console.error("Error fetching user/wishlists ", error);
      }
    }
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data); // save to context
        console.log("Fetched books:", data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    loadUsersReservationsAndWishlists();
    loadBooks();
  }, [])

  if (!currentUser) { // For wishlist functionality, user must be logged in, ternary operation that shows "Please log in to view and reserve book if currentUser isn't defined"
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Please log in to view and reserve books.</h2>;
  }
  return (
    <>
      <div id="searchInput">
        <h1>LibraryMS Search</h1>

        <div id="searchBar">
          <input
            type="text"
            id="searchBookInput"
            name="searchbook"
            placeholder="Search For Books" 
            className="input-group"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button id="searchBookButton" className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

<div id="searchContent">
  {bookLibrary && bookLibrary.map(book => //
    book.title.toLowerCase().includes(query.toLowerCase()) ? ( // .map goes through the array of JSON objects and filters the books shown to display only books that contain data stated in query
      <div className='bookContainer' key={book.id}>
        <div className='bookInfo'>
          <h3>Title: {book.title}</h3>
          <p>Author: {book.author}</p>
          <p>ISBN: {book.isbn}</p>
        </div>
        <div className='bookOptions'>
          {(()=>{ // Logical condition to check if the user had wishlisted the book in order to prevent repeated wishlists on the same book.
            const alreadyWishlisted = wishlists.find(wishListObject => wishListObject.book_id === book.id);
            if(!alreadyWishlisted){
              return(
                <button onClick={()=>addToWishlist(book.id)}>
                  Wishlist Book
                </button>
              )
            }
            else{
              return(
                <button onClick={()=>removeFromWishList((alreadyWishlisted.book_id))}>
                  Remove Book from Wishlist
                </button>
              )
            }
          })()}
        </div>
      </div>
    ) : null
  )}
</div>

    </>
  );
}

export default BookSearch;
