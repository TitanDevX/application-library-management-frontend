import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '@/context/LibraryContext';
import { useAuth } from '@/context/AuthContext';
import { Book } from '@/models/books';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentModal } from '@/components/PaymentModal';
import { RatingModal } from '@/components/RatingModal';
import { 
  ArrowLeft, 
  Star, 
  BookOpen, 
  Calendar, 
  FileText,
  ShoppingCart,
  Clock,
  BookMarked,
  Loader2
} from 'lucide-react';
import { 
  fetchBookById, 
  updateBookStatus, 
  createBorrowing, 
  createReservation, 
  createPurchase,
  rateBook
} from '@/services/api';
import { PaymentType } from '@/models/payments';
import { toast } from '@/hooks/use-toast';

const statusVariant = {
  'AVAILABLE': 'available',
  'BORROWED': 'borrowed',
  'RESERVED': 'reserved',
  'OWNED': 'owned',
} as const;

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { updateLocalBook } = useLibrary();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; type: PaymentType, op_id: string } | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      if (id) {
        setLoading(true);
        const data = await fetchBookById(id);
        setBook(data);
        setLoading(false);
      }
    };
    loadBook();
  }, [id]);

  const handlePaymentSuccess = async () => {
    if (!book || !user || !paymentModal) return;
    
    setProcessing(true);
    
    try {
      let updatedBook: Book | null = null;
      
      switch (paymentModal.type) {
        case 'borrow':
          toast({ title: 'Success!', description: `You have borrowed "${book.title}"` });
          break;
        case 'reserve':
          toast({ title: 'Success!', description: `We will contact you as soon as the book becomes available!` });
          break;
        case 'purchase':
          toast({ title: 'Success!', description: `You now own "${book.title}"` });
          break;
      }
    
      
      if (updatedBook) {
        setBook(updatedBook);
        updateLocalBook(updatedBook);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    }
    
    setProcessing(false);
    setPaymentModal(null);
  };

  const handleRatingSubmit = async (rating: number, review: string) => {
    if (!book || !user) return;
    
    const updatedBook = await rateBook(book.id, user.id, rating, review);
    if (updatedBook) {
      setBook(updatedBook);
      updateLocalBook(updatedBook);
      toast({ title: 'Thanks!', description: 'Your rating has been submitted' });
    }
  };

  const handleBorrowClick = async () => {

    if (!book || !user) return;
    let res;
    try{
     res = await createBorrowing(book.id);
    }catch(error){

      toast({title: "Error", description: error.response.data.error})
      return;
    }

    
    setPaymentModal({open: true, type: 'borrow', op_id: res.borrow.id})

  }
  const handleReserveClick = async () => {

    if (!book || !user) return;
    let res;
    try{
     res = await createReservation(book.id);
    }catch(error){

      toast({title: "Error", description: error.response.data.error})
      return;
    }

    
    setPaymentModal({open: true, type: 'reserve', op_id: res.reservation.id})

  }
 const handlePurchaseClick = async () => {

    if (!book || !user) return;
    let res;
    try{
     res = await createPurchase(book.id);
    }catch(error){

      toast({title: "Error", description: error.response.data.error})
      return;
    }

    
    setPaymentModal({open: true, type: 'purchase', op_id: res.purchase.id})

  }
  const userRating = book?.ratings?.find(r => r.userId === user?.id);
  const averageRating = book?.ratings?.length 
    ? book.ratings?.reduce((sum, r) => sum + r.rating, 0) / book.ratings?.length 
    : 0;

  const canBorrow = book?.status === 'Available' && isAuthenticated && !user?.is_staff;
  const canReserve = book?.status === 'Available' && isAuthenticated && !user?.is_staff;
  const canBuy = book?.status === 'Available' && isAuthenticated && !user?.is_staff;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">Book not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/books')}>
          Back to Books
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className=" rounded-xl overflow-hidden shadow-library-lg">
              {/* <img 
                src={book.coverImage} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div> */}
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-serif font-bold">{book.title}</h1>
              <Badge variant={statusVariant[book.status]} className="shrink-0">
                {book.status}
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground mb-4">{book.author}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({book.ratings?.length ?? 0} reviews)
                </span>
              </div>
            </div>

            {/* <p className="text-foreground/80 leading-relaxed">{book.description}</p> */}
          </div>

          {/* Book Info Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Published</p>
                  <p className="font-semibold">{book.b_year}</p>
                </div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <FileText className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Pages</p> 
                  <p className="font-semibold">{book.pages}</p>
                </div>
              </CardContent>
            </Card> */}
            {/* <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">ISBN</p>
                  <p className="font-semibold text-xs">{book.isbn}</p>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Action Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className={!canBorrow ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span className="font-semibold">Borrow</span>
                </div>
                <p className="text-2xl font-bold text-accent mb-3">${book.price}</p>
                <Button 
                  variant="gold" 
                  className="w-full" 
                  disabled={!canBorrow || processing}
                  onClick={handleBorrowClick}
                >
                  Borrow Now
                </Button>
              </CardContent>
            </Card>
            
            <Card className={!canReserve ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookMarked className="h-5 w-5 text-accent" />
                  <span className="font-semibold">Reserve</span>
                </div>
                <p className="text-2xl font-bold text-accent mb-3">${book.price}</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={!canReserve || processing}
                  onClick={handleReserveClick}
                >
                  Reserve
                </Button>
              </CardContent>
            </Card>
            
            <Card className={!canBuy ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="h-5 w-5 text-accent" />
                  <span className="font-semibold">Buy</span>
                </div>
                <p className="text-2xl font-bold text-accent mb-3">${book.price}</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  disabled={!canBuy || processing}
                  onClick={handlePurchaseClick}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>
          </div>

          {!isAuthenticated && (
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <p className="text-muted-foreground mb-3">Please log in to borrow, reserve, or purchase books</p>
                <Button variant="gold" onClick={() => navigate('/login')}>
                  Log In
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Rating Section */}
          {/* {isAuthenticated && !user?.is_staff && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-serif font-semibold text-lg mb-4">Rate This Book</h3>
                {userRating ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-muted-foreground">Your rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-5 w-5 ${star <= userRating.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {userRating.review && (
                      <p className="text-sm text-muted-foreground italic">"{userRating.review}"</p>
                    )}
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setRatingModalOpen(true)}>
                      Edit Rating
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setRatingModalOpen(true)}>
                    <Star className="h-4 w-4 mr-2" />
                    Write a Review
                  </Button>
                )}
              </CardContent>
            </Card>
          )} */}

          {/* Reviews */}
          {(book.ratings?.length ?? 0) > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-serif font-semibold text-lg mb-4">Reviews</h3>
                <div className="space-y-4">
                  {book.ratings.map((rating, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= rating.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {rating.review && (
                        <p className="text-sm text-muted-foreground">{rating.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModal && (
        <PaymentModal
          isOpen={paymentModal.open}
          onClose={() => setPaymentModal(null)}
          onSuccess={handlePaymentSuccess}
          bookTitle={book.title}
          bookId={book.id}
          amount={
            book.price
          }
          op_id={paymentModal.op_id}
          type={paymentModal.type}
        />
      )}

      {/* Rating Modal */}
      {/* <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
        bookTitle={book.title}
        existingRating={userRating?.rating}
        existingReview={userRating?.review}
      /> */}
    </div>
    </div>
  );
};

export default BookDetailsPage;
