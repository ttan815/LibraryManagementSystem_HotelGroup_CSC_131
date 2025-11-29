import React, { useContext, useState, useEffect } from 'react'; 
import '../pages/style.css'
import { AppContext } from '../context/AppContext';

function BookForm() {
  const { books, createBook, updateBook, deleteBook, refreshData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    create: {
      title: '',
      author: '',
      isbn: ''
    },
    update: {
      oldTitle: '',
      oldAuthor: '',
      oldIsbn: '',
      newTitle: '',
      newAuthor: '',
      newIsbn: ''
    },
    delete: {
      title: '',
      author: '',
      isbn: ''
    }
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const bookData = {
        title: formData.create.title,
        author: formData.create.author,
        isbn: formData.create.isbn
      };
      
      await createBook(bookData);
      alert("Successfully created: " + formData.create.title + " Authored By: " + formData.create.author);
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        create: {
          title: '',
          author: '',
          isbn: ''
        }
      }));
      
      // Refresh data
      refreshData();
      
    } catch (error) {
      console.error('Error creating book:', error);
      alert("Error: Book already exists/input error");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let bookID = null;
      let found = false;
      
      // Find book by old details
      for(let i = 0; i < books.length; i++){
        if(formData.update.oldTitle === books[i]["title"] && 
           formData.update.oldAuthor === books[i]["author"] && 
           formData.update.oldIsbn === books[i]["isbn"]){
          bookID = books[i]["id"];
          found = true;
          break;
        }
      }
      
      if(!found){
        alert("Unable to find a book with title: " + formData.update.oldTitle + " author: " + formData.update.oldAuthor + " ISBN: " + formData.update.oldIsbn);
        return;
      }

      const bookData = {
        title: formData.update.newTitle,
        author: formData.update.newAuthor,
        isbn: formData.update.newIsbn,
      };
      
      await updateBook(bookID, bookData);
      alert("Successfully updated the book");
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        update: {
          oldTitle: '',
          oldAuthor: '',
          oldIsbn: '',
          newTitle: '',
          newAuthor: '',
          newIsbn: ''
        }
      }));
      
      // Refresh data
      refreshData();
      
    } catch (error) {
      console.error('Error updating book:', error);
      alert("Unsuccessful in updating the book");
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let bookID = null;
      let found = false;
      
      // Find book by details
      for(let i = 0; i < books.length; i++){
        if(formData.delete.title === books[i]["title"] && 
           formData.delete.author === books[i]["author"] && 
           formData.delete.isbn === books[i]["isbn"]){
          bookID = books[i]["id"];
          found = true;
          break;
        }
      }
      
      if(!found){
        alert("Unable to find a book called: " + formData.delete.title + " By: " + formData.delete.author);
        return;
      }

      await deleteBook(bookID);
      alert("Successfully deleted the book with title: " + formData.delete.title + " author: " + formData.delete.author + " ISBN: " + formData.delete.isbn);
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        delete: {
          title: '',
          author: '',
          isbn: ''
        }
      }));
      
      // Refresh data
      refreshData();
      
    } catch (error) {
      console.error('Error deleting book:', error);
      alert("Unsuccessful in deleting the book");
    }
  };

  const handleInputChange = (formType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        [field]: value
      }
    }));
  };

  return (
    <>
    <div className="addAndEditBookForm">
      {/* Create Book Form */}
      <form onSubmit={handleCreateSubmit}> 
        <h1 id="addBookTitle">Add Book</h1>
        <div className="column">
          <label className="inputName" htmlFor="bookTitle">Book Title:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="bookTitle"
            value={formData.create.title}
            onChange={(e) => handleInputChange('create', 'title', e.target.value)}
          />    
        </div> 
        <div className="column">
          <label className="inputName" htmlFor="author">Author:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="author"
            value={formData.create.author}
            onChange={(e) => handleInputChange('create', 'author', e.target.value)}
          />    
        </div> 
        <div className="column">
          <label className="inputName" htmlFor="ISBN">ISBN:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="ISBN"
            value={formData.create.isbn}
            onChange={(e) => handleInputChange('create', 'isbn', e.target.value)}
          />    
        </div> 
        <button className="btn btn-primary submitButton" type="submit">Add Book</button>
      </form>
      
      {/* Update Book Form */}
      <form onSubmit={handleUpdateSubmit}>
        <h1 id="addBookTitle">Update Book</h1>
        <div className="column">
          <label className="inputName" htmlFor="oldBookTitle">Old Book Title:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="oldBookTitle"
            value={formData.update.oldTitle}
            onChange={(e) => handleInputChange('update', 'oldTitle', e.target.value)}
          />    
        </div> 
        <div className="column">
          <label className="inputName" htmlFor="oldAuthor">Old Author:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="oldAuthor"
            value={formData.update.oldAuthor}
            onChange={(e) => handleInputChange('update', 'oldAuthor', e.target.value)}
          />    
        </div> 
        <div className="column">
          <label className="inputName" htmlFor="oldISBN">Old ISBN:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="oldISBN"
            value={formData.update.oldIsbn}
            onChange={(e) => handleInputChange('update', 'oldIsbn', e.target.value)}
          />    
        </div> 
        <div className="column">
          <label className="inputName" htmlFor="newBookTitle">New Book Title:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="newBookTitle"
            value={formData.update.newTitle}
            onChange={(e) => handleInputChange('update', 'newTitle', e.target.value)}
          />    
        </div> 
        <div className="column">
          <label className="inputName" htmlFor="newAuthor">New Author:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="newAuthor"
            value={formData.update.newAuthor}
            onChange={(e) => handleInputChange('update', 'newAuthor', e.target.value)}
          />    
        </div> 
        <div className="column">
          <label className="inputName" htmlFor="newISBN">New ISBN:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="newISBN"
            value={formData.update.newIsbn}
            onChange={(e) => handleInputChange('update', 'newIsbn', e.target.value)}
          />    
        </div> 
        <button className="btn btn-primary submitButton" type="submit">Submit Changes</button>
      </form>
      
      {/* Delete Book Form */}
      <form onSubmit={handleDeleteSubmit}>
        <h1 id="addBookTitle">Delete Book</h1>
        <div className="column">
          <label className="inputName" htmlFor="bookTitle">Book Title:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="bookTitle"
            value={formData.delete.title}
            onChange={(e) => handleInputChange('delete', 'title', e.target.value)}
          />    
        </div> 
        <div className="column">
          <label className="inputName" htmlFor="author">Author:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="author"
            value={formData.delete.author}
            onChange={(e) => handleInputChange('delete', 'author', e.target.value)}
          />    
        </div> 
        <div className="column">
          <label className="inputName" htmlFor="ISBN">ISBN:</label>
          <input 
            required 
            type="text" 
            className="form-control" 
            name="ISBN"
            value={formData.delete.isbn}
            onChange={(e) => handleInputChange('delete', 'isbn', e.target.value)}
          />    
        </div> 
        <button className="btn btn-danger submitButton" type="submit">Delete Book</button>
      </form>

      <h2>All Books</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Available Copies</th>
              <th>Total Copies</th>
            </tr>
          </thead>
          
          <tbody>
            {books && books.map((bookObject) => (
              <tr key={bookObject.id}>
                <td>{bookObject.id}</td>
                <td>{bookObject.title}</td>
                <td>{bookObject.author}</td>
                <td>{bookObject.isbn}</td>
                <td>
                  <span className={`status-badge ${bookObject.available_copies > 0 ? 'available' : 'unavailable'}`}>
                    {bookObject.available_copies}
                  </span>
                </td>
                <td>{bookObject.total_copies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

export default BookForm;
