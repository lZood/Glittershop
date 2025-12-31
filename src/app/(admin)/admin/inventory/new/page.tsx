import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductForm } from "@/components/admin/inventory/product-form";

export default function NewProductPage() {
    return (
        <div className="min-h-screen bg-background/50">
            {/* Elegant Mobile-First Header */}
            <div className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-secondary/50">
                            <Link href="/admin/inventory">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-black tracking-tight uppercase">Nuevo Producto</h1>
                        </div>
                    </div>
                    {/* Compact save button for mobile header */}
                    {/* Save button visible on all devices */}
                    <div>
                        <Button size="sm" form="product-form" className="font-bold uppercase tracking-wider text-xs px-6 h-9 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform bg-primary text-primary-foreground">
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8 hidden md:block">
                    <p className="text-muted-foreground font-medium">
                        Configura los detalles, variantes y multimedia de tu nuevo artículo de joyería.
                    </p>
                </div>

                <div className="relative">
                    <ProductForm />
                </div>
            </main>
        </div>
    );
}
