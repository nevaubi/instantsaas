
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

  const handleGoogleLogin = async () => {
    if (!consentChecked) {
      toast({
        title: "Consent Required",
        description: "Please agree to add your Google email to our newsletter to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Set flag to indicate this is a discount flow
      localStorage.setItem('discount_flow_active', 'true');
      
      console.log('Starting Google OAuth for discount flow');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        localStorage.removeItem('discount_flow_active');
        setIsLoading(false);
        toast({
          title: "Authentication Error",
          description: "Failed to authenticate with Google. Please try again.",
          variant: "destructive"
        });
      } else {
        // Close modal immediately since we're redirecting
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      localStorage.removeItem('discount_flow_active');
      setIsLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isDisabled = !consentChecked || isLoading;

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

          {/* Step 2: Consent and Google Login */}
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
                I agree to add my Google email address to Nevaubi's newsletter mailing list.
              </label>
            </div>

            {/* Google Login Button */}
            <Button 
              onClick={handleGoogleLogin}
              disabled={isDisabled}
              className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Login with Google</span>
                </>
              )}
            </Button>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-gray-600 text-center max-w-sm">
            You'll be redirected to Google for auth, then automatically to checkout for your 40% discount
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountModal;
