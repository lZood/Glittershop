import { getProductReviews, Review } from "@/lib/actions/reviews";
import { ReviewCard } from "./review-card";
import { ReviewForm } from "./review-form";
import { Separator } from "@/components/ui/separator";

interface ReviewsSectionProps {
    productId: string;
    productVariants?: { color: string; size: string }[];
}

export async function ReviewsSection({ productId, productVariants }: ReviewsSectionProps) {
    const { data: reviews = [] } = await getProductReviews(productId);

    return (
        <div className="space-y-10 mt-16 max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-10">
                {/* Left: Summary & Form */}
                <div className="md:w-1/3 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold font-heading">Opiniones de clientes</h2>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-4xl font-bold">
                                {reviews.length > 0
                                    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                    : "0.0"
                                }
                            </span>
                            <div className="text-sm text-muted-foreground">
                                de 5 ({reviews.length} reseñas)
                            </div>
                        </div>
                    </div>

                    <ReviewForm productId={productId} variants={productVariants} />
                </div>

                {/* Right: Reviews List */}
                <div className="md:w-2/3 space-y-6">
                    <h3 className="font-semibold text-lg">Todas las reseñas</h3>
                    {reviews.length === 0 ? (
                        <div className="text-center py-10 bg-muted/20 rounded-lg">
                            <p className="text-muted-foreground">Este producto aún no tiene reseñas. ¡Sé el primero!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
