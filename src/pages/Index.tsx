
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
            // Call process-discount-auth edge function
            console.log('Calling process-discount-auth...');
            const { data: processData, error: processError } = await supabase.functions.invoke('process-discount-auth', {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });

            if (processError) {
              console.error('Error processing discount auth:', processError);
              throw processError;
            }

            console.log('Discount auth processed successfully:', processData);

            // Now create discount checkout
            console.log('Calling create-discount-checkout...');
            const { data: checkoutResponse, error: checkoutError } = await supabase.functions.invoke('create-discount-checkout', {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });

            if (checkoutError) {
              console.error('Error creating discount checkout:', checkoutError);
              throw checkoutError;
            }

            console.log('Discount checkout response:', checkoutResponse);

            // Clean up localStorage flag
            localStorage.removeItem('discount_flow_active');

            // Redirect to Stripe checkout - the URL is in the response data
            const checkoutUrl = checkoutResponse?.url;
            console.log('Extracted checkout URL:', checkoutUrl);
            
            if (checkoutUrl) {
              console.log('Redirecting to Stripe checkout:', checkoutUrl);
              window.location.href = checkoutUrl;
            } else {
              console.error('No checkout URL found in response:', checkoutResponse);
              throw new Error('No checkout URL received from server');
            }

          } catch (error) {
            console.error('Error in discount flow:', error);
            localStorage.removeItem('discount_flow_active');
            setIsProcessingDiscount(false);
            
            toast({
              title: "Discount Processing Failed",
              description: error.message || "Failed to process your discount. Please try again.",
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
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto mb-4"></div>
            <p className="text-brand-dark-gray">Processing your discount...</p>
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
