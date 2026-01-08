import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '@/models/books';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  showActions?: boolean;
}

const statusVariant = {
  'AVAILABLE': 'available',
  'BORROWED': 'borrowed',
  'RESERVED': 'reserved',
  'OWNED': 'owned',
} as const;

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const averageRating = book.ratings?.length > 0
    ? book.ratings?.reduce((sum, r) => sum + r.rating, 0) / book.ratings?.length
    : 0;

  return (
    <Link to={`/books/${book.id}`}>
      <Card hover className="overflow-hidden h-full">
        <div className="  overflow-hidden">
          {/* <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          /> */}
          <div className="absolute top-3 right-3">
            <Badge variant={statusVariant[book.status]}>
              {book.status}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-serif font-semibold text-lg mb-1 line-clamp-1">
            {book.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">{book.author}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">
                {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
              </span>
            </div>
            <span className="font-semibold text-accent">${book.price}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
