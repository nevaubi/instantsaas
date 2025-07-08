
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import TwoStepsSection from '../components/TwoStepsSection';
import FeaturesSection from '../components/FeaturesSection';
import PersonalBio from '../components/PersonalBio';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

const Index = () => {
  const [isProcessingDiscount, setIsProcessingDiscount] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthStateChange = async (event: string, session: any) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      // Check if this is a login event and discount flow is active
      if (event === 'SIGNED_IN' && session?.user) {
        const discountFlowActive = localStorage.getItem('discount_flow_active');
        console.log('Discount flow active:', discountFlowActive);
        
        if (discountFlowActive === 'true') {
          console.log('Processing discount authentication for user:', session.user.id);
          setIsProcessingDiscount(true);
          
          try {
            // Add timeout wrapper for edge function calls
            const withTimeout = (promise: Promise<any>, timeoutMs: number) => {
              return Promise.race([
                promise,
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
                )
              ]);
            };

            // Call process-discount-auth edge function with timeout
            console.log('Calling process-discount-auth...');
            const processPromise = supabase.functions.invoke('process-discount-auth', {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });
            
            const { data: processData, error: processError } = await withTimeout(processPromise, 15000);

            if (processError) {
              console.error('Error processing discount auth:', processError);
              throw processError;
            }

            console.log('Discount auth processed successfully:', processData);

            // Now create discount checkout with timeout
            console.log('Calling create-discount-checkout...');
            const checkoutPromise = supabase.functions.invoke('create-discount-checkout', {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });

            const { data: checkoutResponse, error: checkoutError } = await withTimeout(checkoutPromise, 15000);

            if (checkoutError) {
              console.error('Error creating discount checkout:', checkoutError);
              throw checkoutError;
            }

            console.log('Discount checkout response:', checkoutResponse);

            // Clean up localStorage flag
            localStorage.removeItem('discount_flow_active');

            // Extract checkout URL and redirect with multiple fallback methods
            const checkoutUrl = checkoutResponse?.url;
            console.log('Extracted checkout URL:', checkoutUrl);
            
            if (checkoutUrl) {
              console.log('Attempting to redirect to Stripe checkout:', checkoutUrl);
              
              // Method 1: Try opening in new tab first (works better with browser security)
              try {
                const newWindow = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
                if (!newWindow || newWindow.closed) {
                  throw new Error('Popup blocked');
                }
                console.log('Successfully opened checkout in new tab');
                setIsProcessingDiscount(false);
                toast({
                  title: "Redirecting to Checkout",
                  description: "Please complete your purchase in the new tab that opened.",
                });
                return;
              } catch (popupError) {
                console.log('New tab failed, trying same window redirect:', popupError);
              }
              
              // Method 2: Fallback to same window redirect
              try {
                window.location.href = checkoutUrl;
              } catch (redirectError) {
                console.error('Same window redirect failed:', redirectError);
                
                // Method 3: Last resort - show manual link
                setIsProcessingDiscount(false);
                toast({
                  title: "Checkout Ready",
                  description: "Click here to complete your purchase",
                  action: (
                    <button 
                      onClick={() => window.open(checkoutUrl, '_blank')}
                      className="bg-brand-orange text-white px-4 py-2 rounded"
                    >
                      Go to Checkout
                    </button>
                  )
                });
                return;
              }
            } else {
              console.error('No checkout URL found in response:', checkoutResponse);
              throw new Error('No checkout URL received from server');
            }

          } catch (error) {
            console.error('Error in discount flow:', error);
            localStorage.removeItem('discount_flow_active');
            setIsProcessingDiscount(false);
            
            // More specific error messages
            let errorMessage = "Failed to process your discount. Please try again.";
            if (error.message.includes('timeout')) {
              errorMessage = "Request timed out. This might be due to browser extensions interfering. Please try disabling ad blockers and try again.";
            } else if (error.message.includes('network')) {
              errorMessage = "Network error occurred. Please check your connection and try again.";
            }
            
            toast({
              title: "Discount Processing Failed",
              description: errorMessage,
              variant: "destructive",
            });
          }
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthStateChange('SIGNED_IN', session);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  return (
    <div className="min-h-screen bg-brand-white">
      {isProcessingDiscount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto mb-4"></div>
            <p className="text-brand-dark-gray mb-2">Processing your discount...</p>
            <p className="text-sm text-gray-600">This may take a few moments</p>
            <button 
              onClick={() => {
                localStorage.removeItem('discount_flow_active');
                setIsProcessingDiscount(false);
              }}
              className="mt-4 text-sm text-brand-orange hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <Navigation />
      <HeroSection />
      <TwoStepsSection />
      <FeaturesSection />
      <PersonalBio />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
