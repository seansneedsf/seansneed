-- Fix the social_stats table constraint issue
-- Make platform_color nullable since some platforms only use gradients

-- First, let's modify the column to allow NULL values
ALTER TABLE public.social_stats 
ALTER COLUMN platform_color DROP NOT NULL;

-- Clear any existing data to avoid conflicts
DELETE FROM public.social_stats;

-- Re-insert the corrected initial data
INSERT INTO public.social_stats (platform, platform_name, follower_count, display_count, platform_color, platform_gradient, text_color, platform_url, display_order) VALUES
('bluesky', 'Bluesky', 2100, '2.1K', 'bg-[rgb(0,133,255)]', NULL, 'text-blue-200', 'https://bsky.app/profile/seansneed.bsky.social', 1),
('instagram', 'Instagram', 5300, '5.3K', NULL, 'bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500', 'text-orange-200', 'https://instagram.com/theseansneed', 2),
('linkedin', 'LinkedIn', 3800, '3.8K', 'bg-[rgb(10,102,194)]', NULL, 'text-blue-200', 'https://linkedin.com/in/seansneed', 3),
('total', 'Total Reach', 12000, '12K', 'bg-neutral-800', NULL, 'text-neutral-400', NULL, 4);

-- Verify the data was inserted correctly
SELECT platform, platform_name, platform_color, platform_gradient FROM public.social_stats ORDER BY display_order; 