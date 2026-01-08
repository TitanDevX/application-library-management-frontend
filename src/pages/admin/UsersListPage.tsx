import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLibrary } from '@/context/LibraryContext';
import { fetchUsers } from '@/services/api';
import { useAdmin } from '@/context/AdminContext';

const UsersListPage: React.FC = () => {
  const { books,borrowings} = useLibrary();
  const {users} = useAdmin();

 

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-serif font-bold mb-8">Users</h1>
      <div className="space-y-4">
        {users.map(user => {
          const borrowed = borrowings.filter(b => b.user == user.id )
          return (
            <Card key={user.id}>
              <CardContent className="p-4 flex items-center gap-4">
             
                <div className="flex-1">
                  <h3 className="font-semibold">{user.username}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <span className="text-sm text-muted-foreground">{borrowed.length} borrowed</span>
                <Link to={`/admin/users/${user.id}/borrowings`}><Button variant="outline">View Borrowings</Button></Link>
                <Link to={`/admin/users/${user.id}/reservations`}><Button variant="outline">View Reservations</Button></Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UsersListPage;
