
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Twitter, Mail } from 'lucide-react';

interface DiscountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DiscountModal = ({ open, onOpenChange }: DiscountModalProps) => {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend only for now - will add backend integration later
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-w-[90vw] bg-brand-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-dark-gray text-center mb-6">
            Get Your <span className="text-brand-orange">40% Discount</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Twitter Follow Section */}
          <div className="flex flex-col items-center space-y-4 p-6 border border-gray-200 rounded-xl bg-brand-white">
            <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center">
              <Twitter className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-brand-dark-gray text-center">
              Follow on X
            </h3>
            <p className="text-brand-dark-gray text-center">
              Please follow for discount
            </p>
            <Button 
              asChild
              className="w-full btn-primary py-3 rounded-lg font-semibold"
            >
              <a 
                href="https://x.com/itsfiras1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2"
              >
                <Twitter className="h-5 w-5" />
                <span>Follow @itsfiras1</span>
              </a>
            </Button>
          </div>

          {/* Newsletter Signup Section */}
          <div className="flex flex-col space-y-4 p-6 border border-gray-200 rounded-xl bg-brand-white">
            <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-brand-dark-gray text-center">
              Subscribe to Newsletter
            </h3>
            <p className="text-brand-dark-gray text-center">
              Subscribe to Nevaubi Newsletter
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                required
              />
              <Button 
                type="submit"
                className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
              >
                <Mail className="h-5 w-5" />
                <span>Subscribe</span>
              </Button>
            </form>
          </div>
        </div>

        <div className="px-6 pb-6">
          <p className="text-sm text-gray-600 text-center">
            Complete both steps above to unlock your 40% discount and get InstantSaaS for just $39!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountModal;
