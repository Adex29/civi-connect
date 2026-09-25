import type { Submission, AIEvaluationResult } from "./definitions";

/**
 * Human-readable mappings for internal rubric and evaluation flags.
 * Ensures students and teachers never see raw code constants or variable names.
 */
export const FLAG_LABELS: Record<string, string> = {
  // Stakeholder Consultation Flags
  INSUFFICIENT_STAKEHOLDER_BREADTH: "Stakeholder Diversity Needed",
  INSUFFICIENT_INTERVIEW_NOTES: "Incomplete Interview Notes",
  NOTES_STAKEHOLDER_MISMATCH: "Stakeholder Alignment Needed",

  // Issue Identification & Selection Flags
  INCOMPLETE_SELECTION: "Selection Required",
  INSUFFICIENT_LENGTH: "More Detail Needed",
  INSUFFICIENT_JUSTIFICATION: "More Justification Needed",
  SELECTION_JUSTIFICATION_MISMATCH: "Justification Mismatch",
  INCORRECT_PRIORITY_ISSUE: "Root Issue Identification Needed",

  // Evidence Evaluation Flags
  INCOMPLETE_RANKING: "Incomplete Cause Ranking",
  INCORRECT_CAUSE_HIERARCHY: "Cause Hierarchy Alignment Needed",
  INCOMPLETE_EVIDENCE_AUDIT: "All Evidence Must Be Evaluated",
  INSUFFICIENT_EVIDENCE_JUSTIFICATION: "Evidence Justification Needed",
  MISIDENTIFIED_IRRELEVANT_EVIDENCE: "Irrelevant Evidence Misidentified",
  DISMISSED_RELEVANT_EVIDENCE: "Relevant Evidence Dismissed",
  INSUFFICIENT_IRRELEVANT_EVIDENCE_JUSTIFICATION: "Irrelevance Justification Needed",
  DUPLICATE_EVIDENCE_JUSTIFICATION: "Unique Evidence Justifications Needed",
  EVIDENCE_JUSTIFICATION_MISMATCH: "Evidence Content Alignment Needed",
  EVIDENCE_RATING_MISMATCH: "Credibility Alignment Needed",

  // Intervention / Community Action Plan Flags
  INCOMPLETE_SCHEMA: "Missing Required Plan Fields",
  INSUFFICIENT_OPERATIONAL_DETAIL: "Operational Detail Needed",
  MISSING_ACTIVITY_CRITERIA: "Activity Description Incomplete",
  MISSING_CONSULTED_STAKEHOLDER: "Step 4 Stakeholder Required",
  TIMELINE_EXCEEDS_MISSION_SCOPE: "Timeline Exceeds 7-Day Scope",
  OUTCOMES_OBJECTIVES_MISMATCH: "Outcomes Must Align with Objectives",
  UNREALISTIC_BUDGET: "Realistic Community Budget Needed",
  PLAN_SCENARIO_MISMATCH: "Plan Alignment Needed",

  // Impact Assessment Flags
  INSUFFICIENT_IMPACT_DEPTH: "Impact Assessment Depth",
  IMPACT_SCENARIO_MISMATCH: "Impact Alignment Needed",

  // Reflection Flags
  INSUFFICIENT_REFLECTION_LENGTH: "Reflection Depth Needed",
  REFLECTION_SCENARIO_MISMATCH: "Reflection Alignment Needed",

  // Quality & Reasoning Flags
  GENERIC_FLUFF: "Specific Evidence Needed",
  CONTEXT_RELEVANCE_MISMATCH: "Scenario Relevance Needed",
  DUPLICATE_FIELD_CONTENT: "Unique Section Responses Needed",

  // AI & Authenticity Control Flags
  AI_PATTERN_DETECTED: "Authenticity Check",
  AI_GENERATED_CONTENT: "Authenticity Review",
  AI_REVIEW_REQUIRED: "Authenticity Review Required",
  AI_REVIEW_RECOMMENDED: "Authenticity Check Recommended",
  HIGH_AI_SCORE: "Authenticity Review",
  AI_SUBMISSION: "Authenticity Flag",
};

/**
 * Converts internal flag identifiers into user-friendly, educational labels.
 */
export function formatFlagLabel(flag: string): string {
  if (!flag) return "";
  if (FLAG_LABELS[flag]) {
    return FLAG_LABELS[flag];
  }
  // Convert SCREAMING_SNAKE_CASE into clean Title Case
  return flag
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Checks whether a flag is an AI-authorship control flag.
 * Used to avoid redundant badges when an explicit AI alert banner is already rendered.
 */
export function isAiControlFlag(flag: string): boolean {
  return [
    "AI_GENERATED_CONTENT",
    "AI_REVIEW_REQUIRED",
    "AI_REVIEW_RECOMMENDED",
    "AI_PATTERN_DETECTED",
    "HIGH_AI_SCORE",
    "AI_SUBMISSION",
  ].includes(flag);
}

/**
 * Sanitizes student-facing evaluation text (summaries, feedback, strengths, improvements)
 * to ensure that internal SCREAMING_SNAKE_CASE variables or flag names are replaced
 * with natural, professional educational language.
 */
export function sanitizeEducationalText(text: string): string {
  if (!text || typeof text !== "string") return "";

  let cleaned = text;

  // Replace exact flag constants with natural phrasing
  for (const [rawCode, friendlyLabel] of Object.entries(FLAG_LABELS)) {
    if (cleaned.includes(rawCode)) {
      const regex = new RegExp(`\\b${rawCode}\\b`, "g");
      cleaned = cleaned.replace(regex, friendlyLabel);
    }
  }

  // Sanitize any remaining SCREAMING_SNAKE_CASE tokens (at least 3 uppercase letters, underscore, uppercase letters)
  cleaned = cleaned.replace(/\b[A-Z]{3,}(?:_[A-Z0-9]+)+\b/g, (match) => {
    return match
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  });

  return cleaned;
}

export interface SubmissionAiAnalysis {
  hasAiFlag: boolean;
  flaggedSteps: number[];
  latestStepEvaluated?: number;
  latestFeedback?: string;
  latestScore?: number;
  totalEvaluatedSteps: number;
}

/**
 * Inspects a student's submission and extracts a comprehensive diagnostic
 * summary of AI evaluations, flags, and actionable feedback across all simulation steps.
 */
export function extractSubmissionAiAnalysis(submission: Submission): SubmissionAiAnalysis {
  const state = submission.simulationState;
  if (!state) {
    return {
      hasAiFlag: false,
      flaggedSteps: [],
      latestFeedback: submission.feedback || undefined,
      latestScore: submission.score ?? undefined,
      totalEvaluatedSteps: 0,
    };
  }

  const steps: Array<{ step: number; evaluation?: AIEvaluationResult; feedback?: string }> = [
    { step: 1, evaluation: state.step1?.evaluation, feedback: state.step1?.feedback },
    { step: 2, evaluation: state.step2?.evaluation, feedback: state.step2?.feedback },
    { step: 3, evaluation: state.step3?.evaluation, feedback: state.step3?.feedback },
    { step: 4, evaluation: state.step4?.evaluation, feedback: state.step4?.feedback },
    { step: 5, evaluation: state.step5?.evaluation, feedback: state.step5?.feedback },
    { step: 6, evaluation: state.step6?.evaluation, feedback: state.step6?.feedback },
    { step: 7, evaluation: state.step7?.evaluation, feedback: state.step7?.feedback },
    { step: 8, evaluation: state.reflection?.evaluation || state.step8?.evaluation, feedback: state.reflection?.feedback || state.step8?.feedback },
  ];

  const flaggedSteps: number[] = [];
  let latestStepEvaluated: number | undefined = undefined;
  let latestFeedback: string | undefined = submission.feedback || undefined;
  let latestScore: number | undefined = submission.score ?? undefined;
  let totalEvaluatedSteps = 0;

  for (const s of steps) {
    if (s.evaluation || s.feedback) {
      totalEvaluatedSteps++;
      latestStepEvaluated = s.step;
      if (s.feedback) latestFeedback = s.feedback;
      if (s.evaluation?.step_score !== undefined) latestScore = s.evaluation.step_score;
    }
    const isAi = Boolean(
      s.evaluation?.is_ai_generated ||
      s.evaluation?.flags?.some((f) => f === "AI_GENERATED_CONTENT" || f === "AI_REVIEW_REQUIRED")
    );
    if (isAi) {
      flaggedSteps.push(s.step);
    }
  }

  return {
    hasAiFlag: flaggedSteps.length > 0,
    flaggedSteps,
    latestStepEvaluated,
    latestFeedback,
    latestScore,
    totalEvaluatedSteps,
  };
}
