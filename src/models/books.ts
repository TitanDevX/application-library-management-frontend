export type BookStatus = 'Available' | 'Not Available';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  borrowerId: string | null;
  reserverId: string | null;
  ownerId: string | null;
  b_year: number;
  price: number;
  count?: number ;
  ratings: { userId: string; rating: number; review?: string }[];
}

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    // description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set against the backdrop of the Roaring Twenties.',
    status: 'Available',
    borrowerId: null,
    reserverId: null,
    ownerId: null,
    // coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    // isbn: '978-0743273565',
    b_year: 1925,
    price: 15.99,
    ratings: [
      { userId: '2', rating: 5, review: 'A masterpiece of American literature!' },
      { userId: '3', rating: 4, review: 'Beautifully written.' }
    ]
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    // description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    status: 'Available',
    borrowerId: null,
    reserverId: null,
    ownerId: null,
    // coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    // isbn: '978-0061120084',
    b_year: 1960,
    // pages: 281,
    price: 14.99,
    // borrowPrice: 2.49,
    // reservePrice: 1.49,
    ratings: [
      { userId: '3', rating: 5, review: 'Essential reading for everyone.' }
    ]
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    // description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
    status: 'Available',
    borrowerId: '2',
    reserverId: null,
    ownerId: null,
    // coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    // isbn: '978-0451524935',
    b_year: 1949,
    // pages: 328,
    price: 13.99,
    // borrowPrice: 2.29,
    // reservePrice: 1.29,
    ratings: []
  },
  // {
  //   id: '4',
  //   title: 'Pride and Prejudice',
  //   author: 'Jane Austen',
  //   description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet.',
  //   status: 'AVAILABLE',
  //   borrowerId: null,
  //   reserverId: null,
  //   ownerId: null,
  //   coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
  //   isbn: '978-0141439518',
  //   b_year: 1813,
  //   pages: 279,
  //   price: 12.99,
  //   borrowPrice: 1.99,
  //   reservePrice: 0.99,
  //   ratings: [
  //     { userId: '2', rating: 5, review: 'Timeless and witty!' }
  //   ]
  // },
  // {
  //   id: '5',
  //   title: 'The Catcher in the Rye',
  //   author: 'J.D. Salinger',
  //   description: 'The story of teenage angst and alienation, narrated by the cynical and troubled Holden Caulfield.',
  //   status: 'RESERVED',
  //   borrowerId: null,
  //   reserverId: '3',
  //   ownerId: null,
  //   coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
  //   isbn: '978-0316769488',
  //   b_year: 1951,
  //   pages: 234,
  //   price: 11.99,
  //   borrowPrice: 1.79,
  //   reservePrice: 0.79,
  //   ratings: []
  // },
  // {
  //   id: '6',
  //   title: 'The Hobbit',
  //   author: 'J.R.R. Tolkien',
  //   description: 'Bilbo Baggins, a respectable hobbit, is swept into an epic quest to reclaim the lost Dwarf Kingdom.',
  //   status: 'AVAILABLE',
  //   borrowerId: null,
  //   reserverId: null,
  //   ownerId: null,
  //   coverImage: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400',
  //   isbn: '978-0547928227',
  //   b_year: 1937,
  //   pages: 310,
  //   price: 16.99,
  //   borrowPrice: 2.99,
  //   reservePrice: 1.99,
  //   ratings: [
  //     { userId: '2', rating: 5, review: 'A wonderful adventure!' },
  //     { userId: '3', rating: 5, review: 'Perfect fantasy.' }
  //   ]
  // },
  // {
  //   id: '7',
  //   title: 'Brave New World',
  //   author: 'Aldous Huxley',
  //   description: 'A futuristic World State, whose citizens are environmentally engineered into an intelligence-based social hierarchy.',
  //   status: 'AVAILABLE',
  //   borrowerId: null,
  //   reserverId: null,
  //   ownerId: null,
  //   coverImage: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400',
  //   isbn: '978-0060850524',
  //   b_year: 1932,
  //   pages: 288,
  //   price: 14.49,
  //   borrowPrice: 2.49,
  //   reservePrice: 1.49,
  //   ratings: []
  // },
  // {
  //   id: '8',
  //   title: 'Jane Eyre',
  //   author: 'Charlotte Brontë',
  //   description: 'The story of Jane, an intelligent and spirited orphan who becomes a governess at Thornfield Hall.',
  //   status: 'OWNED',
  //   borrowerId: null,
  //   reserverId: null,
  //   ownerId: '2',
  //   coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
  //   isbn: '978-0141441146',
  //   b_year: 1847,
  //   pages: 500,
  //   price: 13.99,
  //   borrowPrice: 2.29,
  //   reservePrice: 1.29,
  //   ratings: [
  //     { userId: '2', rating: 4, review: 'A powerful story of independence.' }
  //   ]
  // }
];
