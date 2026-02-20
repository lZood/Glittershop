import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import SessionProvider from '@/lib/supabase/session-provider';
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayoutWrapper } from '@/components/layout/main-layout-wrapper';
import { CartProvider } from '@/lib/cart-context';
import { CartSheet } from '@/components/cart-sheet';
import { CartSuccessSheet } from '@/components/cart-success-sheet';

export const metadata: Metadata = {
  title: 'GlittersShop',
  description: 'Arte que se lleva puesto.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <CartProvider>
              <MainLayoutWrapper>
                {children}
              </MainLayoutWrapper>
              <CartSheet />
              <CartSuccessSheet />
            </CartProvider>
          </SessionProvider>
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>

      </body>
    </html>
  );
}
