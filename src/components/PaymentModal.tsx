import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { PaymentType } from '@/models/payments';
import { processPayment } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookTitle: string;
  bookId: string;
  amount: number;
  type: PaymentType;
  op_id: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  bookTitle,
  bookId,
  amount,
  type,
  op_id,
}) => {
  const { user } = useAuth();
  const [method, setMethod] = useState<'credit_card' | 'paypal' | 'cash'>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) parts.push(match.substring(i, i + 4));
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2, 4);
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setStatus('idle');

    const result = await processPayment({
      cardNumber: method === 'credit_card' ? cardNumber : undefined,
      expiryDate: method === 'credit_card' ? expiryDate : undefined,
      cvv: method === 'credit_card' ? cvv : undefined,
      cardholderName: method === 'credit_card' ? cardholderName : undefined,
      amount,
      type,
      userId: user.id,
      bookId,
      operation_id: op_id,
      method
    });

    setLoading(false);

    console.log(result);
    if (result) {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
        resetForm();
      }, 1500);
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Payment failed');
    }
  };

  const resetForm = () => {
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
    setStatus('idle');
    setErrorMessage('');
  };

  const getActionLabel = () => {
    switch (type) {
      case 'borrow': return 'Borrow';
      case 'reserve': return 'Reserve';
      case 'purchase': return 'Purchase';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <CreditCard className="h-5 w-5 text-accent" />
            Payment Required
          </DialogTitle>
          <DialogDescription>
            Complete payment to {getActionLabel().toLowerCase()} "{bookTitle}"
          </DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="py-8 text-center animate-scale-in">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">Your {type} has been processed.</p>
          </div>
        ) : status === 'error' ? (
          <div className="py-8 text-center animate-scale-in">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <Button variant="outline" onClick={() => setStatus('idle')}>Try Again</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-accent">${Number(amount).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="flex gap-3">
                {['credit_card', 'paypal', 'cash'].map((m) => (
                  <Button
                    key={m}
                    type="button"
                    variant={method === m ? 'gold' : 'outline'}
                    onClick={() => setMethod(m as 'credit_card' | 'paypal' | 'cash')}
                  >
                    {m.replace('_', ' ').toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Show credit card fields only if credit_card is selected */}
            {method === 'credit_card' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Smith"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
              <Lock className="h-4 w-4" />
              <span>This is a simulated payment. No real charges will be made.</span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" className="flex-1" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay $${Number(amount).toFixed(2)}`}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
