'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { cn } from '@/lib/utils';

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const isHome = pathname === '/';

    return (
        <>
            {!isAdmin && <Header />}
            <main className={cn(
                "flex-grow",
                isAdmin ? "h-screen flex flex-col" : (isHome ? "" : "pt-20")
            )}>
                {children}
            </main>
            {!isAdmin && <Footer />}
        </>
    );
}
