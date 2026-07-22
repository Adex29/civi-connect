"use server";

import { getCurrentStudent } from "@/lib/dal";
import { findScenarioById, readData, writeData, DataFileType, getAllSubmissions, createSubmission } from "@/lib/db";
import { Scenario, Submission, SubmissionId } from "@/lib/definitions";
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

  const scenarios = readData<Scenario>(DataFileType.Scenarios);
  const scenario = findScenarioById(scenarioId);
  if (!scenario) return { error: "Scenario not found" };

  let submissions = readData<Submission>(DataFileType.Submissions);
  let submission = getAllSubmissions().find((s: Submission) => s.scenarioId === scenarioId && (s.studentId === student.id || (student.groupId && s.groupId === student.groupId)));

  // Initialize submission if it doesn't exist
  if (!submission) {
    submission = createSubmission({
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
    submissions.push(submission);
  }

  // Determine which constraints to evaluate based on step
  // E.g. step 0 -> first 2 constraints, step 1 -> next 2 constraints
  const stepSize = Math.ceil(scenario.constraints.length / 3); // Assume 3 steps for now
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
    
    const updatedSubmissions = submissions.map(s => s.id === submission!.id ? submission! : s);
    writeData(DataFileType.Submissions, updatedSubmissions);
    
    revalidatePath(`/dashboard/activity/${scenarioId}`);
    return { success: true, feedback: evaluation.feedback, isCompleted: submission.status === "completed" };
  } else {
    // Return failed feedback, do not save step
    return { 
      success: false, 
      feedback: evaluation.feedback, 
      failedConstraints: evaluation.failedConstraints 
    };
  }
}
