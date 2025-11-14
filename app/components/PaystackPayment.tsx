"use client";

import { useState } from 'react';

interface PaystackPaymentProps {
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
  onSuccess?: (reference: string) => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function PaystackPayment({
  amount,
  currency = 'NGN',
  metadata,
  onSuccess,
  onCancel,
  children,
  className = '',
}: PaystackPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Initialize payment
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to initialize payment');
      }

      // Redirect to Paystack checkout
      if (result.data?.authorization_url) {
        // Store reference in session storage for verification later
        sessionStorage.setItem('paystack_reference', result.data.reference);

        // Redirect to Paystack payment page
        window.location.href = result.data.authorization_url;
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {children ? (
        <div onClick={handlePayment} className={loading ? 'opacity-50 pointer-events-none' : ''}>
          {children}
        </div>
      ) : (
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Initializing payment...' : `Pay ₦${amount.toLocaleString()}`}
        </button>
      )}
    </div>
  );
}
