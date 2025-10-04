-- Run this SQL query in your Supabase SQL Editor to activate all users

-- Option 1: Activate a specific user by email
UPDATE users 
SET is_active = true 
WHERE email = 'your-email@example.com';

-- Option 2: Activate ALL users (use with caution)
-- UPDATE users 
-- SET is_active = true 
-- WHERE is_active IS NULL OR is_active = false;

-- Option 3: Check which users are inactive
SELECT id, name, email, is_active, created_at 
FROM users 
WHERE is_active IS NULL OR is_active = false;

-- Option 4: Activate all users created today
-- UPDATE users 
-- SET is_active = true 
-- WHERE DATE(created_at) = CURRENT_DATE 
-- AND (is_active IS NULL OR is_active = false);
