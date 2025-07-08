
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle, Github } from 'lucide-react';
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

const GitHubUsernameFullPrice = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Handle both parameter formats: order_id (from email) and orderId (legacy)
  const email = searchParams.get('email');
  const orderId = searchParams.get('order_id') || searchParams.get('orderId');

  useEffect(() => {
    if (!email || !orderId) {
      setError('Invalid setup link. Please check your email for the correct link.');
      setIsLoading(false);
      return;
    }

    verifyOrder();
  }, [email, orderId]);

  const verifyOrder = async () => {
    try {
      setIsLoading(true);
      console.log('Verifying full-price order:', { email, orderId });

      const { data, error: fetchError } = await supabase
        .from('fullprice_orders')
        .select('*')
        .eq('id', orderId)
        .eq('email', email)
        .single();

      if (fetchError || !data) {
        console.error('Order verification failed:', fetchError);
        setError('Order not found or email mismatch. Please check your email for the correct link.');
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

  const validateGitHubUsername = (username: string) => {
    if (!username) {
      return 'GitHub username is required';
    }
    
    if (username.length < 1 || username.length > 39) {
      return 'GitHub username must be between 1 and 39 characters';
    }
    
    const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!githubUsernameRegex.test(username)) {
      return 'Invalid GitHub username format. Only alphanumeric characters and hyphens are allowed, and it cannot start or end with a hyphen.';
    }
    
    return null;
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

    const validation = validateGitHubUsername(githubUsername);
    if (validation) {
      toast({
        title: "Invalid Username",
        description: validation,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting GitHub username for full-price order:', { email, orderId, githubUsername });
      
      // Update the order with GitHub username directly
      const { data, error } = await supabase
        .from('fullprice_orders')
        .update({ 
          github_username: githubUsername,
          delivery_status: 'github_collected',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('email', email)
        .select()
        .single();

      if (error) {
        console.error('Error updating full-price order:', error);
        toast({
          title: "Submission Failed",
          description: error.message || "Failed to save GitHub username. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('GitHub username submitted successfully for full-price order:', data);
      setIsComplete(true);
      setOrder(data);
      
      toast({
        title: "Success!",
        description: "GitHub username saved successfully. Repository invitation will be sent shortly.",
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Setup Complete!</h1>
          <p className="text-gray-600 mb-6">
            Your GitHub username has been saved successfully. Your private repository invite will be sent shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">GitHub Username:</p>
            <p className="font-mono text-lg font-semibold text-gray-900">{githubUsername}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You'll receive an invite to the private repository via the email linked to your GitHub username</li>
              <li>• Accept the invite, and you'll be added as a repo collaborator</li>
              <li>• You'll also receive setup instructions and documentation via email</li>
              <li>• Enjoy unlimited access to your production-ready SaaS boilerplate!</li>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GitHub Repo Access</h1>
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
              'Save GitHub Username'
            )}
          </Button>
        </form>

        <div className="bg-blue-50 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You'll receive a private repo invite via the email linked to your GitHub username</li>
            <li>• Accept the invite, and you'll be added as a repo collaborator</li>
            <li>• You'll also be emailed setup instructions and documentation</li>
            <li>• Enjoy unlimited access to your new production-ready SaaS boilerplate!</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    );
  };

export default GitHubUsernameFullPrice;
