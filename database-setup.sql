-- ============================================================================
-- Database Setup Script for Herbal Product API
-- Run this in Supabase SQL Editor to create all required tables
-- ============================================================================

-- 1. CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- ============================================================================
-- 2. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ============================================================================
-- 3. ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================================================
-- 4. ORDER_ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ============================================================================
-- 5. INSERT SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Sample Categories
INSERT INTO categories (name, description) VALUES
  ('Herbal Teas', 'Natural herbal tea blends for wellness'),
  ('Supplements', 'Herbal supplements and vitamins'),
  ('Essential Oils', 'Pure essential oils for aromatherapy')
ON CONFLICT (name) DO NOTHING;

-- Sample Products
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
  ('Chamomile Tea', 'Organic chamomile tea for relaxation', 15.99, 100, 'https://example.com/chamomile.jpg', 1),
  ('Green Tea', 'Antioxidant-rich green tea', 12.99, 150, 'https://example.com/green-tea.jpg', 1),
  ('Turmeric Capsules', 'Natural anti-inflammatory supplement', 24.99, 75, 'https://example.com/turmeric.jpg', 2),
  ('Lavender Oil', 'Pure lavender essential oil', 29.99, 50, 'https://example.com/lavender.jpg', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS) - Important for Supabase
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. RLS POLICIES
-- ============================================================================

-- Categories: Public read, Admin write
CREATE POLICY "Categories are viewable by everyone" 
  ON categories FOR SELECT 
  USING (true);

CREATE POLICY "Categories are insertable by admins" 
  ON categories FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Categories are updatable by admins" 
  ON categories FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Categories are deletable by admins" 
  ON categories FOR DELETE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Products: Public read, Admin write
CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT 
  USING (true);

CREATE POLICY "Products are insertable by admins" 
  ON products FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Products are updatable by admins" 
  ON products FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Products are deletable by admins" 
  ON products FOR DELETE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Orders: Users can view their own, Admins can view all
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can create their own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders" 
  ON orders FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete orders" 
  ON orders FOR DELETE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Order Items: Same as orders
CREATE POLICY "Users can view their own order items" 
  ON order_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );

CREATE POLICY "Users can create order items for their orders" 
  ON order_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete order items" 
  ON order_items FOR DELETE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 8. VERIFICATION QUERIES
-- ============================================================================

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('categories', 'products', 'orders', 'order_items');

-- Count records in each table
SELECT 
  'categories' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Make sure you have auth.users table (created by Supabase Auth)
-- 3. RLS policies assume you're using Supabase Auth with JWT
-- 4. Adjust policies based on your specific requirements
-- 5. Sample data is optional - remove if not needed
-- ============================================================================
