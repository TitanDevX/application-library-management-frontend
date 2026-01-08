import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Book } from '@/models/books';
import { createBook, updateBook, deleteBook } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const statusVariant = { 'AVAILABLE': 'available', 'BORROWED': 'borrowed', 'RESERVED': 'reserved', 'OWNED': 'owned' } as const;

const ManageBooksPage: React.FC = () => {
  const { books, addLocalBook, updateLocalBook, removeLocalBook } = useLibrary();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form, setForm] = useState({ title: '', author: '', b_year: '', count:'', price: '' });

  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  //  coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
  const openAdd = () => { setEditingBook(null); setForm({ title: '', author: '', b_year: '', count:'', price: '' }); setModalOpen(true); };
  const openEdit = (book: Book) => { setEditingBook(book); setForm({ title: book.title, author: book.author, b_year: String(book.b_year), count: String(book.count), price: String(book.price) }); setModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title: form.title, author: form.author, b_year: Number(form.b_year), count: Number(form.count), price: Number(form.price), borrowerId: null, reserverId: null, ownerId: null, status: null };
    if (editingBook) { const updated = await updateBook(editingBook.id, data); if (updated) { updateLocalBook(updated); toast({ title: 'Book updated' }); } }
    else { const created = await createBook(data); addLocalBook(created); toast({ title: 'Book added' }); }
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => { if (confirm('Delete this book?')) { await deleteBook(id); removeLocalBook(id); toast({ title: 'Book deleted' }); } };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Manage Books</h1>
        <Button variant="gold" onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Book</Button>
      </div>

      <div className="relative max-w-md mb-6"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>

      <div className="space-y-4">
        {filtered.map(book => (
          <Card key={book.id}><CardContent className="p-4 flex items-center gap-4">
            {/* <img src={book.coverImage} alt={book.title} className="w-12 h-16 object-cover rounded" /> */}
            <div className="flex-1"><h3 className="font-semibold">{book.title}</h3><p className="text-sm text-muted-foreground">{book.author}</p></div>
            <Badge variant={statusVariant[book.status]}>{book.status}</Badge>
            <Button variant="ghost" size="icon" onClick={() => openEdit(book)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(book.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </CardContent></Card>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div><Label>Author</Label><Input value={form.author} onChange={e => setForm({...form, author: e.target.value})} required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Price ($)</Label><Input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required /></div>
              <div><Label>Count</Label><Input type="number" step="1" value={form.count} onChange={e => setForm({...form, count: e.target.value})} required /></div>

            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Year</Label><Input type="number" value={form.b_year} onChange={e => setForm({...form, b_year: e.target.value})} /></div>
            </div>
            {/* <div><Label>Cover Image URL</Label><Input value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})} /></div> */}
            <div className="flex gap-3"><Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" variant="gold" className="flex-1">Save</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBooksPage;
