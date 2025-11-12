import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Mock data for demonstration
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      joinDate: '2024-01-01'
    },
    {
      id: 2,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      joinDate: '2024-01-01'
    }
  ]);

  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      available: true
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      available: false
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0-452-28423-4',
      available: true
    },
    {
      id: 4,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '978-0-14-143951-8',
      available: true
    }
  ]);

  const [loans, setLoans] = useState([
    {
      id: 1,
      userId: 1,
      bookId: 2,
      bookTitle: 'To Kill a Mockingbird',
      borrowDate: '2024-01-10',
      dueDate: '2024-01-15',
      returnDate: null,
      status: 'active'
    },
    {
      id: 2,
      userId: 1,
      bookId: 1,
      bookTitle: 'The Great Gatsby',
      borrowDate: '2024-01-05',
      dueDate: '2024-12-20',
      returnDate: '2024-01-12',
      status: 'returned'
    }
  ]);

  const [reservations, setReservations] = useState([
    {
      id: 1,
      userId: 1,
      bookId: 3,
      type: 'loan',
      date: '2024-01-12',
      status: 'pending'
    }
  ]);

  const [user] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user', // Change to 'admin' to test admin features
    joinDate: '2024-01-01'
  });

  return (
    <AppContext.Provider value={{
      users,
      setUsers,
      books,
      setBooks,
      loans,
      setLoans,
      reservations,
      setReservations,
      user
    }}>
      {children}
    </AppContext.Provider>
  );
};