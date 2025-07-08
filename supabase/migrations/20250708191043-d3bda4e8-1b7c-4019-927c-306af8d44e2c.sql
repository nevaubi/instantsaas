
-- Add new columns to discounted_users table for Zapier/GitHub integration
ALTER TABLE public.discounted_users 
ADD COLUMN github_username TEXT,
ADD COLUMN delivery_status TEXT DEFAULT 'pending',
ADD COLUMN amount DECIMAL(10,2),
ADD COLUMN currency TEXT DEFAULT 'usd';
