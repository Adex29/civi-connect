import { Navigation } from "@/components/navigation";
import { AdminSidebarNav } from "@/components/admin-sidebar-nav";
import { getCurrentAdmin } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin");
  }

  return (
    <div className="community-shell flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
      <Navigation role="admin" />
      <div className="container mx-auto w-full min-w-0 max-w-[1600px] flex-1 items-start px-4 pt-5 md:grid md:grid-cols-[210px_minmax(0,1fr)] md:gap-7 md:px-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10">
        <aside className="sticky top-23 hidden h-[calc(100vh-5.75rem)] shrink-0 self-start overflow-y-auto border-r border-border/80 py-4 pr-6 md:block">
          <AdminSidebarNav />
        </aside>
        <main className="flex w-full min-w-0 flex-col py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
