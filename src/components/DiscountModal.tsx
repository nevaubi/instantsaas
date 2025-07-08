
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Twitter, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface DiscountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DiscountModal = ({ open, onOpenChange }: DiscountModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [authState, setAuthState] = useState<'idle' | 'authenticating' | 'processing' | 'redirecting'>('idle');
  const { toast } = useToast();

  const handleConsentChange = (checked: boolean | "indeterminate") => {
    setConsentChecked(checked === true);
  };

  // Load Twitter widgets when modal opens
  useEffect(() => {
    if (open && window.twttr?.widgets) {
      window.twttr.widgets.load();
    }
  }, [open]);

  // Listen for auth state changes after Twitter login
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user && authState === 'authenticating') {
        setAuthState('processing');
        await processDiscountFlow(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [authState]);

  const processDiscountFlow = async (user: any) => {
    try {
      console.log('Processing discount flow for user:', user.email);
      
      // Step 1: Record the user in discounted_users table
      const { data: authData, error: authError } = await supabase.functions.invoke('process-discount-auth');
      
      if (authError) {
        console.error('Error recording discount user:', authError);
        throw new Error('Failed to record discount user');
      }

      console.log('User recorded successfully:', authData);

      // Step 2: Create Stripe checkout session
      setAuthState('redirecting');
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-discount-checkout');
      
      if (checkoutError) {
        console.error('Error creating checkout session:', checkoutError);
        throw new Error('Failed to create checkout session');
      }

      console.log('Checkout session created:', checkoutData);

      // Close modal and redirect to Stripe
      onOpenChange(false);
      
      if (checkoutData?.url) {
        // Open Stripe checkout in the same tab
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Error in discount flow:', error);
      setAuthState('idle');
      setIsLoading(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleTwitterLogin = async () => {
    if (!consentChecked) {
      toast({
        title: "Consent Required",
        description: "Please agree to add your Twitter email to our newsletter to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setAuthState('authenticating');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Twitter OAuth error:', error);
        setAuthState('idle');
        setIsLoading(false);
        toast({
          title: "Authentication Error",
          description: "Failed to authenticate with Twitter. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthState('idle');
      setIsLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getButtonText = () => {
    switch (authState) {
      case 'authenticating':
        return 'Authenticating...';
      case 'processing':
        return 'Processing...';
      case 'redirecting':
        return 'Redirecting to checkout...';
      default:
        return 'Login with Twitter';
    }
  };

  const isDisabled = !consentChecked || isLoading || authState !== 'idle';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] max-w-[90vw] bg-brand-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-dark-gray text-center mb-2">
            Get Your <span className="text-brand-orange">40% Discount</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 p-6">
          {/* Twitter Icon */}
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <Twitter className="h-8 w-8 text-white" />
          </div>

          {/* Main Text */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-brand-dark-gray">
              Follow & Login for Instant Discount
            </h3>
          </div>

          {/* Step 1: Twitter Follow Button */}
          <div className="w-full relative">
            {/* Step 1 Badge */}
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
            </div>
            
            <div className="flex justify-center w-full">
              <div 
                dangerouslySetInnerHTML={{
                  __html: `<a href="https://twitter.com/itsfiras1" class="twitter-follow-button" data-show-count="false" data-size="large">Follow @itsfiras1</a>`
                }}
              />
            </div>
          </div>

          {/* Step 2: Consent and Login */}
          <div className="w-full space-y-4">
            {/* Step 2 Badge */}
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start space-x-3 w-full">
              <Checkbox
                id="consent"
                checked={consentChecked}
                onCheckedChange={handleConsentChange}
                className="mt-1"
              />
              <label 
                htmlFor="consent" 
                className="text-sm text-brand-dark-gray leading-relaxed cursor-pointer flex-1"
              >
                I agree to add my linked X (Twitter) email address to Nevaubi's newsletter mailing list.
              </label>
            </div>

            {/* Twitter Login Button */}
            <Button 
              onClick={handleTwitterLogin}
              disabled={isDisabled}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
            >
              {isLoading || authState !== 'idle' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{getButtonText()}</span>
                </>
              ) : (
                <>
                  <Twitter className="h-5 w-5" />
                  <span>Login with Twitter</span>
                </>
              )}
            </Button>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-gray-600 text-center max-w-sm">
            You'll be redirected to X (Twitter) for auth, then automatically to checkout for your 40% discount
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountModal;
