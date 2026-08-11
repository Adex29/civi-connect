import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  Search, 
  ListOrdered, 
  FileCheck, 
  Users, 
  Lightbulb, 
  Zap, 
  Target,
  Play
} from "lucide-react";

export default function LandingPage() {
  const steps = [
    {
      num: 1,
      name: "Identify Community Issues",
      desc: "Recognize and define the most pressing community problem.",
      icon: Search,
      badge: "Investigation"
    },
    {
      num: 2,
      name: "Analyze Causes",
      desc: "Examine the root causes and contributing factors.",
      icon: ListOrdered,
      badge: "Analysis"
    },
    {
      num: 3,
      name: "Evaluate Digital Evidence",
      desc: "Assess the credibility, relevance, and reliability of different digital sources before making decisions.",
      icon: FileCheck,
      badge: "Verification"
    },
    {
      num: 4,
      name: "Consult Simulated Stakeholders",
      desc: "Gather insights from community members, local leaders, and organizations through realistic simulations.",
      icon: Users,
      badge: "Consultation"
    },
    {
      num: 5,
      name: "Develop an Intervention Plan",
      desc: "Create practical, evidence-based solutions for the identified community issue.",
      icon: Lightbulb,
      badge: "Planning"
    },
    {
      num: 6,
      name: "Anticipate Challenges",
      desc: "Respond to unexpected obstacles and revise your plan accordingly.",
      icon: Zap,
      badge: "Adaptation"
    },
    {
      num: 7,
      name: "Assess Community Impact",
      desc: "Evaluate the feasibility, sustainability, effectiveness, and ethical implications of your proposed solution.",
      icon: Target,
      badge: "Evaluation"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary animate-fade-in">
      
      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center">
        
        {/* Section 1: Hero Welcome */}
        <section className="w-full max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center flex flex-col items-center justify-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground">
              Welcome to <span className="text-primary bg-clip-text">Civi-Tech!</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              A Web-Based Civic Engagement Simulation Platform for Community Problem-Solving in Senior High School Citizenship and Civic Engagement
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            <Link 
              href="/login" 
              className={buttonVariants({ size: "lg", className: "w-full sm:w-auto px-8 py-6 text-base font-bold gap-2 shadow-sm" })}
            >
              <LogIn className="h-5 w-5" />
              <span>Log In</span>
            </Link>
            <Link 
              href="/register" 
              className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto px-8 py-6 text-base font-bold gap-2 border-primary/20 hover:border-primary/40 bg-card hover:bg-muted/50" })}
            >
              <UserPlus className="h-5 w-5 text-primary" />
              <span>Register</span>
            </Link>
          </div>
        </section>

        {/* Section 2: What You Will Do */}
        <section className="w-full border-t border-border/80 bg-muted/20 py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                What You Will Do?
              </h2>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                Follow these 7 critical simulation stages to analyze, design, and validate evidence-based solutions for local communities.
              </p>
            </div>

            {/* Grid layout for steps */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <Card key={step.num} className="bg-card border hover:border-primary/30 transition-all duration-300 hover:shadow-sm group">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-primary/30 font-mono tracking-tight group-hover:text-primary transition-colors">
                          0{step.num}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {step.badge}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-bold text-base leading-snug flex items-center gap-2">
                          <Icon className="h-4.5 w-4.5 text-primary shrink-0" />
                          <span>{step.name}</span>
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Bottom Call to Action button */}
            <div className="flex justify-center pt-8">
              <Link 
                href="/register" 
                className={buttonVariants({ size: "lg", className: "px-10 py-6 text-base font-bold gap-2.5 shadow-md hover:shadow-lg transition-all animate-pulse hover:animate-none" })}
              >
                <Play className="h-5 w-5 fill-current" />
                <span>Start Simulation</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-xs text-muted-foreground bg-card">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <span className="p-1 rounded bg-primary/10 text-primary font-mono text-xs">CT</span>
            <span>Civi-Tech &copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-center sm:text-right">
            Empowering students to solve real-world community issues.
          </p>
        </div>
      </footer>

    </div>
  );
}
