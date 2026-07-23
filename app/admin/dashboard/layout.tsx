import { Navigation } from "@/components/navigation";
import { getCurrentAdmin } from "@/lib/dal";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Users, LayoutDashboard, FileText } from "lucide-react";

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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation role="admin" />
      <div className="container mx-auto px-4 md:px-8 flex-1 items-start md:grid md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)] md:gap-8 lg:gap-12 pt-6">
        <aside className="hidden md:block sticky top-14 h-[calc(100vh-3.5rem)] shrink-0 self-start border-r border-border pr-4 py-6 lg:py-8">
          <nav className="flex flex-col space-y-1.5 text-sm font-medium">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-2.5 px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Overview</span>
            </Link>
            <Link
              href="/admin/dashboard/classrooms"
              className="flex items-center space-x-2.5 px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>Classrooms</span>
            </Link>
            <Link
              href="/admin/dashboard/scenarios"
              className="flex items-center space-x-2.5 px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>Scenario Library</span>
            </Link>
            <Link
              href="/admin/dashboard/submissions"
              className="flex items-center space-x-2.5 px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>Submissions</span>
            </Link>
          </nav>
        </aside>
        <main className="flex w-full flex-col min-w-0 py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
