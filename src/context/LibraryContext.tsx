import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '@/models/books';
import { Borrowing, Reservation, Purchase } from '@/models/borrowings';
import { fetchBooks, fetchAllBorrowings, userBooks, fetchUsers } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/models/users';

interface LibraryContextType {
  books: Book[];
  borrowings: Borrowing[];
  borrowedBooks: Book[];
  reservations: Book[];
  purchases: Book[];
  loading: boolean;
  refreshBooks: () => Promise<void>;
  refreshBorrowings: () => Promise<void>;
  updateLocalBook: (book: Book) => void;
  addLocalBook: (book: Book) => void;
  removeLocalBook: (bookId: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [reservations, setReservations] = useState<Book[]>([]);
  const [purchases, setPurchases] = useState<Book[]>([]);
  const { user, isAuthenticated } = useAuth();


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refreshBooks();
     
      if (isAuthenticated && user) {
        await refreshBorrowings();
      }

      setLoading(false);
    };
    init();
  }, [isAuthenticated, user]);
  const refreshUserOperations = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    const data = await userBooks();
    setBorrowedBooks(data.borrowed);
    setReservations(data.reserved);
    setPurchases(data.purchased);
    setLoading(false);
  };

  useEffect(() => {
    refreshUserOperations();
  }, [isAuthenticated]);
  const refreshBooks = async () => {
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  const refreshBorrowings = async () => {
    try {
      console.log("BOR")
      const data = await fetchAllBorrowings();
      setBorrowings(data);
    } catch (error) {
      console.error('Failed to fetch borrowings:', error);
    }
  };

  const updateLocalBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const addLocalBook = (newBook: Book) => {
    setBooks(prev => [...prev, newBook]);
  };

  const removeLocalBook = (bookId: string) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
  };


  return (
    <LibraryContext.Provider value={{
      books,
      borrowings,
      borrowedBooks,
      reservations,
      purchases,
      loading,
      refreshBooks,
      refreshBorrowings,
      updateLocalBook,
      addLocalBook,
      removeLocalBook
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
