import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { 
  BookOpen, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  School,
  FileCheck,
  Zap,
  LogIn
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <span>CiviConnect</span>
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <ModeToggle />
            <Link 
              href="/login" 
              className="text-muted-foreground hover:text-foreground font-medium transition-colors px-3 py-2 rounded-md"
            >
              Student Login
            </Link>
            <Link 
              href="/register" 
              className={buttonVariants({ size: "sm" })}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-muted/50 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Interactive Civic Action & AI Evaluation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Empower students to solve <span className="font-serif italic font-normal text-primary">real-world</span> community challenges.
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                CiviConnect connects classroom instruction with civic action. Students tackle localized scenarios, address key constraints, and receive instant AI-powered evaluation.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <Link 
                  href="/register" 
                  className={buttonVariants({ size: "lg", className: "h-12 px-6 text-base gap-2" })}
                >
                  Join as Student
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href="/login" 
                  className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 px-6 text-base gap-2" })}
                >
                  <LogIn className="h-4 w-4" />
                  Student Log In
                </Link>
              </div>

              {/* Trust & Stats Row */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t text-xs text-muted-foreground">
                <div>
                  <p className="font-bold text-lg text-foreground font-mono">100%</p>
                  <p>Guided Constraints</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground font-mono">Real-time</p>
                  <p>AI Feedback</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground font-mono">Group & Solo</p>
                  <p>Collaborative Plans</p>
                </div>
              </div>
            </div>

            {/* Hero Right Column: UI Mockup Preview */}
            <div className="lg:col-span-5">
              <Card className="shadow-2xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-primary/5">
                <div className="bg-muted/60 px-4 py-3 border-b flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-foreground">Scenario Live Preview</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">Step 2 of 3</Badge>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Dengue Outbreak Prevention</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    Formulate a rapid response mobilization strategy with local barangay health units.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 text-xs">
                  {/* Requirements List Mock */}
                  <div className="p-3 rounded-lg bg-muted/40 border space-y-1.5">
                    <p className="font-semibold text-foreground text-[11px] uppercase tracking-wider">Active Constraint:</p>
                    <p className="text-muted-foreground">Detail community cleanup schedules and sanitation checkpoints.</p>
                  </div>

                  {/* Student Submission Mock */}
                  <div className="p-3 rounded-lg border bg-background font-mono text-muted-foreground text-[11px] leading-relaxed">
                    "We will coordinate with Barangay Captains to deploy weekly Saturday cleanup drives and distribute larvicide kits to 150 households..."
                  </div>

                  {/* AI Evaluation Badge Mock */}
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-bold text-[11px]">Passed AI Evaluation</p>
                      <p className="text-[11px] opacity-90">Specific mobilization steps and household counts met all required criteria.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-y bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-bold tracking-tight">Structured Civic Learning Loop</h2>
              <p className="text-muted-foreground text-sm">
                CiviConnect provides a seamless workflow from scenario exploration to automated AI plan evaluation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Step 1 */}
              <Card className="bg-card">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold font-mono flex items-center justify-center text-sm mb-2">
                    01
                  </div>
                  <CardTitle className="text-lg">Localized Scenarios</CardTitle>
                  <CardDescription className="text-xs">
                    Tackle real civic challenges, such as solid waste crises, dengue outbreaks, or flood management.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <School className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Classroom-assigned scenario codes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Individual or group participation</span>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="bg-card">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold font-mono flex items-center justify-center text-sm mb-2">
                    02
                  </div>
                  <CardTitle className="text-lg">Constraint-Guided Action</CardTitle>
                  <CardDescription className="text-xs">
                    Draft multi-step proposals designed to address explicit civic and environmental constraints.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Step-by-step constraint prompts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Focus on actionable local solutions</span>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="bg-card">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold font-mono flex items-center justify-center text-sm mb-2">
                    03
                  </div>
                  <CardTitle className="text-lg">Instant AI Evaluation</CardTitle>
                  <CardDescription className="text-xs">
                    Automated Gemini AI checks content depth, rejects gibberish/AI-copied text, and provides constructive feedback.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Originality & AI content detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Immediate revision guidance</span>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* Student Portal Access Section */}
        <section className="container mx-auto px-4 md:px-8 py-16">
          <Card className="max-w-3xl mx-auto p-8 sm:p-12 text-center bg-card border shadow-xs space-y-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap className="h-7 w-7" />
            </div>

            <div className="space-y-3 max-w-lg mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ready to Start Planning?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter your 6-character class code to join your classroom, view assigned scenarios, and submit your civic action plan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link 
                href="/register" 
                className={buttonVariants({ size: "lg", className: "w-full sm:w-auto px-8 gap-2" })}
              >
                <span>Register Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/login" 
                className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto px-8" })}
              >
                <span>Log In</span>
              </Link>
            </div>
          </Card>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-xs text-muted-foreground">
        <div className="container mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>CiviConnect &copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-center sm:text-right">
            Empowering students to solve real-world community issues.
          </p>
        </div>
      </footer>

    </div>
  );
}
