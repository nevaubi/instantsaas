
-- Create fullprice_orders table to track full-price order information
CREATE TABLE public.fullprice_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  github_username TEXT,
  delivery_status TEXT DEFAULT 'pending',
  stripe_checkout_session_id TEXT,
  stripe_customer_id TEXT,
  amount NUMERIC DEFAULT 69.00,
  currency TEXT DEFAULT 'usd',
  subscribe_status TEXT DEFAULT 'pending',
  subscribe_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.fullprice_orders ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own full-price orders
CREATE POLICY "Users can view their own fullprice orders" ON public.fullprice_orders
  FOR SELECT
  USING (user_id = auth.uid());

-- Create policy for edge functions to insert full-price orders
CREATE POLICY "Insert fullprice orders" ON public.fullprice_orders
  FOR INSERT
  WITH CHECK (true);

-- Create policy for edge functions to update full-price orders
CREATE POLICY "Update fullprice orders" ON public.fullprice_orders
  FOR UPDATE
  USING (true);
