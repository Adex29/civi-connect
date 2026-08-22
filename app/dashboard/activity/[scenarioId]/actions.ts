"use server";

import { getCurrentStudent } from "@/lib/dal";
import { findScenarioById, getAllSubmissions, createSubmission, updateSubmission, getAllClassrooms, getAllClassroomScenarios } from "@/lib/db";
import { Submission, SubmissionId, SimulationStateData } from "@/lib/definitions";
import {
  evaluateStep1,
  evaluateStep2,
  evaluateStep3,
  evaluateStep4,
  evaluateStep5,
  evaluateStep6,
  evaluateStep7,
  evaluateStep8,
  evaluateReflection,
  calculateMissionScores,
} from "@/lib/ai";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function processSimulationStepAction(
  scenarioId: string,
  stepNumber: number,
  payload: any
) {
  const student = await getCurrentStudent();
  if (!student) return { error: "Not authenticated" };

  const scenario = await findScenarioById(scenarioId);
  if (!scenario) return { error: "Scenario not found" };

  // Validate classroom status and classroom-scenario mapping
  const classrooms = await getAllClassrooms();
  const classroom = classrooms.find((c) => c.id === student.classroomId);
  if (!classroom) return { error: "Classroom not found" };
  if (classroom.status === "archived") return { error: "This classroom is archived. Submissions are disabled." };

  const classroomScenarios = await getAllClassroomScenarios();
  const assignment = classroomScenarios.find(
    (cs) => cs.classroomId === student.classroomId && cs.scenarioId === scenarioId
  );
  if (!assignment || !assignment.isActive) {
    return { error: "This scenario is not active in your classroom." };
  }

  const allSubmissions = await getAllSubmissions();
  let submission = allSubmissions.find(
    (s: Submission) =>
      s.scenarioId === scenarioId &&
      (s.studentId === student.id || (student.groupId && s.groupId === student.groupId))
  );

  // Initialize submission if missing
  if (!submission) {
    submission = await createSubmission({
      id: nanoid() as SubmissionId,
      scenarioId: scenario.id,
      studentId: student.id,
      groupId: student.groupId,
      status: "in_progress",
      content: "",
      feedback: "",
      score: null,
      stepProgress: 1,
      simulationState: { currentStep: 1 },
      submittedAt: new Date().toISOString(),
    });
  }

  const state: SimulationStateData = submission.simulationState || { currentStep: 1 };

  let evalResult = { passed: true, feedback: "", evaluation: undefined as any };

  if (stepNumber === 1) {
    evalResult = await evaluateStep1(scenario, payload.selectedIssue, payload.justification);
    state.step1 = {
      selectedIssue: payload.selectedIssue,
      justification: payload.justification,
      feedback: evalResult.feedback,
      passed: evalResult.passed,
      evaluation: evalResult.evaluation,
    };
    if (evalResult.passed) {
      state.currentStep = Math.max(state.currentStep, 2);
    }
  } else if (stepNumber === 2) {
    evalResult = await evaluateStep2(scenario, payload.orderedCauseIds);
    state.step2 = {
      orderedCauseIds: payload.orderedCauseIds,
      feedback: evalResult.feedback,
      passed: evalResult.passed,
      evaluation: evalResult.evaluation,
    };
    if (evalResult.passed) {
      state.currentStep = Math.max(state.currentStep, 3);
    }
  } else if (stepNumber === 3) {
    evalResult = await evaluateStep3(scenario, payload.evaluatedEvidences);
    state.step3 = {
      evaluatedEvidences: payload.evaluatedEvidences,
      feedback: evalResult.feedback,
      passed: evalResult.passed,
      evaluation: evalResult.evaluation,
    };
    if (evalResult.passed) {
      state.currentStep = Math.max(state.currentStep, 4);
    }
  } else if (stepNumber === 4) {
    evalResult = await evaluateStep4(scenario, payload.consultedIds, payload.notes, payload.askedFollowUps);
    state.step4 = {
      consultedStakeholderIds: payload.consultedIds,
      interviewNotes: payload.notes,
      askedFollowUps: payload.askedFollowUps || {},
      feedback: evalResult.feedback,
      passed: evalResult.passed,
      evaluation: evalResult.evaluation,
    };
    if (evalResult.passed) {
      state.currentStep = Math.max(state.currentStep, 5);
    }
  } else if (stepNumber === 5) {
    evalResult = await evaluateStep5(scenario, payload.plan);
    state.step5 = {
      plan: payload.plan,
      feedback: evalResult.feedback,
      passed: evalResult.passed,
      evaluation: evalResult.evaluation,
    };
    if (evalResult.passed) {
      state.currentStep = Math.max(state.currentStep, 6);
    }
  } else if (stepNumber === 6) {
    evalResult = await evaluateStep6(scenario, payload.selectedOptionText, payload.justification);
    state.step6 = {
      selectedOptionId: payload.selectedOptionId,
      justification: payload.justification,
      feedback: evalResult.feedback,
      passed: evalResult.passed,
      evaluation: evalResult.evaluation,
    };
    if (evalResult.passed) {
      state.currentStep = Math.max(state.currentStep, 7);
    }
  } else if (stepNumber === 7) {
    evalResult = await evaluateStep7(scenario, payload.revisedPlan, state.step5?.plan);
    state.step7 = {
      revisedPlan: payload.revisedPlan,
      feedback: evalResult.feedback,
      passed: evalResult.passed,
      evaluation: evalResult.evaluation,
    };
    if (evalResult.passed) {
      state.currentStep = Math.max(state.currentStep, 8);
    }
  } else if (stepNumber === 8) {
    evalResult = await evaluateStep8(scenario, payload.impact);
    state.step8 = {
      impact: payload.impact,
      feedback: evalResult.feedback,
      passed: evalResult.passed,
      evaluation: evalResult.evaluation,
    };
    if (evalResult.passed) {
      // Calculate final score performance breakdown across 7 dimensions
      const scores = calculateMissionScores(state);
      state.scores = scores;
      state.currentStep = 9; // Step 9 = Performance Scorecard & Reflection
      submission.score = scores.overallScore;
    }
  }

  submission.simulationState = state;
  submission.stepProgress = state.currentStep;
  await updateSubmission(submission);

  revalidatePath(`/dashboard/activity/${scenarioId}`);

  return {
    success: evalResult.passed,
    feedback: evalResult.feedback,
    evaluation: evalResult.evaluation,
    nextStep: state.currentStep,
    scores: state.scores,
  };
}

export async function submitReflectionAction(scenarioId: string, answer: string) {
  const student = await getCurrentStudent();
  if (!student) return { error: "Not authenticated" };

  const scenario = await findScenarioById(scenarioId);
  if (!scenario) return { error: "Scenario not found" };

  // Validate classroom status and classroom-scenario mapping
  const classrooms = await getAllClassrooms();
  const classroom = classrooms.find((c) => c.id === student.classroomId);
  if (!classroom) return { error: "Classroom not found" };
  if (classroom.status === "archived") return { error: "This classroom is archived. Submissions are disabled." };

  const classroomScenarios = await getAllClassroomScenarios();
  const assignment = classroomScenarios.find(
    (cs) => cs.classroomId === student.classroomId && cs.scenarioId === scenarioId
  );
  if (!assignment || !assignment.isActive) {
    return { error: "This scenario is not active in your classroom." };
  }

  const allSubmissions = await getAllSubmissions();
  let submission = allSubmissions.find(
    (s: Submission) =>
      s.scenarioId === scenarioId &&
      (s.studentId === student.id || (student.groupId && s.groupId === student.groupId))
  );

  if (!submission) return { error: "Submission not found" };

  const evalResult = await evaluateReflection(scenario, answer);

  const state: SimulationStateData = submission.simulationState || { currentStep: 8 };
  state.reflection = {
    answer,
    feedback: evalResult.feedback,
    evaluation: evalResult.evaluation,
  };

  if (evalResult.passed) {
    state.currentStep = 9; // Step 9 = Certificate & Complete Screen

    submission.simulationState = state;
    submission.status = "completed";
    submission.content = JSON.stringify(state, null, 2);
    submission.feedback = evalResult.feedback;

    await updateSubmission(submission);

    revalidatePath(`/dashboard/activity/${scenarioId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      feedback: evalResult.feedback,
      evaluation: evalResult.evaluation,
      completed: true,
    };
  }

  submission.simulationState = state;
  await updateSubmission(submission);

  return {
    success: false,
    feedback: evalResult.feedback,
    evaluation: evalResult.evaluation,
  };
}

// Legacy export for compatibility
export async function submitActivityStep(scenarioId: string, stepIndex: number, content: string) {
  return processSimulationStepAction(scenarioId, stepIndex + 1, { justification: content });
}
