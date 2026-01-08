import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Book } from '@/models/books';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: Book, rating: number, review: string) => void;
  book?: Book;
  existingRating?: number;
  existingReview?: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  book = undefined,
  existingRating = 0,
  existingReview = ''
}) => {
  const [rating, setRating] = useState(existingRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState(existingReview);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(book,rating, review);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Rate This Book</DialogTitle>
          <DialogDescription>
            Share your thoughts on "{book?.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`h-10 w-10 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground/30'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {rating === 0 ? 'Click to rate' : `You rated this ${rating} star${rating !== 1 ? 's' : ''}`}
          </div>

          

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="gold" 
              className="flex-1" 
              onClick={handleSubmit}
              disabled={rating === 0}
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
