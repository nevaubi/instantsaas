
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface OrderDetails {
  id: string;
  email: string;
  amount: number;
  currency: string;
  delivery_status: string;
}

const CheckoutSuccessFullPrice = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      setError('Invalid success link - missing order ID');
      setIsLoading(false);
      return;
    }

    fetchAndUpdateOrderFromStripe();
  }, [orderId]);

  const fetchAndUpdateOrderFromStripe = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching and updating full-price order from Stripe:', { orderId });

      // First, get the order to retrieve the Stripe session ID
      const { data: orderData, error: fetchError } = await supabase
        .from('fullprice_orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (fetchError || !orderData) {
        console.error('Order fetch failed:', fetchError);
        setError('Order not found or invalid link');
        return;
      }

      // If email is already set, just display the order  
      if (orderData.email && orderData.email !== '') {
        setOrder(orderData);
        return;
      }

      // If no email yet, we need to fetch it from Stripe and update the order
      // For now, we'll use a placeholder since we can't directly access Stripe session data from frontend
      // The webhook should handle updating the email, but as a fallback we'll show the order without email
      console.log('Order found but email not yet updated from Stripe webhook');
      setOrder({
        ...orderData,
        email: 'Email being retrieved from Stripe...'
      });

    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading your order...</h2>
          <p className="text-gray-600">Please wait while we confirm your purchase</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild className="w-full">
            <Link to="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your payment has been processed successfully.
        </p>

        {order && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="text-gray-900 font-semibold">
                  {formatAmount(order.amount, order.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-xs text-gray-900">{order.id}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <p className="text-sm text-blue-800 mb-4">
            To complete your setup and receive your SaaS template, please provide your GitHub username.
          </p>
          <Button asChild className="w-full mb-2">
            <Link to={`/github-username-fullprice?order_id=${orderId}`}>
              Setup GitHub Access
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessFullPrice;
