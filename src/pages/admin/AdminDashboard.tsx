import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLibrary } from '@/context/LibraryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { isDue } from '@/models/borrowings';
import { fetchAllBorrowings, fetchAllReservations } from '@/services/api';

const AdminDashboard: React.FC = () => {
  const { books,borrowings } = useLibrary();
  const {users} = useAdmin();
  const [reservations, setReservations] = useState([]);
  useEffect(() => {

    const init = async () => {

      let res = await fetchAllReservations()
      setReservations(res);

    }
    init();
  }, [users])
  const activeBorrowings = borrowings.filter(b => !b.is_returned);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage books, users, and borrowings.</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-6 mb-8">
        <Card hover><CardContent className="p-6"><div className="flex items-center justify-between mb-4"><BookOpen className="h-8 w-8 text-accent" /><span className="text-3xl font-bold">{books.length}</span></div><h3 className="font-medium">Total Books</h3></CardContent></Card>
        <Card hover><CardContent className="p-6"><div className="flex items-center justify-between mb-4"><Users className="h-8 w-8 text-primary" /><span className="text-3xl font-bold">{users.length}</span></div><h3 className="font-medium">Users</h3></CardContent></Card>
        <Card hover><CardContent className="p-6"><div className="flex items-center justify-between mb-4"><Clock className="h-8 w-8 text-warning" /><span className="text-3xl font-bold">{activeBorrowings.length}</span></div><h3 className="font-medium">Active Borrowings</h3></CardContent></Card>
      <Card hover><CardContent className="p-6"><div className="flex items-center justify-between mb-4"><Clock className="h-8 w-8 text-warning" /><span className="text-3xl font-bold">{reservations.length}</span></div><h3 className="font-medium">Active Reservations</h3></CardContent></Card>
      
      </div>

      <Card>
        <CardHeader><CardTitle className="font-serif">Quick Actions</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Link to="/admin/books"><Button variant="outline" className="w-full justify-between"><span className="flex items-center"><BookOpen className="h-4 w-4 mr-2" />Manage Books</span><ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/admin/users"><Button variant="outline" className="w-full justify-between"><span className="flex items-center"><Users className="h-4 w-4 mr-2" />View Users</span><ArrowRight className="h-4 w-4" /></Button></Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
