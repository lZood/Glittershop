import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SessionProvider from '@/lib/supabase/session-provider';

export const metadata: Metadata = {
  title: 'Glittershop',
  description: 'Arte que se lleva puesto.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <SessionProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
