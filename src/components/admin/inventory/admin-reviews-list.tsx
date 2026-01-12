'use client';

import { useEffect, useState } from "react";
import { Review, getAdminProductReviews } from "@/lib/actions/reviews";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AdminReviewsListProps {
    productId: string;
}

export function AdminReviewsList({ productId }: AdminReviewsListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const res = await getAdminProductReviews(productId);
            if (res.success && res.data) {
                setReviews(res.data);
            }
            setLoading(false);
        };
        load();
    }, [productId]);

    if (loading) return <div className="p-4 text-center">Cargando reseñas...</div>;

    if (reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground border border-dashed rounded-xl">
                <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
                <p>No hay reseñas para este producto.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg">Historial de Opiniones ({reviews.length})</h3>
            <div className="grid gap-4">
                {reviews.map((review) => (
                    <div key={review.id} className="border p-4 rounded-lg bg-card shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback>{review.user?.first_name?.[0] || 'C'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">{review.user?.first_name || 'Cliente'} {review.user?.last_name}</p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {format(new Date(review.created_at), "d MMMM yyyy", { locale: es })}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={review.is_verified_purchase ? 'secondary' : 'outline'} className="text-[10px]">
                                {review.is_verified_purchase ? 'Compra Verificada' : 'No Verificado'}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-1 my-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'}`}
                                />
                            ))}
                            <span className="text-xs font-bold ml-2">{(review.rating).toFixed(1)}</span>
                        </div>

                        {review.title && <h4 className="font-medium text-sm">{review.title}</h4>}
                        <p className="text-sm text-foreground/80">{review.content}</p>

                        {(review.variant_color || review.variant_size) && (
                            <div className="flex gap-2 mt-2 pt-2 border-t text-xs text-muted-foreground">
                                {review.variant_color && <span className="bg-secondary/50 px-2 py-0.5 rounded">Color: {review.variant_color}</span>}
                                {review.variant_size && <span className="bg-secondary/50 px-2 py-0.5 rounded">Talla: {review.variant_size}</span>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
