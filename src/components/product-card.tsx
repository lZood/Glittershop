import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  
  return (
    <Link href="#" className="group">
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
      </div>
      <div className="mt-2">
        <h3 className="font-medium text-base leading-tight">
            {product.name}
        </h3>
      </div>
    </Link>
  );
}
