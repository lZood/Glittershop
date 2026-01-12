import { Star, CheckCircle2 } from "lucide-react";
import { Review } from "@/lib/actions/reviews";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
    review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className="border-b py-6 space-y-3 last:border-0">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    "w-4 h-4",
                                    star <= review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                                )}
                            />
                        ))}
                    </div>
                    {review.title && <h4 className="font-bold text-sm">{review.title}</h4>}
                </div>
                <div className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="text-sm text-foreground/80 leading-relaxed">
                {review.content}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1 font-medium text-foreground">
                    <span>{review.user?.first_name || 'Cliente'} {review.user?.last_name?.[0]}.</span>
                    {review.is_verified_purchase && (
                        <span className="flex items-center text-green-600 gap-0.5" title="Compra verificada">
                            <CheckCircle2 className="w-3 h-3" /> Verificado
                        </span>
                    )}
                </div>
                {(review.variant_color || review.variant_size) && (
                    <div className="flex items-center gap-2 border-l pl-2">
                        {review.variant_color && <span>Color: {review.variant_color}</span>}
                        {review.variant_size && <span>Talla: {review.variant_size}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}
