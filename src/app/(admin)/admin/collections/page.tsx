import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function CollectionsPage() {
    const supabase = await createClient();
    const { data: collections } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <Link href="/admin/inventory">
                        <Button size="sm" variant="ghost" className="h-8 px-4 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-200">
                            Inventario
                        </Button>
                    </Link>
                    <Button size="sm" variant="secondary" className="h-8 px-4 rounded-lg text-xs font-bold bg-white text-slate-900 shadow-sm hover:bg-white border border-slate-100">
                        Colecciones
                    </Button>
                </div>
                <Link href="/admin/collections/new">
                    <Button className="bg-[#b47331] hover:bg-[#a1662a] text-white gap-2">
                        <Plus className="w-4 h-4" />
                        Nueva Colección
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections?.map((collection) => (
                    <Link href={`/admin/collections/${collection.id}`} key={collection.id} className="block">
                        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow h-full">
                            <div className="aspect-video bg-slate-100 rounded-lg mb-4 relative overflow-hidden">
                                {collection.image_url ? (
                                    <img src={collection.image_url} alt={collection.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Sin imagen</div>
                                )}
                                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${collection.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {collection.is_active ? 'Publicada' : 'Borrador'}
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-900 group-hover:text-[#b47331] transition-colors">{collection.name}</h3>
                            <p className="text-xs text-slate-400 font-mono">/{collection.slug}</p>
                        </div>
                    </Link>
                ))}

                {(!collections || collections.length === 0) && (
                    <div className="col-span-full py-12 text-center text-slate-400">
                        <p>No hay colecciones creadas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
