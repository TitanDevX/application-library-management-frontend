import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { BookCard } from '@/components/BookCard';
import { useLibrary } from '@/context/LibraryContext';
import { Search, Loader2 } from 'lucide-react';

const BooksListPage: React.FC = () => {
  const { books, loading } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState(books);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBooks(books);
    } else {
      const query = searchQuery.toLowerCase();
      const results = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) 
      );
      setFilteredBooks(results);
    }
  }, [searchQuery, books]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Browse Books</h1>
        <p className="text-muted-foreground">Search by title, author, or keyword</p>
      </div>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No books found matching your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <div 
              key={book.id} 
              className="animate-slide-up" 
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksListPage;
