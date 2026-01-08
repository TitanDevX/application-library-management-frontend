import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLibrary } from '@/context/LibraryContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookMarked, ArrowLeft } from 'lucide-react';

const MyReservedPage: React.FC = () => {
  const { user } = useAuth();
  const { books,reservations } = useLibrary();

  const reservedBooks = reservations

  return (
    <div className="container py-8">
      <Link to="/user" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2 flex items-center gap-3">
          <BookMarked className="h-8 w-8 text-primary" />
          Reserved Books
        </h1>
        <p className="text-muted-foreground">
          Books you have reserved. Pick them up at the library before your reservation expires.
        </p>
      </div>

      {reservedBooks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookMarked className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No reserved books</h3>
            <p className="text-muted-foreground mb-4">You haven't reserved any books yet.</p>
            <Link to="/books">
              <Button variant="gold">Browse Books</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reservedBooks.map(book => (
            <Card key={book.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif font-semibold text-lg">{book.title}</h3>
                        <p className="text-muted-foreground">{book.author}</p>
                      </div>
                      
                      <Badge variant="reserved">Reserved</Badge>
                    </div>
                   
                  </div>
                  <Link to={`/books/${book.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservedPage;
