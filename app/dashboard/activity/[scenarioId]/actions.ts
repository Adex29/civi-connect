"use server";

import { getCurrentStudent } from "@/lib/dal";
import { findScenarioById, getAllSubmissions, createSubmission, updateSubmission } from "@/lib/db";
import { Submission, SubmissionId } from "@/lib/definitions";
import { evaluateStudentSubmission } from "@/lib/ai";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function submitActivityStep(
  scenarioId: string, 
  stepIndex: number, 
  content: string
) {
  const student = await getCurrentStudent();
  if (!student) return { error: "Not authenticated" };

  const scenario = await findScenarioById(scenarioId);
  if (!scenario) return { error: "Scenario not found" };

  const allSubmissions = await getAllSubmissions();
  let submission = allSubmissions.find((s: Submission) => s.scenarioId === scenarioId && (s.studentId === student.id || (student.groupId && s.groupId === student.groupId)));

  // Initialize submission if it doesn't exist
  if (!submission) {
    submission = await createSubmission({
      id: nanoid() as SubmissionId,
      scenarioId: scenario.id,
      studentId: student.id,
      groupId: student.groupId,
      status: "draft",
      content: "",
      feedback: "",
      score: null,
      submittedAt: new Date().toISOString(),
    });
  }

  // Determine which constraints to evaluate based on step
  const stepSize = Math.ceil(scenario.constraints.length / 3); // Assume 3 steps
  const startIndex = stepIndex * stepSize;
  const endIndex = Math.min(startIndex + stepSize, scenario.constraints.length);
  const currentConstraints = scenario.constraints.slice(startIndex, endIndex);

  // Ask AI to evaluate
  const evaluation = await evaluateStudentSubmission(
    scenario.title,
    scenario.description,
    currentConstraints,
    content
  );

  // If passed, append content and update submission
  if (evaluation.passed) {
    submission.content = submission.content ? `${submission.content}\n\n[Step ${stepIndex + 1}]\n${content}` : content;
    
    // If it's the last step, mark as completed
    if (endIndex === scenario.constraints.length) {
      submission.status = "completed";
      submission.score = 100; // Simplified scoring
    }
    
    await updateSubmission(submission);
    
    revalidatePath(`/dashboard/activity/${scenarioId}`);
    return { success: true, feedback: evaluation.feedback, isCompleted: submission.status === "completed" };
  } else {
    // Return failed feedback, do not save step
    return { 
      success: false, 
      feedback: evaluation.feedback, 
      failedConstraints: evaluation.failedConstraints,
      isAiGenerated: evaluation.isAiGenerated ?? false,
    };
  }
}
