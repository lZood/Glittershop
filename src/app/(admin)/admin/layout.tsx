'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-muted/10">
            {/* Sidebar Wrapper */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-card border-r shadow-lg md:relative md:transform-none md:shadow-none",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"
                )}
            >
                <div className="absolute right-2 top-2 md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300">
                <header className="flex h-14 items-center gap-4 border-b bg-background px-6 shadow-sm">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="mr-2"
                        title={isSidebarOpen ? "Ocultar Menú" : "Mostrar Menú"}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-bold tracking-tight uppercase">Panel de Administración</h1>
                    <div className="ml-auto flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20" />
                    </div>
                </header>
                <ScrollArea className="flex-1">
                    <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                        {children}
                    </main>
                </ScrollArea>

                {/* Overlay for mobile when sidebar is open */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
