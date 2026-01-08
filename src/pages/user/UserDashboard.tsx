import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLibrary } from '@/context/LibraryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, BookMarked, ShoppingBag, ArrowRight } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { books, borrowedBooks, reservations, purchases, borrowings } = useLibrary();

  const reservedBooks = reservations;
  const purchasedBooks = purchases;

  const stats = [
    {
      label: 'Borrowed Books',
      value: borrowedBooks.length,
      icon: Clock,
      link: '/user/borrowed',
      color: 'text-warning'
    },
    {
      label: 'Reserved Books',
      value: reservedBooks.length,
      icon: BookMarked,
      link: '/user/reserved',
      color: 'text-primary'
    },
    {
      label: 'Purchased Books',
      value: purchasedBooks.length,
      icon: ShoppingBag,
      link: '/user/purchased',
      color: 'text-success'
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">
          Welcome back, {user?.username?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your library activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card hover className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <h3 className="font-medium">{stat.label}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/books">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Books
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/user/borrowed">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  View Borrowed
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {borrowedBooks.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-serif">Currently Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {borrowedBooks.reduce((acc, item) => {
                if (!acc.find(b => b.id == item.id)) {
                  acc.push(item);
                }
                return acc;
              }, []).slice(0, 3).map(book => (

                <div key={book.id} className="flex items-center gap-4">

                  <div className="flex-1">
                    <h4 className="font-medium">{book.title}</h4>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <Link to={`/books/${book.id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;
