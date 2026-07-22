import { Navigation } from "@/components/navigation";
import { getCurrentStudent } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const student = await getCurrentStudent();
  if (!student) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navigation role="student" />
      <main className="flex-1 container mx-auto px-4 md:px-8 py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
