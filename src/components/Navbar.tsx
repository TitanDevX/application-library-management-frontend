import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  User, 
  LogOut, 
  LayoutDashboard,
  Users,
  BookMarked,
  ShoppingBag,
  Clock,
  Home,
  Search
} from 'lucide-react';

interface NavbarProps {
  type: 'public' | 'user' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({ type }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-accent" />
          <span className="font-serif text-xl font-bold">LibraryMS</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {type === 'public' && (
            <>
              <Link 
                to="/" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent ${isActive('/') ? 'text-accent' : ''}`}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link 
                to="/books" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent ${isActive('/books') ? 'text-accent' : ''}`}
              >
                <Search className="h-4 w-4" />
                Browse Books
              </Link>
            </>
          )}

          {type === 'user' && (
            <>
              <Link 
                to="/user" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent ${isActive('/user') ? 'text-accent' : ''}`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                to="/books" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent ${isActive('/books') ? 'text-accent' : ''}`}
              >
                <Search className="h-4 w-4" />
                Browse
              </Link>
              <Link 
                to="/user/borrowed" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent ${isActive('/user/borrowed') ? 'text-accent' : ''}`}
              >
                <Clock className="h-4 w-4" />
                Borrowed
              </Link>
              <Link 
                to="/user/reserved" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent ${isActive('/user/reserved') ? 'text-accent' : ''}`}
              >
                <BookMarked className="h-4 w-4" />
                Reserved
              </Link>
              <Link 
                to="/user/purchased" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent ${isActive('/user/purchased') ? 'text-accent' : ''}`}
              >
                <ShoppingBag className="h-4 w-4" />
                Purchased
              </Link>
            </>
          )}

          {type === 'admin' && (
            <>
              <Link 
                to="/admin" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent ${isActive('/admin') ? 'text-accent' : ''}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                to="/admin/books" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent ${isActive('/admin/books') ? 'text-accent' : ''}`}
              >
                <BookOpen className="h-4 w-4" />
                Manage Books
              </Link>
              <Link 
                to="/admin/users" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent ${isActive('/admin/users') ? 'text-accent' : ''}`}
              >
                <Users className="h-4 w-4" />
                Users
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm">
               
                <span className="font-medium">{user.username}</span>
              </div>
             
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="gold" onClick={() => navigate('/login')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
