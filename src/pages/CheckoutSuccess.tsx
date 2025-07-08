
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const updateSubscriptionStatus = async () => {
      if (!sessionId) return;
      
      setIsUpdating(true);
      try {
        // Update the subscription status to 'active' for successful payment
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('discounted_users')
            .update({ 
              subscribe_status: 'active',
              updated_at: new Date().toISOString() 
            })
            .eq('user_id', user.id)
            .eq('stripe_checkout_session_id', sessionId);
          
          if (error) {
            console.error('Error updating subscription status:', error);
          } else {
            console.log('Successfully updated subscription status to active');
          }
        }
      } catch (error) {
        console.error('Error in updateSubscriptionStatus:', error);
      } finally {
        setIsUpdating(false);
      }
    };

    updateSubscriptionStatus();
  }, [sessionId]);

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
          Congratulations! Your 40% discount purchase was successful. You now have access to the discounted product.
        </p>
        
        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Session ID:</p>
            <p className="text-xs font-mono text-gray-800 break-all">{sessionId}</p>
          </div>
        )}
        
        {isUpdating && (
          <p className="text-sm text-blue-600 mb-4">Updating your account...</p>
        )}
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/" className="flex items-center justify-center space-x-2">
              <span>Return to Homepage</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          
          <p className="text-xs text-gray-500">
            You should receive a confirmation email shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
