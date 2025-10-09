import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Heart } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
}

export default function ProductCard({ product }: ProductCardProps) {
  const rating = product.rating || 0;
  const reviews = product.reviews || 0;
  
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="aspect-[3/4] relative bg-secondary rounded-lg overflow-hidden">
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
         <button className="absolute top-2 right-2 bg-white/50 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
            <Heart className="w-5 h-5 text-black" />
         </button>
      </div>
      <div className="mt-3 text-left">
        <h3 className="font-medium text-sm md:text-base leading-tight">
            {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
            <p className={`font-semibold text-sm md:text-base ${product.originalPrice ? 'text-red-500' : ''}`}>
                {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
                <p className="text-xs md:text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                </p>
            )}
        </div>
      </div>
    </Link>
  );
}
