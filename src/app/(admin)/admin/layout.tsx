import { AdminHeader } from "@/components/admin/admin-header";
import { AdminBottomNav } from "@/components/admin/admin-bottom-nav";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background transition-colors duration-500">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
                <div className="md:hidden sticky top-0 z-30">
                    <AdminHeader />
                </div>

                <main className="flex-1 p-4 pb-28 md:p-8 md:pb-8 w-full max-w-full overflow-x-hidden">
                    {children}
                </main>

                <div className="z-50 relative">
                    <AdminBottomNav />
                </div>
            </div>
        </div>
    );
}
