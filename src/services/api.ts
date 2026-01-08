// API Service Layer
// All axios calls are commented out for easy backend integration later
// Currently using mock implementations
import axiosABS from "axios";
import { mockBooks, Book, BookStatus } from '@/models/books';
import {  User } from '@/models/users';
import { Borrowing, Reservation, Purchase } from '@/models/borrowings';
import { simulatePayment, PaymentData, Payment, mockPayments } from '@/models/payments';





export const axios = axiosABS.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // needed for cookies / session auth
});
// ============ BOOK OPERATIONS ============

export const fetchBooks = async (): Promise<Book[]> => {
  
  const response = await axios.get('/api/books/');
  return response.data;

};

export const fetchBookById = async (id: string): Promise<Book | null> => {
  
  const response = await axios.get(`/api/book/${id}`);
  return response.data;

};

export const searchBooks = async (query: string): Promise<Book[]> => {
  
  const response = await axios.get('/api/books/search', { params: { q: query } });
  return response.data;

};

export const createBook = async (bookData: Omit<Book, 'id' | 'ratings' |'status'>): Promise<Book> => {
  
  const response = await axios.post('/api/books/', bookData);
  return response.data;

};

export const updateBook = async (id: string, updates: Partial<Book>): Promise<Book | null> => {
  
  const response = await axios.put(`/api/book/${id}/`, updates);
  return response.data;


};

export const deleteBook = async (id: string): Promise<boolean> => {
  
  await axios.delete(`/api/book/${id}/`);
  return true;

};

export const updateBookStatus = async (
  bookId: string, 
  status: BookStatus, 
  userId: string | null,
  field: 'borrowerId' | 'reserverId' | 'ownerId'
): Promise<Book | null> => {
  
  const response = await axios.patch(`/api/books/${bookId}/status/`, { status, userId, field });
  return response.data;


};


export const rateBook = async (
  bookId: string, 
  userId: string, 
  rating: number, 
  review?: string
): Promise<Book | null> => {
  
  const response = await axios.post(`/api/books/${bookId}/rate/`, { userId, rating, review });
  return response.data;

 
};

// ============ USER OPERATIONS ============

export const fetchUsers = async (): Promise<User[]> => {
  
  const response = await axios.get('/users');
  return response.data;


};

export const fetchUserById = async (id: string): Promise<User | null> => {
  
  const response = await axios.get(`/api/users/${id}`);
  return response.data;


};

export const fetchMyBorrowings = async (): Promise<Borrowing[]> => {
  const response = await axios.get(`/api/myborrows`);
  return response.data;

};
// ============ BORROWING OPERATIONS ============

export const fetchUserBorrowings = async (userId: string): Promise<Borrowing[]> => {
  const response = await axios.get(`/api/users/${userId}/borrows`);
  return response.data;
};

export const fetchAllBorrowings = async (): Promise<Borrowing[]> => {
  
  const response = await axios.get('/api/borrows');
  return response.data;

};
export const fetchAllReservations = async (): Promise<Reservation[]> => {
  
  const response = await axios.get('/api/reservation');
  return response.data;

};
export const deleteReservation = async (id) => {
  
  const response = await axios.delete('/api/reservation/' + id + '/' );
  return response.data;

};
export const createBorrowing = async (book_id: string) => {
  
  const response = await axios.post('/api/borrows/', {  book_id })
  return response.data;

 
};

export const returnBook = async (borrowing: Borrowing)  => {
  
  const response = await axios.post(`/api/return-book/`,{ book_id:borrowing.book, user_id: borrowing.user});
  return response.data;

 
};

// ============ RESERVATION OPERATIONS ============

export const fetchUserReservations = async (userId: string): Promise<Reservation[]> => {
  
  const response = await axios.get(`/api/users/${userId}/reservations`);
  return response.data;

};

export const createReservation = async (bookId: string): Promise<Reservation> => {
  
  const response = await axios.post('/api/reservation/', { book_id:bookId });
  return response.data;

  
};

// ============ PURCHASE OPERATIONS ============

export const fetchUserPurchases = async (userId: string): Promise<Purchase[]> => {
  
  const response = await axios.get(`/api/users/${userId}/purchases`);
  return response.data;
};

export const createPurchase = async (bookId: string): Promise<Purchase> => {
  
  const response = await axios.post('/purchased/', { book_id: bookId });
  return response.data;

 
};

// ============ PAYMENT OPERATIONS ============

export const processPayment = async (paymentData: PaymentData): Promise<{ success: boolean; paymentId?: string; error?: string }> => {
  
  const response = await axios.post('/payments/', paymentData);
  return response.data;

  // MOCK IMPLEMENTATION
  return simulatePayment(paymentData);
};
export const userBooks = async () => {
  const response = await axios.get('/api/user-books/');
  return response.data;
}

export const fetchPaymentHistory = async (userId: string): Promise<Payment[]> => {
  
  const response = await axios.get(`/api/users/${userId}/payments`);
  return response.data;

};
