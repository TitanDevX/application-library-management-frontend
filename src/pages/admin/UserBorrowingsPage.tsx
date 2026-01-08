import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLibrary } from '@/context/LibraryContext';
import { fetchUserBorrowings, returnBook, updateBookStatus } from '@/services/api';
import { Borrowing, isDue } from '@/models/borrowings';
import { toast } from '@/hooks/use-toast';
import { parseJSON } from 'date-fns';
import { useAdmin } from '@/context/AdminContext';
import { User } from '@/models/users';

const UserBorrowingsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  let { books, borrowings, updateLocalBook, refreshBorrowings } = useLibrary();
  const { users } = useAdmin();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (users) {
      setUser(users.find(u => u.id == userId) ?? null);
    }
  }, [users, userId]);

  if (!user) return <div className="container py-8">User not found #{userId}</div>;
  borrowings = borrowings.filter(b => b.user == userId);

  const handleReturn = async (borrowing: Borrowing) => {
    await returnBook(borrowing);
    const book = books.find(b => b.id === borrowing.book);
    if (book) updateLocalBook({ ...book, status: 'Available', borrowerId: null });
    // setBorrowings(prev => prev.map(b => b.id === borrowing.id ? { ...b, status: 'returned', returnDate: new Date().toISOString().split('T')[0] } : b));
    refreshBorrowings();
    toast({ title: 'Book returned successfully' });
  };



  const activeBorrowings = borrowings.filter(b => !isDue(b));

  return (
    <div className="container py-8">
      <Link to="/admin/users" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Back to Users</Link>

      <div className="flex items-center gap-4 mb-8">
        <div><h1 className="text-3xl font-serif font-bold">{user.username}</h1><p className="text-muted-foreground">{user.email}</p></div>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-serif">Active Borrowings ({activeBorrowings.length})</CardTitle></CardHeader>
        <CardContent>
          {activeBorrowings.length === 0 ? <p className="text-muted-foreground">No active borrowings</p> : (
            <div className="space-y-4">
              {activeBorrowings.map(borrowing => {
                const book = books.find(b => b.id === borrowing.book);
                if (!book) return null;
                return (
                  <div key={borrowing.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1"><h4 className="font-semibold">{book.title}</h4><p className="text-sm text-muted-foreground">Due: {borrowing.return_date}</p></div>
                   
                    {!borrowing.is_returned ? (
                      <div>
                       <Badge variant="borrowed">Borrowed</Badge>
                      <Button variant="gold" size="sm" className="ml-2" onClick={() => handleReturn(borrowing)}><RotateCcw className="h-4 w-4 mr-2" />Return Book</Button>
                      </div>
                      )
                      :
                      (
                        <Badge variant="returned">Returned</Badge>
                      )
                      }
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBorrowingsPage;
