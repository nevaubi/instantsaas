
import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CheckoutCancel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Your payment was cancelled. No charges have been made to your account. You can try again anytime to get your 40% discount.
        </p>
        
        <div className="space-y-4">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link to="/" className="flex items-center justify-center space-x-2">
              <RotateCcw className="h-4 w-4" />
              <span>Try Again</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link to="/" className="flex items-center justify-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Homepage</span>
            </Link>
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          Need help? Contact our support team.
        </p>
      </div>
    </div>
  );
};

export default CheckoutCancel;
