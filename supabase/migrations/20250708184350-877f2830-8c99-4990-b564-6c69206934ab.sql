
-- Create discounted_users table to track users who get the discount
CREATE TABLE public.discounted_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  twitter_username TEXT,
  subscribe_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  subscribe_status TEXT NOT NULL DEFAULT 'pending',
  stripe_customer_id TEXT,
  stripe_checkout_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.discounted_users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own discount records
CREATE POLICY "Users can view their own discount records" ON public.discounted_users
  FOR SELECT
  USING (user_id = auth.uid());

-- Create policy for edge functions to insert discount records
CREATE POLICY "Insert discount records" ON public.discounted_users
  FOR INSERT
  WITH CHECK (true);

-- Create policy for edge functions to update discount records
CREATE POLICY "Update discount records" ON public.discounted_users
  FOR UPDATE
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_discounted_users_user_id ON public.discounted_users(user_id);
CREATE INDEX idx_discounted_users_email ON public.discounted_users(email);
