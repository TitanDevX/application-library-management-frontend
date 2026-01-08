import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LibraryProvider } from "@/context/LibraryContext";
import { PublicLayout, UserLayout, AdminLayout } from "@/components/layouts";
import HomePage from "@/pages/HomePage";
import BooksListPage from "@/pages/BooksListPage";
import BookDetailsPage from "@/pages/BookDetailsPage";
import LoginPage from "@/pages/LoginPage";
import UserDashboard from "@/pages/user/UserDashboard";
import MyBorrowedPage from "@/pages/user/MyBorrowedPage";
import MyReservedPage from "@/pages/user/MyReservedPage";
import MyPurchasedPage from "@/pages/user/MyPurchasedPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageBooksPage from "@/pages/admin/ManageBooksPage";
import UsersListPage from "@/pages/admin/UsersListPage";
import UserBorrowingsPage from "@/pages/admin/UserBorrowingsPage";
import NotFound from "./pages/NotFound";
import { AdminProvider } from "./context/AdminContext";
import UserReservationsPage from "./pages/admin/UserReservations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LibraryProvider>
        <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BooksListPage />} />
                <Route path="/books/:id" element={<BookDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Route>
              
              {/* User Routes */}
              <Route path="/user" element={<UserLayout />}>
                <Route index element={<UserDashboard />} />
                <Route path="borrowed" element={<MyBorrowedPage />} />
                <Route path="reserved" element={<MyReservedPage />} />
                <Route path="purchased" element={<MyPurchasedPage />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="books" element={<ManageBooksPage />} />
                <Route path="users" element={<UsersListPage />} />
                <Route path="users/:userId/borrowings" element={<UserBorrowingsPage />} />
                <Route path="users/:userId/reservations" element={<UserReservationsPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </AdminProvider>
      </LibraryProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
