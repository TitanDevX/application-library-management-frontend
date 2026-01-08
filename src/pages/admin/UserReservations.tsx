import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLibrary } from '@/context/LibraryContext';
import { deleteReservation, fetchAllReservations } from '@/services/api';
import { User } from '@/models/users';
import { useAdmin } from '@/context/AdminContext';
import { Reservation } from '@/models/borrowings';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const UserReservationsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { books } = useLibrary();
  const { users } = useAdmin();
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (users) {
      setUser(users.find(u => u.id == userId) ?? null);
    }
  }, [users, userId]);

  useEffect(() => {
    const init = async () => {
      const res = await fetchAllReservations();
      setReservations(res);
    };
    init();
  }, [users]);
  const handleReturn = async (res: Reservation) => {
    await deleteReservation(res.id);
    const book = books.find(b => b.id === res.book);
    // setBorrowings(prev => prev.map(b => b.id === borrowing.id ? { ...b, status: 'returned', returnDate: new Date().toISOString().split('T')[0] } : b));
    toast({ title: 'Reservation deleted successfully' });
    setReservations(reservations.filter(b => b.id != res.id))
  };

  if (!user) return <div className="container py-8">User not found #{userId}</div>;

  // filter reservations for this user
  const userReservations = reservations.filter(r => r.user == userId);

  return (
    <div className="container py-8">
      <Link to="/admin/users" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />Back to Users
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">{user.username}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Active Reservations ({userReservations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {userReservations.length === 0 ? (
            <p className="text-muted-foreground">No active reservations</p>
          ) : (
            <div className="space-y-4">
              {userReservations.map(reservation => {
                const book = books.find(b => b.id === reservation.book);
                if (!book) return null;

                return (
                  <div key={reservation.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{book.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Date: {reservation.reservation_date}
                      </p>
                    </div>
                    {reservation.is_paid ? (<div>
                        <Badge variant="reserved">Reserved</Badge>
                        <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleReturn(reservation)}>Complete</Button>

                        </div>) : <Badge variant="unpaid">Unpaid</Badge>}
                    
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

export default UserReservationsPage;
