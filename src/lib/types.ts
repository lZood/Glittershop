import type { ImagePlaceholder } from './placeholder-images';

export type Product = {
  id: string;
  slug?: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: ImagePlaceholder; // Keeping for compatibility, but we should use 'images' array
  images?: string[];
  colors?: string[];
  images_metadata?: {
    url: string;
    color?: string;
    is_primary: boolean;
  }[];
  category: string;
  rating?: number;
  reviews?: number;
  tags?: string[];
  care_instructions?: string;
  video?: string;
  variants?: {
    id: number;
    sku: string;
    color?: string;
    color_metadata?: { hex: string; name: string };
    size?: string;
    material?: string; // Implicit in our logic often, but let's add it
    stock: number;
    price: number; // Calculated (base + adjustment)
  }[];
};

export type Category = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

// --- Database Types (Supabase) ---

export type DbProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number; // Stored as base_price or active price
  original_price?: number; // The original price before any discount (null if no sale)
  stock: number; // Aggregate or legacy
  sku?: string; // Legacy or primary SKU
  category_id: number;
  collection_id?: number;
  is_active: boolean;
  cost_price?: number;
  tags?: string[];
  size_guide_type?: string;
  care_instructions?: string;
  video?: string;
  created_at: string;
  updated_at: string;
}

export type DbProductVariant = {
  id: number;
  product_id: string;
  sku: string;
  color?: string;
  size?: string;
  stock: number;
  price_adjustment: number;
  color_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type DbProductImage = {
  id: number;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  color?: string;
  storage_path?: string;
  created_at: string;
}
