"use server";

import { getCurrentStudent } from "@/lib/dal";
import {
  findScenarioById,
  findClassroomById,
  findClassroomScenario,
  findSubmissionForStudent,
  createSubmission,
  updateSubmission,
} from "@/lib/db";
import { Submission, SubmissionId, SimulationStateData, SIMULATION_PASSING_THRESHOLD, AIEvaluationResult } from "@/lib/definitions";
import {
  evaluateStep1,
  evaluateStep2,
  evaluateStep3,
  evaluateStep4,
  evaluateStep5,
  evaluateStep6,
  evaluateStep7,
  evaluateReflection,
  calculateMissionScores,
  buildDeterministicEvaluation,
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

  const [scenario, classroom, assignment, existingSubmission] = await Promise.all([
    findScenarioById(scenarioId),
    findClassroomById(student.classroomId),
    findClassroomScenario(student.classroomId, scenarioId),
    findSubmissionForStudent(scenarioId, student.id, student.groupId),
  ]);

  if (!scenario) return { error: "Scenario not found" };
  if (scenario.status === "archived") return { error: "This civic mission has been archived. Submissions are disabled." };

  if (!classroom) return { error: "Classroom not found" };
  if (classroom.status === "archived") return { error: "This classroom is archived. Submissions are disabled." };

  if (!assignment || !assignment.isActive) {
    return { error: "This scenario is not active in your classroom." };
  }

  let submission = existingSubmission;

  if (submission && submission.status === "completed") {
    return { error: "This mission has already been completed and cannot be modified." };
  }

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

  const isStepPassing = (res: { passed: boolean; evaluation?: { step_score?: number } }) => {
    const score = res.evaluation?.step_score;
    return Boolean(res.passed) && (score === undefined || score >= SIMULATION_PASSING_THRESHOLD);
  };

  if (stepNumber === 1) {
    evalResult = await evaluateStep1(scenario, payload.selectedIssue, payload.justification);
    state.step1 = {
      selectedIssue: payload.selectedIssue,
      justification: payload.justification,
      feedback: evalResult.feedback,
      passed: evalResult.passed,
      evaluation: evalResult.evaluation,
    };
    if (isStepPassing(evalResult)) {
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
    if (isStepPassing(evalResult)) {
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
    if (isStepPassing(evalResult)) {
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
    if (isStepPassing(evalResult)) {
      state.currentStep = Math.max(state.currentStep, 5);
    }
  } else if (stepNumber === 5) {
    evalResult = await evaluateStep5(
      scenario,
      payload.plan,
      state.step4?.consultedStakeholderIds || payload.consultedStakeholderIds
    );
    state.step5 = {
      plan: payload.plan,
      feedback: evalResult.feedback,
      passed: evalResult.passed,
      evaluation: evalResult.evaluation,
    };
    if (isStepPassing(evalResult)) {
      state.currentStep = Math.max(state.currentStep, 6);
    }
  } else if (stepNumber === 6) {
    const challenge = payload.challenge;
    const challengeFeedback = "Unexpected challenge encountered. Proceeding to Plan Revision.";
    const step6Evaluation = buildDeterministicEvaluation(
      6,
      true,
      100,
      `Encountered ${challenge?.title || "unexpected simulation challenge"}.`,
      "Challenge acknowledged. Revise the designated action plan component to adapt.",
      ["Simulation obstacle acknowledged."],
      []
    );
    state.step6 = {
      challenge,
      feedback: challengeFeedback,
      passed: true,
      evaluation: step6Evaluation,
    };
    evalResult = {
      passed: true,
      feedback: challengeFeedback,
      evaluation: step6Evaluation,
    };
    state.currentStep = Math.max(state.currentStep, 7);
  } else if (stepNumber === 7) {
    evalResult = await evaluateStep7(
      scenario,
      payload.revisedPlan,
      state.step5?.plan,
      state.step6?.challenge
    );
    state.step7 = {
      revisedPlan: payload.revisedPlan,
      feedback: evalResult.feedback,
      passed: evalResult.passed,
      evaluation: evalResult.evaluation,
    };
    if (isStepPassing(evalResult)) {
      // Step 7 completes the simulation! Calculate final score across core competencies
      const scores = calculateMissionScores(state);
      state.scores = scores;
      state.currentStep = 8; // Step 8 = Performance Scorecard & Reflection
      submission.score = scores.overallScore;
    }
  }

  submission.simulationState = state;
  submission.stepProgress = state.currentStep;
  if (evalResult.feedback) {
    submission.feedback = evalResult.feedback;
  }
  if (state.step5?.plan?.projectTitle) {
    submission.content = `Plan: "${state.step5.plan.projectTitle}" (Goal: ${state.step5.plan.goal || "In progress"})`;
  } else if (state.step1?.selectedIssue) {
    submission.content = `Priority Issue: "${state.step1.selectedIssue}" — ${state.step1.justification || ""}`;
  }
  await updateSubmission(submission);

  revalidatePath(`/dashboard/activity/${scenarioId}`);

  const isPassed = isStepPassing(evalResult);
  return {
    success: isPassed,
    feedback: evalResult.feedback,
    evaluation: evalResult.evaluation,
    nextStep: isPassed ? state.currentStep : stepNumber,
    scores: state.scores,
  };
}

export async function submitReflectionAction(scenarioId: string, answer: string, question?: string) {
  const student = await getCurrentStudent();
  if (!student) return { error: "Not authenticated" };

  const [scenario, classroom, assignment, submission] = await Promise.all([
    findScenarioById(scenarioId),
    findClassroomById(student.classroomId),
    findClassroomScenario(student.classroomId, scenarioId),
    findSubmissionForStudent(scenarioId, student.id, student.groupId),
  ]);

  if (!scenario) return { error: "Scenario not found" };
  if (scenario.status === "archived") return { error: "This civic mission has been archived. Submissions are disabled." };

  if (!classroom) return { error: "Classroom not found" };
  if (classroom.status === "archived") return { error: "This classroom is archived. Submissions are disabled." };

  if (!assignment || !assignment.isActive) {
    return { error: "This scenario is not active in your classroom." };
  }

  if (!submission) return { error: "Submission not found" };
  if (submission.status === "completed") return { error: "This mission has already been completed and cannot be modified." };

  const assignedQuestion = question || submission.simulationState?.reflection?.question || "What did you learn about solving community problems?";
  const evalResult = await evaluateReflection(scenario, answer, assignedQuestion);

  const state: SimulationStateData = submission.simulationState || { currentStep: 8 };
  state.reflection = {
    question: assignedQuestion,
    answer,
    feedback: evalResult.feedback,
    evaluation: evalResult.evaluation,
  };

  const isPassed = Boolean(evalResult.passed) && (evalResult.evaluation?.step_score === undefined || evalResult.evaluation.step_score >= SIMULATION_PASSING_THRESHOLD);
  if (isPassed) {
    state.currentStep = 10; // Step 10 = Completion screen

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
