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
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navigation role="admin" />
      <div className="container mx-auto px-4 md:px-8 flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 pt-6">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="flex flex-col space-y-2 text-sm font-medium">
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Overview</span>
              </Link>
              <Link
                href="/admin/dashboard/classrooms"
                className="flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              >
                <Users className="h-4 w-4" />
                <span>Classrooms</span>
              </Link>
              <Link
                href="/admin/dashboard/scenarios"
                className="flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              >
                <BookOpen className="h-4 w-4" />
                <span>Scenario Library</span>
              </Link>
              <Link
                href="/admin/dashboard/submissions"
                className="flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              >
                <FileText className="h-4 w-4" />
                <span>Submissions</span>
              </Link>
            </nav>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
