import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import SessionProvider from '@/lib/supabase/session-provider';
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayoutWrapper } from '@/components/layout/main-layout-wrapper';

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
            <MainLayoutWrapper>
              {children}
            </MainLayoutWrapper>
          </SessionProvider>
          <Toaster />
        </ThemeProvider>

      </body>
    </html>
  );
}
