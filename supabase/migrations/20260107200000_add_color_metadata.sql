-- Migration: 20260107200000_add_color_metadata.sql

-- Add color_metadata column to product_variants table
ALTER TABLE public.product_variants
ADD COLUMN IF NOT EXISTS color_metadata JSONB DEFAULT '{}'::jsonb;

-- Example structure for color_metadata:
-- { "hex": "#FFD700", "name": "Oro" }
