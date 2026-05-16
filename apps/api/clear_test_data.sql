-- Run this in your Supabase SQL Editor to clear all test data
-- This will reset products, orders, and site_settings to zero

-- Delete all orders
DELETE FROM orders;

-- Delete all products
DELETE FROM products;

-- Reset site_settings (hero section etc.)
DELETE FROM site_settings;

-- Reset sequences (if any)
-- Note: users table is synced with Supabase Auth, so delete users via Auth panel

-- Verify counts (should all be 0)
SELECT 'products' as table_name, count(*) FROM products
UNION ALL
SELECT 'orders', count(*) FROM orders
UNION ALL
SELECT 'site_settings', count(*) FROM site_settings;
