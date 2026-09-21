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

  // Evidence Evaluation Flags
  INCOMPLETE_RANKING: "Incomplete Cause Ranking",
  INCOMPLETE_EVIDENCE_AUDIT: "All Evidence Must Be Evaluated",
  INSUFFICIENT_EVIDENCE_JUSTIFICATION: "Evidence Justification Needed",
  EVIDENCE_RATING_MISMATCH: "Credibility Alignment Needed",

  // Intervention Plan Flags
  INCOMPLETE_SCHEMA: "Missing Required Plan Fields",
  INSUFFICIENT_OPERATIONAL_DETAIL: "Operational Detail Needed",
  PLAN_SCENARIO_MISMATCH: "Plan Alignment Needed",

  // Impact Assessment Flags
  INSUFFICIENT_IMPACT_DEPTH: "Impact Assessment Depth",
  IMPACT_SCENARIO_MISMATCH: "Impact Alignment Needed",

  // Reflection Flags
  INSUFFICIENT_REFLECTION_LENGTH: "Reflection Depth Needed",
  REFLECTION_SCENARIO_MISMATCH: "Reflection Alignment Needed",

  // Quality & Reasoning Flags
  GENERIC_FLUFF: "Specific Evidence Needed",

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
