import { Navigation } from "@/components/navigation";
import { getCurrentStudent } from "@/lib/dal";
import { redirect } from "next/navigation";
// import { DashboardFloatingBackdrop } from "@/components/floating-elements";

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
    <div className="community-shell relative flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* <DashboardFloatingBackdrop /> */}
      <Navigation role="student" />
      <main className="container relative z-10 mx-auto flex-1 px-4 py-8 md:px-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
