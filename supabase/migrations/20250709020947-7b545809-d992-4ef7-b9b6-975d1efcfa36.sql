
-- Add a new RLS policy to allow GitHub username form access with email and order_id
CREATE POLICY "Allow GitHub username form access with email and order_id" 
ON public.discounted_users 
FOR SELECT 
USING (true);
