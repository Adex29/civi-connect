"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { submitActivityStep } from "./actions";
import { Scenario } from "@/lib/definitions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle, Bot } from "lucide-react";
import { useRouter } from "next/navigation";

export function ActivityForm({ scenario }: { scenario: Scenario }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
    failedConstraints?: string[];
    isAiGenerated?: boolean;
  } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [stepKey, setStepKey] = useState(0); // Key to trigger re-mount animation

  // Divide into 3 steps
  const totalSteps = 3;
  const stepSize = Math.ceil(scenario.constraints.length / totalSteps);
  const startIndex = step * stepSize;
  const endIndex = Math.min(startIndex + stepSize, scenario.constraints.length);
  const currentConstraints = scenario.constraints.slice(startIndex, endIndex);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    setFeedback(null);
    
    const result = await submitActivityStep(scenario.id, step, content);
    
    setLoading(false);
    
    if (result.success) {
      setFeedback({ success: true, message: result.feedback || "Great job! You met the criteria." });
      setContent("");
      
      if (result.isCompleted) {
        setCompleted(true);
      } else {
        // Move to next step after a short delay
        setTimeout(() => {
          setStep(s => s + 1);
          setStepKey(k => k + 1);
          setFeedback(null);
        }, 3000);
      }
    } else {
      setFeedback({
        success: false,
        message: result.feedback || "Please revise your answer.",
        failedConstraints: result.failedConstraints,
        isAiGenerated: result.isAiGenerated,
      });
    }
  };

  if (completed) {
    return (
      <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900 animate-scale-in">
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-emerald-500" />
          <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Activity Completed!</h2>
          <p className="text-emerald-600 dark:text-emerald-500 max-w-md">
            You have successfully addressed all constraints for this scenario. Your plan has been recorded.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" key={stepKey}>
      <div className="flex justify-between items-center mb-2 animate-fade-in">
        <h3 className="text-lg font-medium">Step {step + 1} of {totalSteps}</h3>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-8 rounded-full transition-colors duration-500 ${i <= step ? 'bg-primary' : 'bg-muted'}`} 
            />
          ))}
        </div>
      </div>

      <Card className="animate-fade-in-up">
        <CardHeader className="bg-muted/40 border-b">
          <CardTitle className="text-lg text-primary">Current Requirements</CardTitle>
          <CardDescription>
            Address the following constraints in your plan:
          </CardDescription>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm font-medium">
            {currentConstraints.map((c, i) => (
              <li key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>{c}</li>
            ))}
          </ul>
        </CardHeader>
        <CardContent className="pt-6">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your plan here to address the requirements above..."
            className="min-h-[200px] resize-y transition-shadow duration-200 focus:shadow-md"
            disabled={loading || feedback?.success}
          />

          {feedback && (
            <Alert 
              className={`mt-6 animate-fade-in-up ${
                feedback.success 
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800" 
                  : feedback.isAiGenerated
                  ? "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800"
                  : "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800"
              }`}
            >
              {feedback.success ? (
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : feedback.isAiGenerated ? (
                <Bot className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              )}
              <AlertTitle>
                {feedback.success
                  ? "Passed!"
                  : feedback.isAiGenerated
                  ? "AI Content Flagged"
                  : "Needs Revision"}
              </AlertTitle>
              <AlertDescription className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                {feedback.message}

                {feedback.failedConstraints && feedback.failedConstraints.length > 0 && !feedback.isAiGenerated && (
                  <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800/60">
                    <p className="font-semibold text-xs uppercase tracking-wider mb-1 text-amber-900 dark:text-amber-200">
                      Unmet Requirements:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      {feedback.failedConstraints.map((fc, idx) => (
                        <li key={idx}>{fc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={!content.trim() || loading || feedback?.success}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {feedback?.success ? "Moving to next step..." : "Submit Step"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
