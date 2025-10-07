import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Star } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
}

function renderStars(rating: number) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
        <Star
            key={i}
            className={`w-4 h-4 ${
            i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
        />
        );
    }
    return stars;
}


export default function ProductCard({ product }: ProductCardProps) {
  const rating = product.rating || 0;
  const reviews = product.reviews || 0;
  
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="aspect-square relative bg-secondary rounded-lg overflow-hidden">
        {product.image && (
            <Image
              src={product.image.imageUrl}
              alt={product.description}
              data-ai-hint={product.image.imageHint}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        )}
         <button className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
            <Star className="w-5 h-5 text-black" />
         </button>
      </div>
      <div className="mt-2">
        <h3 className="font-medium text-base leading-tight">
            {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
            <p className={`font-semibold ${product.originalPrice ? 'text-red-500' : ''}`}>
                {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                </p>
            )}
        </div>
        <div className="flex items-center gap-1 mt-1">
            {renderStars(rating)}
            <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>
      </div>
    </Link>
  );
}
