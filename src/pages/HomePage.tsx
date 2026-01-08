import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, CreditCard, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      console.log(`IS ${user?.is_staff}`)
      navigate(user?.is_staff ? '/admin' : '/user');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative library-gradient py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920')] bg-cover bg-center opacity-10" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6 animate-fade-in">
              Your Gateway to <span className="text-gradient">Knowledge</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Discover, borrow, and own books from our extensive collection. 
              A modern library management system designed for the digital age.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Button size="xl" variant="gold" onClick={handleGetStarted}>
                {isAuthenticated ? "Dashboard" : "Get started"}
                
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="xl" variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20" onClick={() => navigate('/books')}>
                Browse Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive library management solution with features for both users and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Vast Collection"
              description="Access thousands of books across various genres and topics."
            />
            <FeatureCard
              icon={<CreditCard className="h-8 w-8" />}
              title="Easy Payments"
              description="Secure payment processing for borrowing, reserving, and purchasing."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="User Management"
              description="Complete user and borrowing management for administrators."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Secure & Reliable"
              description="Built with security and reliability as top priorities."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-library-lg text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Ready to Start Reading?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join our library today and get access to our entire collection.
              Borrow, reserve, or buy books with just a few clicks.
            </p>
            <Button size="lg" variant="gold" onClick={handleGetStarted}>
              Join Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description
}) => (
  <div className="bg-card rounded-xl p-6 shadow-library card-hover">
    <div className="w-14 h-14 rounded-lg gold-gradient flex items-center justify-center text-accent-foreground mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-serif font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default HomePage;
