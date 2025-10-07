import { products } from '@/lib/products';
import ProductDetailClient from './product-detail-client';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return <ProductDetailClient product={product} />;
}
