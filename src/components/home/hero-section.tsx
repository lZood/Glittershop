'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const videos = [
    '/videos/videoanillo.mp4',
    '/videos/videopulseratous.mp4',
    '/videos/videopulsera.mp4',
    '/videos/videocollar.mp4',
    '/videos/videoreloj.mp4'
];

export function HeroSection() {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleVideoEnd = () => {
        setIsFading(true);
        fadeTimeoutRef.current = setTimeout(() => {
            setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
            setIsFading(false);
        }, 350);
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch(error => {
                console.log("Video play failed or interrupted:", error);
            });
        }
    }, [currentVideoIndex]);

    useEffect(() => {
        return () => {
            if (fadeTimeoutRef.current) {
                clearTimeout(fadeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <section className="relative w-full h-[95vh] flex flex-col justify-center items-center text-center overflow-hidden bg-black">
            {/* Video Background */}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover z-0 transition-opacity duration-700 ${isFading ? 'opacity-0' : 'opacity-100'}`}
                style={{ objectFit: 'cover' }}
            >
                <source src={videos[currentVideoIndex]} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-black/40 z-[1] transition-opacity duration-700" />

            {/* Hero Content */}
            <div className="relative z-10 px-4 max-w-4xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-16 md:mt-20">
                <span className="text-white tracking-[0.6em] uppercase text-[10px] md:text-xs mb-8 font-bold bg-black/40 backdrop-blur-md px-6 py-2 border border-white/10 inline-flex items-center gap-4 sm:gap-6">
                    <span>T O D O</span>
                    <span>P A R A</span>
                    <span>B R I L L A R</span>
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 drop-shadow-xl font-light leading-tight">
                    Sé <span className="italic">BIENVENIDA</span> <br /> a este mundo
                </h1>
                <p className="text-sm md:text-lg text-white/90 mb-10 tracking-[0.15em] font-light max-w-2xl mx-auto leading-relaxed uppercase">
                    donde puedes elevar tu personalidad <br className="hidden md:block" /> sin dejar de lado tu esencia
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <Button asChild size="lg" className="bg-white hover:bg-white/90 text-black px-12 h-14 text-xs tracking-[0.3em] uppercase font-bold rounded-none transition-all transform hover:scale-105 shadow-2xl">
                        <Link href="/shop">Explorar Colección</Link>
                    </Button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce z-20">
                <ChevronDown className="w-8 h-8 text-white/50" />
            </div>

            {/* Progress indicators for videos */}
            <div className="absolute bottom-8 right-8 z-20 flex gap-2">
                {videos.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1 transition-all duration-500 rounded-full ${idx === currentVideoIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                    />
                ))}
            </div>
        </section>
    );
}
