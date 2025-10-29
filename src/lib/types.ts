import type { ImagePlaceholder } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: ImagePlaceholder;
  category: string;
  rating?: number;
  reviews?: number;
};

export type Category = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}
