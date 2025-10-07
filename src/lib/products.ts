import { PlaceHolderImages } from './placeholder-images';
import type { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Collar de Jade',
    price: 2400,
    description: 'Un impresionante collar de jade verde, elaborado en oro de 18k. Un símbolo atemporal de elegancia.',
    image: PlaceHolderImages.find(p => p.id === 'product-necklace-1')!,
    category: 'Necklaces',
  },
  {
    id: '2',
    name: 'Aretes de Jade',
    price: 850,
    description: 'Un delicado par de aretes de jade ovalados con detalles de diamantes.',
    image: PlaceHolderImages.find(p => p.id === 'product-ring-1')!,
    category: 'Earrings',
  },
  {
    id: '3',
    name: 'Pulsera de Perlas',
    price: 620,
    description: 'Elegante pulsera de perlas de agua dulce, perfecta para añadir un toque de sofisticación clásica.',
    image: PlaceHolderImages.find(p => p.id === 'product-bracelet-1')!,
    category: 'Bracelets',
  },
  {
    id: '4',
    name: 'Anillo Solitario',
    price: 3200,
    description: 'Un deslumbrante anillo solitario de diamante, una pieza central para cualquier ocasión.',
    image: PlaceHolderImages.find(p => p.id === 'product-ring-2')!,
    category: 'Rings',
  },
  {
    id: '5',
    name: 'Collar de Gota',
    price: 1800,
    description: 'Un hermoso collar con un colgante en forma de gota de piedra lunar, engastado en plata de ley.',
    image: PlaceHolderImages.find(p => p.id === 'product-necklace-2')!,
    category: 'Necklaces',
  },
  {
    id: '6',
    name: 'Broche de Hoja',
    price: 1500,
    description: 'Un broche de hoja natural preservada con detalles en oro rosa, una pieza de arte única.',
    image: PlaceHolderImages.find(p => p.id === 'product-earrings-2')!,
    category: 'Brooches',
  },
];
