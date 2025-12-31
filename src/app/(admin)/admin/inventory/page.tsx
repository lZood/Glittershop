import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventoryPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inventario</h2>
                    <p className="text-muted-foreground">
                        Gestiona tu catálogo de productos, variantes y stock.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/inventory/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Producto
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Productos</CardTitle>
                    <CardDescription>
                        Listado completo de productos activos e inactivos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed text-muted-foreground bg-muted/5">
                        <div className="text-center">
                            <p className="text-lg font-medium">Tabla de Productos</p>
                            <p className="text-sm">Próximamente: TanStack Table con filtrado y ordenamiento.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
