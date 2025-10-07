import type { ImagePlaceholder } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: ImagePlaceholder;
  category: string;
};
