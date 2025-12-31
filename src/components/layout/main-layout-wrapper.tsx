'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdmin && <Header />}
            <main className={`flex-grow ${isAdmin ? 'h-screen flex flex-col' : ''}`}>
                {children}
            </main>
            {!isAdmin && <Footer />}
        </>
    );
}
