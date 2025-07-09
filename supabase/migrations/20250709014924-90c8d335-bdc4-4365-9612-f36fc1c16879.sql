
-- Step 1: Clean up existing duplicates by keeping only the most recent record for each user
WITH ranked_records AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM discounted_users
  WHERE user_id IS NOT NULL
)
DELETE FROM discounted_users 
WHERE id IN (
  SELECT id 
  FROM ranked_records 
  WHERE rn > 1
);

-- Step 2: Add unique constraint on user_id to prevent future duplicates
ALTER TABLE discounted_users 
ADD CONSTRAINT unique_user_discount UNIQUE (user_id);

-- Step 3: Create index for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_discounted_users_user_id_unique ON discounted_users(user_id) 
WHERE user_id IS NOT NULL;
