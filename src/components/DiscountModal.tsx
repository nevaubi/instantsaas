
import React, { useState } from 'react';
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Twitter OAuth error:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to authenticate with Twitter. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-w-[90vw] bg-brand-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-dark-gray text-center mb-6">
            Get Your <span className="text-brand-orange">40% Discount</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 p-6">
          {/* Twitter Icon */}
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
            <Twitter className="h-10 w-10 text-white" />
          </div>

          {/* Main Text */}
          <div className="text-center space-y-3">
            <h3 className="text-xl font-semibold text-brand-dark-gray">
              Login with Twitter for Instant Discount
            </h3>
            <p className="text-brand-dark-gray max-w-sm">
              Authenticate with your Twitter account to unlock 40% off InstantSaaS and get it for just $39!
            </p>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start space-x-3 w-full max-w-sm">
            <Checkbox
              id="consent"
              checked={consentChecked}
              onCheckedChange={setConsentChecked}
              className="mt-1"
            />
            <label 
              htmlFor="consent" 
              className="text-sm text-brand-dark-gray leading-relaxed cursor-pointer"
            >
              I agree to add my Twitter email address to the Nevaubi newsletter to receive updates and the discount code.
            </label>
          </div>

          {/* Twitter Login Button */}
          <Button 
            onClick={handleTwitterLogin}
            disabled={!consentChecked || isLoading}
            className="w-full max-w-sm bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
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

          {/* Footer Text */}
          <p className="text-xs text-gray-600 text-center max-w-sm">
            By continuing, you'll be redirected to Twitter for authentication. Your discount will be applied automatically after successful login.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountModal;
