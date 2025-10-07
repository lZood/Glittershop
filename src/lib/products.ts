import { PlaceHolderImages } from './placeholder-images';
import type { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Elysian Diamond Ring',
    price: 2400,
    description: 'A stunning solitaire diamond ring, crafted in 18k white gold. A timeless symbol of love.',
    image: PlaceHolderImages.find(p => p.id === 'product-ring-1')!,
    category: 'Rings',
  },
  {
    id: '2',
    name: 'Celestial Pendant',
    price: 850,
    description: 'A delicate gold pendant necklace featuring a starburst design with a central diamond.',
    image: PlaceHolderImages.find(p => p.id === 'product-necklace-1')!,
    category: 'Necklaces',
  },
  {
    id: '3',
    name: 'Serene Pearl Drops',
    price: 620,
    description: 'Elegant freshwater pearl drop earrings, perfect for adding a touch of classic sophistication.',
    image: PlaceHolderImages.find(p => p.id === 'product-earrings-1')!,
    category: 'Earrings',
  },
  {
    id: '4',
    name: 'Aurora Tennis Bracelet',
    price: 3200,
    description: 'A dazzling sterling silver tennis bracelet, lined with sparkling cubic zirconia.',
    image: PlaceHolderImages.find(p => p.id === 'product-bracelet-1')!,
    category: 'Bracelets',
  },
  {
    id: '5',
    name: 'Azure Eternity Band',
    price: 1800,
    description: 'A beautiful band featuring alternating sapphires and diamonds, set in platinum.',
    image: PlaceHolderImages.find(p => p.id === 'product-ring-2')!,
    category: 'Rings',
  },
  {
    id: '6',
    name: 'Orion Studs',
    price: 1500,
    description: 'Classic round-cut diamond stud earrings, a must-have for any jewelry collection.',
    image: PlaceHolderImages.find(p => p.id === 'product-earrings-2')!,
    category: 'Earrings',
  },
];
