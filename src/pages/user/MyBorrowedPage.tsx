import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLibrary } from '@/context/LibraryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import { Borrowing } from '@/models/borrowings';
import { fetchMyBorrowings, fetchUserBorrowings, rateBook } from '@/services/api';
import { RatingModal } from '@/components/RatingModal';
import { toast } from '@/hooks/use-toast';
import { Book } from '@/models/books';

const MyBorrowedPage: React.FC = () => {
  const { user } = useAuth();
  const { books } = useLibrary();
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [ratingModalOpen, setRatingModalOpen] = useState<Book | null>(undefined);
  const handleRatingSubmit = async (book, rating: number, review: string) => {
    if (!book || !user) return;
    
    const updatedBook = await rateBook(book.id, user.id, rating, review);
    if (updatedBook) {
      toast({ title: 'Thanks!', description: 'Your rating has been submitted' });
    }
  };  
  useEffect(() => {  fetchMyBorrowings().then(setBorrowings); }, []);
  return (
    <div className="container py-8">
      <Link to="/user" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2 flex items-center gap-3">
          <Clock className="h-8 w-8 text-warning" />
          Borrowed Books
        </h1>
        <p className="text-muted-foreground">
          Books you currently have borrowed. Note: Only administrators can process returns.
        </p>
      </div>

      {borrowings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No borrowed books</h3>
            <p className="text-muted-foreground mb-4">You haven't borrowed any books yet.</p>
            <Link to="/books">
              <Button variant="gold">Browse Books</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6 bg-muted/50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-warning" />
              <p className="text-sm">
                <strong>Important:</strong> To return a book, please visit the library and an administrator will process the return for you.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {borrowings.map(borrowing => {
              console.log(borrowing);
               const book = books.find(b => b.id === borrowing.book);
              return (
              
              <Card key={book.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                  
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif font-semibold text-lg">{book?.title}</h3>
                          <p className="text-muted-foreground">{book?.author}</p>
                        </div>
                        {!borrowing.is_returned ? (<div>

                       <Badge variant="borrowed">Borrowed</Badge>
                       </div>
                      )
                      :
                      (
                        <div>
                       
                          
                        <Badge variant="returned">Returned</Badge>
                        
                        </div>
                      )
                      }
                      </div>
                     
                    </div>
                    <Link to={`/books/${book?.id}`}>
                      <Button variant="outline">View Details</Button>
                      
                    

                    </Link>
                      {borrowing.is_returned &&  <Button variant="success" size="sm" className="ml-2" onClick={() => {
                        setRatingModalOpen(book)
                      }}>Rate Book</Button>}
                  </div>
                </CardContent>
              </Card>
            )})}
          </div>
        </>
        
      )}
      <RatingModal
                isOpen={ratingModalOpen != undefined}
                onClose={() => setRatingModalOpen(undefined)}
                onSubmit={handleRatingSubmit}
                book={ratingModalOpen}
              />
    </div>
  );
};

export default MyBorrowedPage;
