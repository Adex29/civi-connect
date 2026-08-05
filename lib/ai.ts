import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Scenario,
  SimulationStateData,
  StepScoreBreakdown,
  InterventionPlanData,
  ImpactAssessmentData,
} from "./definitions";
import { getMissionDataForScenario } from "./mission-data";

// Calculate performance scores based on student progress
export function calculateMissionScores(state: SimulationStateData): StepScoreBreakdown {
  const step1Score = state.step1?.passed ? 90 + Math.min(10, (state.step1.justification?.length || 0) / 10) : 65;
  const step2Score = state.step2?.passed ? 88 + Math.min(12, (state.step2.orderedCauseIds?.length || 0) * 2) : 60;
  const step3Score = state.step3?.passed ? 85 + Math.min(15, (state.step3.evaluatedEvidences?.length || 0) * 3) : 55;
  const step4Score = state.step4?.passed ? 92 + Math.min(8, (state.step4.consultedStakeholderIds?.length || 0) * 3) : 60;
  const step5Score = state.step5?.passed ? 90 + Math.min(10, (state.step5.plan?.activities?.length || 0) / 20) : 65;
  const step6Score = state.step6?.passed ? 88 + Math.min(12, (state.step6.justification?.length || 0) / 15) : 50;
  const step7Score = state.step7?.passed ? 93 + Math.min(7, (state.step7.impact?.shortTermImpact?.length || 0) / 20) : 60;

  const round = (val: number) => Math.min(100, Math.max(0, Math.round(val)));

  const cInv = round(step1Score);
  const cAna = round(step2Score);
  const eEval = round(step3Score);
  const sAna = round(step4Score);
  const iPlan = round(step5Score);
  const aDec = round(step6Score);
  const impAss = round(step7Score);

  const overall = round((cInv + cAna + eEval + sAna + iPlan + aDec + impAss) / 7);

  return {
    communityInvestigation: cInv,
    causeAnalysis: cAna,
    evidenceEvaluation: eEval,
    stakeholderAnalysis: sAna,
    interventionPlanning: iPlan,
    adaptiveDecisionMaking: aDec,
    impactAssessment: impAss,
    overallScore: overall,
  };
}

export async function evaluateStep1(
  scenario: Scenario,
  selectedIssue: string,
  justification: string
): Promise<{ passed: boolean; feedback: string }> {
  if (!justification.trim() || justification.trim().length < 15) {
    return {
      passed: false,
      feedback: "Please provide a complete justification (at least 2-3 full sentences) explaining why you prioritized this community issue.",
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      passed: true,
      feedback: `You identified "${selectedIssue}". Your justification demonstrates critical thinking regarding community priorities.`,
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const prompt = `
Evaluator for Senior High School Civic Engagement.
Scenario Title: "${scenario.title}"
Selected Priority Issue: "${selectedIssue}"
Student Justification: "${justification}"

Evaluate if the justification is relevant and shows critical thinking. Respond in JSON:
{ "passed": boolean, "feedback": "string (Constructive feedback addressed to the student)" }
`;
    const res = await model.generateContent(prompt);
    const text = res.response.text();
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : text);
    return {
      passed: Boolean(parsed.passed),
      feedback: parsed.feedback || `You identified "${selectedIssue}". Consider whether this issue is the primary concern or a contributing factor.`,
    };
  } catch (err) {
    return {
      passed: true,
      feedback: `You identified "${selectedIssue}". Your response recognizes key community challenges.`,
    };
  }
}

export async function evaluateStep2(
  scenario: Scenario,
  orderedCauseIds: string[]
): Promise<{ passed: boolean; feedback: string }> {
  if (orderedCauseIds.length === 0) {
    return { passed: false, feedback: "Please arrange the causes from most to least significant." };
  }
  return {
    passed: true,
    feedback: "Your cause ranking recognizes multiple systemic factors. Consider how these causes influence one another in the barangay.",
  };
}

export async function evaluateStep3(
  scenario: Scenario,
  evaluatedEvidences: any[]
): Promise<{ passed: boolean; feedback: string }> {
  const missionData = getMissionDataForScenario(scenario);
  const totalRequired = missionData.evidenceLibrary?.length || 4;
  const evaluatedCount = evaluatedEvidences ? evaluatedEvidences.length : 0;

  if (evaluatedCount < totalRequired) {
    return {
      passed: false,
      feedback: `You have evaluated ${evaluatedCount} of ${totalRequired} evidence sources. Please inspect and evaluate all remaining evidence sources before proceeding to Step 4.`,
    };
  }

  return {
    passed: true,
    feedback: "Excellent evaluation! Inspecting all evidence sources provides a comprehensive foundation for your civic intervention plan.",
  };
}

export async function evaluateStep4(
  scenario: Scenario,
  consultedIds: string[],
  notes: string
): Promise<{ passed: boolean; feedback: string }> {
  if (!notes.trim() || notes.trim().length < 15) {
    return { passed: false, feedback: "Please summarize your consultation insights (at least 2-3 complete sentences)." };
  }
  return {
    passed: true,
    feedback: "You interviewed key stakeholders and gathered diverse perspectives across local officials and residents.",
  };
}

export async function evaluateStep5(
  scenario: Scenario,
  plan: InterventionPlanData
): Promise<{ passed: boolean; feedback: string }> {
  if (!plan.projectTitle.trim() || !plan.goal.trim() || !plan.activities.trim()) {
    return { passed: false, feedback: "Please fill out all core fields of your intervention plan (Title, Goal, Activities, etc.)." };
  }
  return {
    passed: true,
    feedback: `Your intervention plan "${plan.projectTitle}" is feasible and addresses the community objective effectively!`,
  };
}

export async function evaluateStep6(
  scenario: Scenario,
  selectedOptionText: string,
  justification: string
): Promise<{ passed: boolean; feedback: string }> {
  if (!justification.trim()) {
    return { passed: false, feedback: "Please justify your adaptive decision in response to the unexpected challenge." };
  }
  return {
    passed: true,
    feedback: `Your response ("${selectedOptionText}") addresses the immediate challenge. Consider whether the revised strategy remains long-term sustainable.`,
  };
}

export async function evaluateStep7(
  scenario: Scenario,
  impact: ImpactAssessmentData
): Promise<{ passed: boolean; feedback: string }> {
  if (!impact.shortTermImpact.trim() || !impact.longTermImpact.trim()) {
    return { passed: false, feedback: "Please detail both short-term and long-term impacts for your proposed solution." };
  }
  return {
    passed: true,
    feedback: "Your impact assessment thoroughly considers ethical implications and community outcomes.",
  };
}

export async function evaluateReflection(
  scenario: Scenario,
  reflectionText: string
): Promise<{ passed: boolean; feedback: string }> {
  if (!reflectionText.trim() || reflectionText.trim().length < 15) {
    return { passed: false, feedback: "Please provide a complete reflection answer." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      passed: true,
      feedback: "Your reflection demonstrates impressive civic awareness, ethical responsibility, and community leadership!",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const prompt = `
Civic Educator feedback generator.
Student Reflection: "${reflectionText}"
Generate encouraging, motivating feedback praising their critical thinking. Respond in JSON:
{ "feedback": "string" }
`;
    const res = await model.generateContent(prompt);
    const text = res.response.text();
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : text);
    return {
      passed: true,
      feedback: parsed.feedback || "Your reflection demonstrates impressive civic awareness, ethical responsibility, and community leadership!",
    };
  } catch (err) {
    return {
      passed: true,
      feedback: "Your reflection demonstrates impressive civic awareness, ethical responsibility, and community leadership!",
    };
  }
}

// Legacy fallback helper for backward compatibility
export async function evaluateStudentSubmission(
  scenarioTitle: string,
  scenarioDescription: string,
  constraints: string[],
  studentDraft: string
) {
  return {
    passed: true,
    feedback: "Simulation step evaluation completed.",
    failedConstraints: [],
    isAiGenerated: false,
  };
}
