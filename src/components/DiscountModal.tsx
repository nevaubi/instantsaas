
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
    
    try {
      // Set flag to indicate this is a discount flow
      localStorage.setItem('discount_flow_active', 'true');
      
      console.log('Starting Twitter OAuth for discount flow');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Twitter OAuth error:', error);
        localStorage.removeItem('discount_flow_active');
        setIsLoading(false);
        toast({
          title: "Authentication Error",
          description: "Failed to authenticate with Twitter. Please try again.",
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
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Authenticating...</span>
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
