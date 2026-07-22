import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { BookOpen, Users, CheckCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-emerald-700 dark:text-emerald-500">
          <BookOpen className="h-6 w-6" />
          CiviConnect
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:underline text-slate-600 dark:text-slate-300">
            Student Login
          </Link>
          <Link href="/register" className={buttonVariants({ size: "sm", className: "bg-emerald-600 hover:bg-emerald-700" })}>
            Register
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-20">
        <div className="max-w-3xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-100 mb-4 px-3 py-1">
            Empowering the Next Generation of Civic Leaders
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Solve real community issues, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">together.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            CiviConnect provides a platform for students to engage in civic action planning, 
            evaluate scenarios, and receive AI-driven feedback.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/register" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto h-14 px-8 text-lg bg-emerald-600 hover:bg-emerald-700" })}>
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/admin" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto h-14 px-8 text-lg border-emerald-200 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-900/20" })}>
              Teacher Access
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-32">
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Scenario-Based</h3>
            <p className="text-slate-600 dark:text-slate-400">Tackle curated civic scenarios designed by your instructors to solve community issues.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Collaborative</h3>
            <p className="text-slate-600 dark:text-slate-400">Work individually or form groups to brainstorm and develop comprehensive action plans.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">AI Evaluation</h3>
            <p className="text-slate-600 dark:text-slate-400">Receive instant, constructive feedback from our AI system to refine and improve your proposals.</p>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} CiviConnect Capstone Project.</p>
      </footer>
    </div>
  );
}

// Temporary Badge component inline to avoid importing another missing component if I didn't install badge
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
