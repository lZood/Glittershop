import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface ProductCarouselProps {
  products: Product[];
  autoPlaySpeed?: number;
  resumeDelay?: number;
}

export default function ProductCarousel({
  products,
  autoPlaySpeed = 3000,
  resumeDelay = 5000
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInteractionRef = useRef<number>(Date.now());

  const extendedProducts = [...products, ...products, ...products];

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= products.length * 2) {
          return products.length;
        }
        return next;
      });
    }, autoPlaySpeed);
  }, [autoPlaySpeed, products.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isAutoPlaying, startAutoPlay, stopAutoPlay]);

  const handleUserInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
    setIsAutoPlaying(false);
    stopAutoPlay();

    if (resumeRef.current) {
      clearTimeout(resumeRef.current);
    }

    resumeRef.current = setTimeout(() => {
      const timeSinceLastInteraction = Date.now() - lastInteractionRef.current;
      if (timeSinceLastInteraction >= resumeDelay) {
        setIsAutoPlaying(true);
      }
    }, resumeDelay);
  }, [resumeDelay, stopAutoPlay]);

  const goToPrevious = () => {
    handleUserInteraction();
    setCurrentIndex((prev) => {
      if (prev <= 0) return products.length * 2 - 1;
      return prev - 1;
    });
  };

  const goToNext = () => {
    handleUserInteraction();
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= products.length * 2) return products.length;
      return next;
    });
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    handleUserInteraction();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setScrollLeft(currentIndex);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const walk = (startX - clientX) / 200;
    const newIndex = Math.round(scrollLeft + walk);

    if (newIndex !== currentIndex) {
      setCurrentIndex(Math.max(0, Math.min(newIndex, extendedProducts.length - 1)));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    handleUserInteraction();
  };

  const toggleLike = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getVisibleProducts = () => {
    const itemsPerView = typeof window !== 'undefined' && window.innerWidth < 640
      ? 1
      : typeof window !== 'undefined' && window.innerWidth < 1024
        ? 2
        : 3;

    const result = [];
    for (let i = 0; i < itemsPerView + 1; i++) {
      const index = (currentIndex + i) % extendedProducts.length;
      result.push({ ...extendedProducts[index], displayIndex: index });
    }
    return result;
  };

  const [visibleProducts, setVisibleProducts] = useState(getVisibleProducts());

  useEffect(() => {
    const handleResize = () => {
      setVisibleProducts(getVisibleProducts());
    };

    window.addEventListener('resize', handleResize);
    setVisibleProducts(getVisibleProducts());

    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  useEffect(() => {
    setVisibleProducts(getVisibleProducts());
  }, [currentIndex]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleTouchEnd}
    >
      <div className="absolute -top-8 right-0 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            isAutoPlaying ? 'bg-primary' : 'bg-muted-foreground'
          }`}
        />
        <span className="text-xs text-muted-foreground">
          {isAutoPlaying ? 'Auto' : 'Pausado'}
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: `translateX(-${(currentIndex % products.length) * (100 / visibleProducts.length)}%)`,
          }}
        >
          {extendedProducts.map((product, index) => {
            const isFavorite = likedProducts.includes(product.id);

            return (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2 sm:px-3"
              >
                <div className="group relative bg-card rounded-2xl overflow-hidden border border-border/60 shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <div className="relative aspect-square overflow-hidden bg-background">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                    <motion.button
                      onClick={(e) => toggleLike(product.id, e)}
                      whileTap={{ scale: 0.85 }}
                      className="absolute top-3 right-3 w-10 h-10 bg-background/85 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md z-20"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isFavorite ? (
                          <motion.div
                            key="filled"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2, type: 'spring', stiffness: 320, damping: 18 }}
                          >
                            <Star className="w-5 h-5 fill-primary text-primary" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="outline"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2, type: 'spring', stiffness: 320, damping: 18 }}
                          >
                            <Star className="w-5 h-5 text-foreground" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <button className="absolute bottom-3 left-3 right-3 py-2.5 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75 flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Agregar
                    </button>

                    {index < products.length && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-medium uppercase tracking-wider rounded">
                        Nuevo
                      </span>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-base sm:text-lg font-medium text-foreground mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-base sm:text-lg font-semibold text-foreground">
                      {product.price}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 w-10 h-10 sm:w-12 sm:h-12 bg-background shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors z-10"
        aria-label="Producto anterior"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 w-10 h-10 sm:w-12 sm:h-12 bg-background shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors z-10"
        aria-label="Producto siguiente"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      <div className="flex justify-center gap-2 mt-6">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              handleUserInteraction();
              setCurrentIndex(index + products.length);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              (currentIndex % products.length) === index
                ? 'w-6 bg-primary'
                : 'bg-muted hover:bg-muted-foreground'
            }`}
            aria-label={`Ir al producto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
