export type PaymentType = 'borrow' | 'reserve' | 'purchase';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface Payment {
  id: string;
  userId: string;
  bookId: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  cardLast4: string;
  createdAt: string;
}

export const mockPayments: Payment[] = [
  {
    id: 'pay1',
    userId: '2',
    bookId: '3',
    type: 'borrow',
    amount: 2.29,
    status: 'success',
    cardLast4: '4242',
    createdAt: '2024-12-20T10:00:00Z'
  },
  {
    id: 'pay2',
    userId: '2',
    bookId: '8',
    type: 'purchase',
    amount: 13.99,
    status: 'success',
    cardLast4: '4242',
    createdAt: '2024-11-15T14:30:00Z'
  },
  {
    id: 'pay3',
    userId: '3',
    bookId: '5',
    type: 'reserve',
    amount: 0.79,
    status: 'success',
    cardLast4: '1234',
    createdAt: '2024-12-25T09:15:00Z'
  }
];

// Simulated payment processing
export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  amount: number;
  type: PaymentType;
  userId: string;
  bookId: string;
  operation_id: string;
  method: string;
}

export const simulatePayment = (data: PaymentData): Promise<{ success: boolean; paymentId?: string; error?: string }> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate validation
      if (data.cardNumber.replace(/\s/g, '').length !== 16) {
        resolve({ success: false, error: 'Invalid card number' });
        return;
      }
      
      if (!data.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        resolve({ success: false, error: 'Invalid expiry date format' });
        return;
      }
      
      if (data.cvv.length !== 3) {
        resolve({ success: false, error: 'Invalid CVV' });
        return;
      }
      
      // Simulate 90% success rate for demo
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        const paymentId = `pay_${Date.now()}`;
        resolve({ success: true, paymentId });
      } else {
        resolve({ success: false, error: 'Payment declined. Please try again.' });
      }
    }, 1500);
  });
};
