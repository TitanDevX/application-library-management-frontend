import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login,user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(email, password);
    
    setLoading(false);
    
    if (success) {
      toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
      // Check user role and redirect accordingly
      if (user?.is_staff) {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } else {
      toast({ 
        title: 'Login failed', 
        description: 'Invalid credentials.',
        variant: 'destructive'
      });
    }
  };

 

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-accent-foreground" />
          </div>
          <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
          <CardDescription>Sign in to your library account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="gold" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

      
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
