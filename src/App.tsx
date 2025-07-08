
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutSuccessFullPrice from "./pages/CheckoutSuccessFullPrice";
import CheckoutCancel from "./pages/CheckoutCancel";
import GitHubUsername from "./pages/GitHubUsername";
import GitHubUsernameFullPrice from "./pages/GitHubUsernameFullPrice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/checkout-success-fullprice" element={<CheckoutSuccessFullPrice />} />
          <Route path="/checkout-cancel" element={<CheckoutCancel />} />
          <Route path="/github-username" element={<GitHubUsername />} />
          <Route path="/github-username-fullprice" element={<GitHubUsernameFullPrice />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
