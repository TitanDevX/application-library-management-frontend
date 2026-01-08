export class Borrowing {
  id: string;
  user: string;
  book: string;
  borrow_date: string;
  return_date: string | null;
  is_paid: boolean;
  is_returned: boolean;
 

}

export interface Reservation {
  id: string;
  user: string;
  book: string;
  reservation_date: string;
  is_paid: string;
}

export interface Purchase {
  id: string;
  userId: string;
  bookId: string;
  purchaseDate: string;
  price: number;
}

export const isDue = (b: Borrowing): boolean => {
  if (!b.return_date) return false;
  return Date.parse(b.return_date) < Date.now();
};