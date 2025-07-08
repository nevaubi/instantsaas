import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle, ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderDetails {
  id: string;
  email: string;
  amount: number;
  currency: string;
  delivery_status: string;
  github_username?: string;
}

const GitHubUsername = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const email = searchParams.get('email');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!email || !orderId) {
      setError('Invalid link - missing email or order ID');
      setIsLoading(false);
      return;
    }

    verifyOrder();
  }, [email, orderId]);

  const verifyOrder = async () => {
    try {
      setIsLoading(true);
      console.log('Verifying order:', { email, orderId });

      const { data, error: fetchError } = await supabase
        .from('discounted_users')
        .select('*')
        .eq('id', orderId)
        .eq('email', email)
        .single();

      if (fetchError || !data) {
        console.error('Order verification failed:', fetchError);
        setError('Order not found or invalid link');
        return;
      }

      setOrder(data);
      
      // If GitHub username is already provided, show completion state
      if (data.github_username) {
        setIsComplete(true);
        setGithubUsername(data.github_username);
      }
    } catch (err) {
      console.error('Error verifying order:', err);
      setError('Failed to verify order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!githubUsername.trim()) {
      toast({
        title: "Error",
        description: "Please enter your GitHub username",
        variant: "destructive",
      });
      return;
    }

    // Validate GitHub username format
    const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!githubUsernameRegex.test(githubUsername)) {
      toast({
        title: "Invalid Username",
        description: "Please enter a valid GitHub username (only letters, numbers, and hyphens allowed)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting GitHub username:', { email, orderId, githubUsername });
      
      const { data, error } = await supabase.functions.invoke('submit-github-username', {
        body: { email, orderId, githubUsername }
      });

      if (error) {
        console.error('Error submitting GitHub username:', error);
        toast({
          title: "Submission Failed",
          description: error.message || "Failed to save GitHub username. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('GitHub username submitted successfully:', data);
      setIsComplete(true);
      setOrder(data.order);
      
      toast({
        title: "Success!",
        description: "GitHub username saved successfully. Repository creation has been initiated.",
      });
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying your order...</h2>
          <p className="text-gray-600">Please wait while we confirm your purchase</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild className="w-full">
            <Link to="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Username Saved!</h1>
          <p className="text-gray-600 mb-6">
            You've been invited for access to the boilerplate repo! Note: The invite will be via the linked GitHub email of your username's account.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">GitHub Username:</p>
            <p className="font-mono text-lg font-semibold text-gray-900">{githubUsername}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You've been sent setup instructions & docs (to the same email as your first email, for the username input form)</li>
              <li>• You'll receive an email invitation to collaborate</li>
              <li>• Enjoy your prod-ready SaaS boilerplate, always feel free to connect and update on shipping progress!</li>
            </ul>
          </div>

          <Button asChild className="w-full">
            <Link to="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Github className="h-16 w-16 text-gray-700 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Your GitHub</h1>
          <p className="text-gray-600">
            Enter your GitHub username to receive your private SaaS template repository
          </p>
        </div>

        {order && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900">{order.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="text-gray-900 font-semibold">
                  {formatAmount(order.amount, order.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-xs text-gray-900">{order.id}</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Username
            </label>
            <Input
              id="githubUsername"
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="Enter your GitHub username"
              className="w-full"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: octocat (just the username, not the full URL)
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !githubUsername.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                Save GitHub Username
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GitHubUsername;
