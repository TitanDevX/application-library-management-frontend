import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLibrary } from '@/context/LibraryContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const MyPurchasedPage: React.FC = () => {
  const { user } = useAuth();
  const { books } = useLibrary();

  const purchasedBooks = books.filter(b => b.ownerId === user?.id);

  return (
    <div className="container py-8">
      <Link to="/user" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-success" />
          Purchased Books
        </h1>
        <p className="text-muted-foreground">
          Books you own. These are yours to keep forever!
        </p>
      </div>

      {purchasedBooks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No purchased books</h3>
            <p className="text-muted-foreground mb-4">You haven't purchased any books yet.</p>
            <Link to="/books">
              <Button variant="gold">Browse Books</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {purchasedBooks.map(book => (
            <Card key={book.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
             
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif font-semibold text-lg">{book.title}</h3>
                        <p className="text-muted-foreground">{book.author}</p>
                      </div>
                      <Badge variant="owned">Owned</Badge>
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

export default MyPurchasedPage;
