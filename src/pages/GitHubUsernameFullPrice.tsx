
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const GitHubUsernameFullPrice = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [githubUsername, setGithubUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle both parameter formats: order_id (from email) and orderId (legacy)
  const email = searchParams.get('email');
  const orderId = searchParams.get('order_id') || searchParams.get('orderId');

  useEffect(() => {
    if (!email || !orderId) {
      setError('Invalid setup link. Please check your email for the correct link.');
    }
  }, [email, orderId]);

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

  const handleUsernameChange = (value: string) => {
    setGithubUsername(value);
    setValidationError(validateGitHubUsername(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !orderId) {
      setError('Invalid setup link');
      return;
    }

    const validation = validateGitHubUsername(githubUsername);
    if (validation) {
      setValidationError(validation);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting GitHub username for full-price order:', { email, orderId, githubUsername });
      
      const { data, error: submitError } = await supabase.functions.invoke('submit-github-username-fullprice', {
        body: {
          email,
          orderId,
          githubUsername,
        },
      });

      if (submitError) {
        console.error('Edge function error:', submitError);
        throw new Error(submitError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit GitHub username');
      }

      console.log('GitHub username submitted successfully:', data);
      setSuccess(true);
      
      toast({
        title: "Success!",
        description: "GitHub username saved successfully. Repository invitation will be sent shortly.",
      });
    } catch (err) {
      console.error('Error submitting GitHub username:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navigation />
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
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
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
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Github className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">GitHub Repo Access</h1>
            <p className="text-gray-600">
              Enter your GitHub username to receive your private SaaS template repository
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Username
              </label>
              <Input
                id="githubUsername"
                type="text"
                value={githubUsername}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="Enter your GitHub username"
                className={`w-full ${validationError ? 'border-red-300' : ''}`}
                disabled={isLoading}
              />
              {validationError && (
                <p className="text-red-600 text-sm mt-1">{validationError}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Example: octocat (just the username, not the full URL)
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !!validationError || !githubUsername.trim()}
              className="w-full"
            >
              {isLoading ? (
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
      </div>
    </>
  );
};

export default GitHubUsernameFullPrice;
