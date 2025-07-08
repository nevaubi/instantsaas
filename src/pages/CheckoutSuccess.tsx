
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      if (!sessionId || processingComplete) return;
      
      setIsProcessing(true);
      try {
        console.log('Calling discounted-users-payment-success function with session:', sessionId);
        
        const { data, error } = await supabase.functions.invoke('discounted-users-payment-success', {
          body: { sessionId }
        });
        
        if (error) {
          console.error('Error processing payment success:', error);
          setError('Failed to process payment. Please contact support.');
        } else {
          console.log('Payment processing completed successfully:', data);
          setProcessingComplete(true);
        }
      } catch (error) {
        console.error('Error in processPaymentSuccess:', error);
        setError('An unexpected error occurred. Please contact support.');
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentSuccess();
  }, [sessionId, processingComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Congratulations! Your 40% discount purchase was successful. 
          {processingComplete ? (
            " Your template delivery has been initiated and you should receive it shortly."
          ) : (
            " We're processing your order and setting up template delivery."
          )}
        </p>
        
        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Session ID:</p>
            <p className="text-xs font-mono text-gray-800 break-all">{sessionId}</p>
          </div>
        )}
        
        {isProcessing && (
          <p className="text-sm text-blue-600 mb-4">Processing your order and setting up delivery...</p>
        )}
        
        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}
        
        {processingComplete && (
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700 font-medium">
              ✅ Order processed successfully! Template delivery initiated.
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/" className="flex items-center justify-center space-x-2">
              <span>Return to Homepage</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          
          <p className="text-xs text-gray-500">
            You should receive a confirmation email and template delivery details shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
