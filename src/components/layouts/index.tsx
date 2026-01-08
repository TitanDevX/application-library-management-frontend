import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '../ui/loading';
import { AdminProvider } from '@/context/AdminContext';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar type="public" />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © 2025 LibraryMS. A University  Project.
        </div>
      </footer>
    </div>
  );
};

export const UserLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.is_staff) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar type="user" />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated,authLoading } = useAuth();
  
  if (authLoading) {
  return <Loading size={48}></Loading>
}
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.is_staff) {
    return <Navigate to="/user" replace />;
  }

  return (
    
    <div className="min-h-screen flex flex-col">
      <AdminProvider>
      <Navbar type="admin" />
      <main className="flex-1 bg-muted/30">
        <Outlet />
      </main>
      </AdminProvider>
    </div>
  );
};
