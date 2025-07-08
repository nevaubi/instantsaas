
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";

const queryClient = new QueryClient();

const App = () => {
  // Handle discount flow after Twitter auth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('App-level auth state change:', event, session?.user?.email);
      
      // Check if this is a Twitter login for discount flow
      const isDiscountFlow = localStorage.getItem('discount_flow_active') === 'true';
      
      if (event === 'SIGNED_IN' && session?.user && isDiscountFlow) {
        console.log('Processing discount flow from app level');
        
        // Clear the flag immediately to prevent duplicate processing
        localStorage.removeItem('discount_flow_active');
        
        try {
          // Step 1: Record the user in discounted_users table
          console.log('Calling process-discount-auth function');
          const { data: authData, error: authError } = await supabase.functions.invoke('process-discount-auth');
          
          if (authError) {
            console.error('Error recording discount user:', authError);
            return;
          }

          console.log('User recorded successfully:', authData);

          // Step 2: Create Stripe checkout session
          console.log('Calling create-discount-checkout function');
          const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-discount-checkout');
          
          if (checkoutError) {
            console.error('Error creating checkout session:', checkoutError);
            return;
          }

          console.log('Checkout session created:', checkoutData);

          // Redirect to Stripe checkout
          if (checkoutData?.url) {
            console.log('Redirecting to Stripe checkout');
            window.location.href = checkoutData.url;
          } else {
            console.error('No checkout URL received');
          }

        } catch (error) {
          console.error('Error in app-level discount flow:', error);
          localStorage.removeItem('discount_flow_active');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/checkout-cancel" element={<CheckoutCancel />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
