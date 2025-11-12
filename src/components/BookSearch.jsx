import React, { useContext, useState, useEffect } from 'react'; 
import './BookSearch.css'
import { AppContext } from '../context/AppContext';

function BookSearch() {
  // const { books } = useContext(AppContext);

  const [inputValue, setInputValue] = useState(''); 
  const [query, setQuery] = useState(''); 
  const [bookLibrary, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const handleSearch = () => {
    setQuery(inputValue);
  };

  const reserveBook = async (bookID) => {
    const token = localStorage.getItem("token");
    const body = {
      book_id: bookID,
      reservation_type: "loan",
      expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Default the expiration date to 7 days extra
    };

    const res = await fetch("http://localhost:8000/api/reservations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updatedRes = await fetch("http://localhost:8000/api/reservations/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = await updatedRes.json();
      console.log("Updated reservations after unreserve:", updatedData);

      setReservations(updatedData);
    } else {
      console.error(`Failed to reserve: ${res.status}`);
    }
  };

  const unreserveBook = async (reservationID) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/reservations/${reservationID}/cancel`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if(res.ok){
      console.log("Successfuly unreserved the book.");
      const updatedRes = await fetch("http://localhost:8000/api/reservations/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = await updatedRes.json();
      setReservations(updatedData);
    }
    else{
      console.log("Unsuccessful in unreserving the book.");
    }
  };

  const addToWishlist = async (bookID) => {
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
    if(res.ok){
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

  const removeFromWishList = async (bookID) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/users/me/wishlist/${bookID}`,{
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    if(res.ok){
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

  async function fetchBooks() {
    const res = await fetch("http://localhost:8000/api/books/");
    return await res.json();
  }

  useEffect(()=>{
    const loadUsersReservationsAndWishlists = async () =>{
      try{
        const token = localStorage.getItem("token");
        const userRes = await fetch("http://localhost:8000/api/users/me", {
          headers:{
            Authorization: `Bearer ${token}`,
          }
        });
        const user = await userRes.json();
        setCurrentUser(user.id)
        console.log("Current User: " + user.id);
        const reservationsRes = await fetch("http://localhost:8000/api/reservations/", {
          headers:{
            Authorization: `Bearer ${token}`,
          }
        });
        const reservationsFound = await reservationsRes.json()
        setReservations(reservationsFound);     
        const wishlistRes = await fetch("http://localhost:8000/api/users/me/wishlist",{
          headers:{
            Authorization: `Bearer ${token}`,
          }
        });
        const wishlistsFound = await wishlistRes.json();
        setWishlists(wishlistsFound);
      }
      catch(error){
        console.error("Error fetching user/reservations: ", error);
      }
    }
    loadUsersReservationsAndWishlists();
  }, [])
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data); // save to context
        console.log("Fetched books:", data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    loadBooks();
  }, []);
  if (!currentUser) {
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
  {bookLibrary && bookLibrary.map(book => 
    book.title.toLowerCase().includes(query.toLowerCase()) ? (
      <div className='bookContainer' key={book.id}>
        <div className='bookInfo'>
          <h3>Title: {book.title}</h3>
          <p>Author: {book.author}</p>
          <p>ISBN: {book.isbn}</p>
        </div>

        <div className='bookOptions'>
          {(() => {
            const existingReservation = reservations.find(r => r.book_id === book.id && r.status.trim().toUpperCase() !== "CANCELLED");
            if (!existingReservation) {
              return (
                <button className='btn btn-success' onClick={() => reserveBook(book.id)}>
                  Reserve Book
                </button>
              );
            } else if (existingReservation.user_id === currentUser) {

              return (
                <button className='btn btn-danger' onClick={() => unreserveBook(existingReservation.id)}>
                  Unreserve Book
                </button>
              );
            } else {

              return (
                <button className='btn btn-secondary' disabled>
                  Reserved by Another User
                </button>
              );
            }
          })()}
        </div>
        <div className='bookOptions'>
          {(() => {
            const existingWishlist = wishlists.find(r => r.book_id === book.id);
            if (!existingWishlist) {
              return (
                <button className='btn btn-success' onClick={() => addToWishlist(book.id)}>
                  Wishlist Book
                </button>
              );
            } else if (existingWishlist.user_id === currentUser) {

              return (
                <button className='btn btn-danger' onClick={() => removeFromWishList(existingWishlist.book_id)}>
                  Remove Book from Wishlist
                </button>
              );
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
