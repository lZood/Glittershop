'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ListFilter, Plus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function ShopPage() {
  const [activeTag, setActiveTag] = useState('Ver Todo');
  const shopProducts = products;
  
  const tags = ['Ver Todo', 'Los Más Vendidos', 'Anillos', 'Collares', 'Pulseras'];

  return (
    <div className="bg-background">
      <section className="container mx-auto px-4 md:px-10 py-8">
        <h1 className="text-4xl font-bold text-left mb-6 uppercase">Ver Todo</h1>
        
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 -mx-4 px-4">
          {tags.map(tag => (
            <Button
              key={tag}
              variant={activeTag === tag ? 'default' : 'outline'}
              className={`rounded-none flex-shrink-0 ${activeTag === tag ? 'bg-black text-white' : 'bg-white text-black border-gray-400'}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-8">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                      <span className="text-sm font-medium">CLASIFICAR POR</span>
                      <Plus className="w-4 h-4 ml-1" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>Novedades</DropdownMenuItem>
                    <DropdownMenuItem>Precio: de menor a mayor</DropdownMenuItem>
                    <DropdownMenuItem>Precio: de mayor a menor</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-0 hover:bg-transparent justify-center gap-2">
                    <span className="text-sm font-medium">FILTRO</span>
                    <ListFilter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>Filtrar Productos</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                    <div>
                        <h3 className="font-semibold mb-3">Categoría</h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="cat-anillos" />
                                <Label htmlFor="cat-anillos">Anillos</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="cat-collares" />
                                <Label htmlFor="cat-collares">Collares</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="cat-pulseras" />
                                <Label htmlFor="cat-pulseras">Pulseras</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="cat-aretes" />
                                <Label htmlFor="cat-aretes">Aretes</Label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-3">Precio</h3>
                         <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="price-1" />
                                <Label htmlFor="price-1">Menos de $1000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="price-2" />
                                <Label htmlFor="price-2">$1000 - $2000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="price-3" />
                                <Label htmlFor="price-3">Más de $2000</Label>
                            </div>
                        </div>
                    </div>
                </div>
                 <SheetClose asChild>
                    <Button className="w-full">Aplicar Filtros</Button>
                </SheetClose>
              </SheetContent>
            </Sheet>
        </div>


        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8">
          {shopProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
