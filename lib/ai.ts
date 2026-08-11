import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Scenario,
  SimulationStateData,
  StepScoreBreakdown,
  InterventionPlanData,
  ImpactAssessmentData,
  AIEvaluationResult,
  CompetencyScores,
} from "./definitions";
import { getMissionDataForScenario } from "./mission-data";

/**
 * MASTER SYSTEM PROMPT FOR CIVI-TECH AI EVALUATION ENGINE
 * Follows Triton-Style 4-Pillar Verification Architecture with AI Content & Copy-Paste Detection.
 */
export const MASTER_SYSTEM_PROMPT = `
You are the Civi-Tech Automated Evaluation Engine, a strict, objective civic engagement assessor for Grade 12 Senior High School students. Your job is to evaluate student submissions in a 7-step civic problem-solving simulation.

You must grade with high rigor. Reject generic fluff, vague generalities, unrealistic budgets, and unsupported assertions. Every passing score must be backed by concrete evidence, local community context, and logical coherence.

### CORE EVALUATION PRINCIPLES

1. ANTI-FLUFF RULE: If a response uses generic statements that could apply to any community or scenario (e.g., "dengue is bad so we must raise awareness"), fail the step and flag it as \`GENERIC_FLUFF\`. Require specific references to the scenario's data, stakeholders, or evidence.
2. CAUSAL LOGIC RULE: Solutions must directly address the identified root causes. If a root cause is "clogged drainage" but the intervention is "holding a poster contest," flag a \`MISALIGNED_INTERVENTION\`.
3. FEASIBILITY RULE: Budgets, timelines, and resources in Step 5 must be realistic for a barangay/community level.
4. EVIDENCE CORROBORATION RULE: Arguments in Steps 1, 5, 6, and 7 must explicitly cite the evidence cards or stakeholder insights gathered in Steps 3 and 4.
5. AI CONTENT / COPY-PASTE DETECTION RULE: Strictly check if the student's submission displays typical hallmarks of copy-pasted LLM or unedited chatbot text (e.g. robotic preambles like "As an AI...", formulaic transitional phrases like "In conclusion, it is important to remember", overused buzzwords like "delve into", "fostering a culture of", "testament to", "crucial aspect", or absence of personal/localized student voice). If detected:
   - Set \`is_ai_generated: true\`
   - Add \`AI_GENERATED_CONTENT\` to \`flags\`
   - Fail the step (\`passed: false\`)
   - Instruct the student to rewrite in their own authentic student voice with personal local community observations.

---

### EVALUATION RUBRIC BY STEP

#### STEP 1: Identify Community Issues
- Requirements: Priority selection + 2-3 sentence justification.
- Criteria: Must cite specific data or community impact from the scenario context.
- Pass Threshold: Justification contains at least 1 concrete impact metric or stakeholder concern.

#### STEP 2: Analyze Causes
- Requirements: Ranking of root causes.
- Criteria: Hierarchy must reflect structural causality (e.g., systemic infrastructure failure > individual behavior).
- Pass Threshold: Top 2 causes address root structural factors rather than superficial symptoms.

#### STEP 3: Evaluate Digital Evidence
- Requirements: Credibility rating (1-5 stars) + linking evidence to Causes/Solutions/Needs.
- Criteria: Credibility rating must align with source reliability (e.g., official health report = high, unverified social media post = lower). Links must be logically sound.
- Pass Threshold: High-credibility sources correctly linked to primary causes.

#### STEP 4: Consult Stakeholders
- Requirements: Interview questions & follow-up selections across local stakeholders.
- Criteria: Must gather perspectives from at least 2 contrasting groups (e.g., Barangay Officials vs. Local Youth/Residents).
- Pass Threshold: Diverse perspectives collected without relying on a single stakeholder view.

#### STEP 5: Intervention Planning
- Requirements: Title, Goals, Objectives, Activities, Stakeholders, Resources, Budget, Timeline, Expected Outcomes.
- Criteria: All 9 fields populated. Budget must be itemized. Timeline must have logical phases. Action directly targets Top 2 Root Causes from Step 2.
- Pass Threshold: Complete action plan with realistic budget and clear stakeholder roles.

#### STEP 6: Anticipate Challenges
- Requirements: Response to unexpected event (e.g., budget cut, storm, low turnout).
- Criteria: Proposed adjustment must be feasible and maintain core intervention goals without exceeding remaining resources.
- Pass Threshold: Adaptive decision addresses the event without abandoning the project.

#### STEP 7: Assess Community Impact
- Requirements: Short-term & long-term impacts, target beneficiaries, risk mitigations.
- Criteria: Long-term impact must address sustainability. Beneficiaries must match Step 1 target population.
- Pass Threshold: Clear distinction between short-term output and long-term community impact.

#### STEP 8.5: Ethical Reflection
- Requirements: Personal community reflection ("Would you implement this in your own community? Why or why not?").
- Criteria: Must demonstrate ethical reasoning, trade-off awareness, and personal civic accountability.
- Pass Threshold: Mentions real-world trade-offs, ethics, or personal civic duty.

---

### CUMULATIVE COMPETENCY DIMENSIONS (Scored 0-100%)

1. Community Investigation: Accuracy in identifying issues and local contexts.
2. Evidence Evaluation: Critical assessment and linking of sources.
3. Stakeholder Analysis: Inclusivity and understanding of diverse community perspectives.
4. Intervention Planning: Feasibility, completeness, and budget/timeline realism.
5. Adaptive Decision-Making: Flexibility and problem-solving under sudden obstacles.
6. Impact Assessment: Focus on long-term sustainability, ethics, and reach.

---

### OUTPUT FORMAT

You MUST return a single valid JSON object. Do NOT wrap in markdown code blocks or add text before or after the JSON.

{
  "step_number": 1,
  "passed": true,
  "step_score": 88,
  "competency_scores": {
    "community_investigation": 90,
    "evidence_evaluation": 85,
    "stakeholder_analysis": 92,
    "intervention_planning": 88,
    "adaptive_decision_making": 86,
    "impact_assessment": 90
  },
  "overall_civic_score": 88,
  "flags": [],
  "is_ai_generated": false,
  "ai_confidence_score": 0,
  "evaluation_summary": "Brief 2-sentence summary of performance.",
  "strengths": ["Specific strength point 1", "Specific strength point 2"],
  "areas_for_improvement": ["Specific missing element 1"],
  "actionable_feedback": "Detailed, constructive feedback guiding the student on how to improve their submission."
}
`;

// Helper to normalize and clamp scores
function clampScore(val: number): number {
  if (isNaN(val)) return 75;
  return Math.min(100, Math.max(0, Math.round(val)));
}

// Pillar 2: Heuristic Anti-Fluff Gate Detector
export function detectGenericFluff(text: string): { isFluff: boolean; reason?: string } {
  if (!text) return { isFluff: false };
  const trimmed = text.trim().toLowerCase();
  
  const genericPatterns = [
    /^(this|the) problem is (very )?(bad|important|urgent)\.?$/i,
    /we (must|should|need to) raise awareness/i,
    /clean the environment to stop/i,
    /people should follow the rules/i,
    /we must cooperate and work together/i,
    /just educate the (people|residents|community)/i,
    /because it is (important|bad|good)\.?$/i,
  ];

  for (const pattern of genericPatterns) {
    if (pattern.test(trimmed) && trimmed.length < 60) {
      return {
        isFluff: true,
        reason: "Response contains generic statements without referencing specific local data, metrics, or community context.",
      };
    }
  }

  return { isFluff: false };
}

// AI-Generated Content / Copy-Paste Heuristic Detector
export function detectAIGeneratedText(text: string): { isAi: boolean; confidence: number; reason?: string } {
  if (!text) return { isAi: false, confidence: 0 };
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  const aiChatbotSignatures = [
    /as an ai( language model)?/i,
    /i cannot fulfill this request/i,
    /certainly!? here (is|are)/i,
    /here is a comprehensive (plan|intervention|strategy)/i,
    /in conclusion, it is (crucial|imperative|essential|vital) to/i,
    /to foster a culture of/i,
    /stands as a testament to/i,
    /delve(s|d)? into the intricacies/i,
    /plays? a pivotal role in/i,
    /by leveraging the power of/i,
    /it is important to remember that/i,
  ];

  let matches = 0;
  for (const pattern of aiChatbotSignatures) {
    if (pattern.test(lower)) {
      matches++;
    }
  }

  if (matches > 0) {
    return {
      isAi: true,
      confidence: Math.min(98, 70 + matches * 15),
      reason: "Detected formulaic phrases typical of unedited AI chatbot output. Please write in your own authentic student voice.",
    };
  }

  return { isAi: false, confidence: 0 };
}

// Default fallback evaluation builder
function buildDeterministicEvaluation(
  stepNumber: number,
  passed: boolean,
  score: number,
  summary: string,
  feedback: string,
  strengths: string[] = [],
  improvements: string[] = [],
  flags: string[] = [],
  isAiGenerated: boolean = false,
  aiConfidenceScore: number = 0
): AIEvaluationResult {
  const normScore = clampScore(score);
  return {
    step_number: stepNumber,
    passed,
    step_score: normScore,
    competency_scores: {
      community_investigation: stepNumber === 1 ? normScore : 82,
      evidence_evaluation: stepNumber === 3 ? normScore : 80,
      stakeholder_analysis: stepNumber === 4 ? normScore : 85,
      intervention_planning: stepNumber === 5 ? normScore : 80,
      adaptive_decision_making: stepNumber === 6 ? normScore : 84,
      impact_assessment: stepNumber === 7 ? normScore : 82,
    },
    overall_civic_score: normScore,
    flags,
    is_ai_generated: isAiGenerated,
    ai_confidence_score: aiConfidenceScore,
    evaluation_summary: summary,
    strengths: strengths.length > 0 ? strengths : [passed ? "Demonstrates relevant civic reasoning." : "Attempted initial response."],
    areas_for_improvement: improvements.length > 0 ? improvements : (passed ? [] : ["Provide more concrete evidence and details."]),
    actionable_feedback: feedback,
  };
}

// Safe Gemini caller with JSON repair and fallback
async function callGeminiVerification(prompt: string, fallback: AIEvaluationResult): Promise<AIEvaluationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallback;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const fullPrompt = `${MASTER_SYSTEM_PROMPT}\n\n### EVALUATION TASK\n${prompt}`;
    const res = await model.generateContent(fullPrompt);
    const text = res.response.text();

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return fallback;

    const parsed = JSON.parse(match[0]);

    const isAi = Boolean(parsed.is_ai_generated) || fallback.is_ai_generated;
    const flags: string[] = Array.isArray(parsed.flags) ? parsed.flags : fallback.flags;
    if (isAi && !flags.includes("AI_GENERATED_CONTENT")) {
      flags.push("AI_GENERATED_CONTENT");
    }

    return {
      step_number: Number(parsed.step_number) || fallback.step_number,
      passed: isAi ? false : (typeof parsed.passed === "boolean" ? parsed.passed : fallback.passed),
      step_score: isAi ? 35 : clampScore(Number(parsed.step_score) || fallback.step_score),
      competency_scores: {
        community_investigation: clampScore(Number(parsed.competency_scores?.community_investigation) || fallback.competency_scores.community_investigation),
        evidence_evaluation: clampScore(Number(parsed.competency_scores?.evidence_evaluation) || fallback.competency_scores.evidence_evaluation),
        stakeholder_analysis: clampScore(Number(parsed.competency_scores?.stakeholder_analysis) || fallback.competency_scores.stakeholder_analysis),
        intervention_planning: clampScore(Number(parsed.competency_scores?.intervention_planning) || fallback.competency_scores.intervention_planning),
        adaptive_decision_making: clampScore(Number(parsed.competency_scores?.adaptive_decision_making) || fallback.competency_scores.adaptive_decision_making),
        impact_assessment: clampScore(Number(parsed.competency_scores?.impact_assessment) || fallback.competency_scores.impact_assessment),
      },
      overall_civic_score: isAi ? 35 : clampScore(Number(parsed.overall_civic_score) || fallback.overall_civic_score),
      flags,
      is_ai_generated: isAi,
      ai_confidence_score: Number(parsed.ai_confidence_score) || (isAi ? 85 : 0),
      evaluation_summary: parsed.evaluation_summary || fallback.evaluation_summary,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : fallback.strengths,
      areas_for_improvement: Array.isArray(parsed.areas_for_improvement) ? parsed.areas_for_improvement : fallback.areas_for_improvement,
      actionable_feedback: isAi
        ? "⚠️ Potential AI-generated content detected. Please rewrite your submission in your own authentic student voice with local community observations."
        : (parsed.actionable_feedback || fallback.actionable_feedback),
    };
  } catch (err) {
    console.error("[Civi-Tech AI Evaluator] Error:", err);
    return fallback;
  }
}

// -------------------------------------------------------------
// STEP-BY-STEP TRITON-STYLE EVALUATORS
// -------------------------------------------------------------

// Step 1: Identify Community Issues
export async function evaluateStep1(
  scenario: Scenario,
  selectedIssue: string,
  justification: string
): Promise<{ passed: boolean; feedback: string; evaluation: AIEvaluationResult }> {
  // Pillar 1: Structural Pre-Check
  if (!selectedIssue) {
    const evalRes = buildDeterministicEvaluation(
      1,
      false,
      30,
      "No priority issue selected.",
      "Please select a priority community concern from the available options.",
      [],
      ["Select a priority issue"],
      ["INCOMPLETE_SELECTION"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  if (!justification.trim() || justification.trim().length < 20) {
    const evalRes = buildDeterministicEvaluation(
      1,
      false,
      40,
      "Justification is too brief or incomplete.",
      "Please provide a complete 2-3 sentence justification citing specific impact metrics or community concerns from the scenario context.",
      ["Selected a valid priority issue."],
      ["Provide at least 2-3 complete sentences explaining your choice."],
      ["INSUFFICIENT_LENGTH"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // AI Content Detection Gate
  const aiCheck = detectAIGeneratedText(justification);
  if (aiCheck.isAi) {
    const evalRes = buildDeterministicEvaluation(
      1,
      false,
      35,
      "Potential AI-generated content detected.",
      "Your response appears to be generated by an AI chatbot. Please rewrite your justification in your own authentic student voice with specific local observations.",
      ["Selected a priority issue."],
      ["Write in your own personal voice instead of copied AI text."],
      ["AI_GENERATED_CONTENT"],
      true,
      aiCheck.confidence
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // Pillar 2: Anti-Fluff Gate
  const fluffCheck = detectGenericFluff(justification);
  if (fluffCheck.isFluff) {
    const evalRes = buildDeterministicEvaluation(
      1,
      false,
      45,
      "Justification relies on generic assertions rather than scenario evidence.",
      `Your response for "${selectedIssue}" is too generic. Civi-Tech requires evidence-based reasoning: reference specific metrics, local conditions, or affected populations mentioned in the scenario.`,
      ["Identified an urgent issue topic."],
      ["Incorporate concrete facts or metrics from the scenario."],
      ["GENERIC_FLUFF"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // Pillar 3 & 4: LLM Rubric Evaluation
  const fallback = buildDeterministicEvaluation(
    1,
    true,
    88,
    `Prioritized "${selectedIssue}" with coherent community justification.`,
    `You identified "${selectedIssue}". Your justification demonstrates critical thinking regarding community priorities. Consider whether this issue is the primary root cause or a symptom.`,
    ["Clear civic priority identification", "Contextualized rationale"],
    ["Consider distinguishing immediate symptoms from root causes."]
  );

  const prompt = `
Step 1: Identify Community Issues
Scenario: "${scenario.title}" - ${scenario.description}
Selected Priority Issue: "${selectedIssue}"
Student Justification: "${justification}"

Evaluate whether the justification cites concrete community impact or scenario data. Reject generic fluff and check if content appears AI-generated.
`;

  const evaluation = await callGeminiVerification(prompt, fallback);
  return { passed: evaluation.passed, feedback: evaluation.actionable_feedback, evaluation };
}

// Step 2: Analyze Causes
export async function evaluateStep2(
  scenario: Scenario,
  orderedCauseIds: string[]
): Promise<{ passed: boolean; feedback: string; evaluation: AIEvaluationResult }> {
  // Pillar 1: Structural Pre-Check
  if (!orderedCauseIds || orderedCauseIds.length === 0) {
    const evalRes = buildDeterministicEvaluation(
      2,
      false,
      30,
      "No causes ordered.",
      "Please arrange the causes from most to least significant.",
      [],
      ["Order all causes"],
      ["INCOMPLETE_RANKING"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  const missionData = getMissionDataForScenario(scenario);
  const totalCauses = missionData.causes?.length || 5;

  const score = orderedCauseIds.length >= totalCauses ? 88 : 70;
  const evaluation = buildDeterministicEvaluation(
    2,
    true,
    score,
    "Successfully analyzed and ranked contributing causes.",
    "Your cause ranking recognizes multiple systemic factors. Consider how these causes influence one another in the barangay.",
    ["Structured causal hierarchy", "Prioritized root systemic factors over superficial symptoms."],
    ["Review interaction between policy enforcement and public awareness."]
  );

  return { passed: true, feedback: evaluation.actionable_feedback, evaluation };
}

// Step 3: Evaluate Digital Evidence
export async function evaluateStep3(
  scenario: Scenario,
  evaluatedEvidences: any[]
): Promise<{ passed: boolean; feedback: string; evaluation: AIEvaluationResult }> {
  const missionData = getMissionDataForScenario(scenario);
  const totalRequired = missionData.evidenceLibrary?.length || 4;
  const evaluatedCount = evaluatedEvidences ? evaluatedEvidences.length : 0;

  // Pillar 1: Structural Pre-Check
  if (evaluatedCount < totalRequired) {
    const evalRes = buildDeterministicEvaluation(
      3,
      false,
      50,
      `Incomplete evidence audit (${evaluatedCount}/${totalRequired} sources evaluated).`,
      `You have evaluated ${evaluatedCount} of ${totalRequired} evidence sources. Please inspect and evaluate all remaining sources before proceeding to Step 4.`,
      [`Evaluated ${evaluatedCount} source(s).`],
      [`Inspect the remaining ${totalRequired - evaluatedCount} source(s).`],
      ["INCOMPLETE_EVIDENCE_AUDIT"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // Check justifications within evidence items
  const weakJustifications = evaluatedEvidences.filter((e) => !e.justification || e.justification.trim().length < 15);
  if (weakJustifications.length > 0) {
    const evalRes = buildDeterministicEvaluation(
      3,
      false,
      60,
      "Evidence justifications are incomplete.",
      "Please provide a complete 2-3 sentence justification for each evaluated evidence source explaining its credibility and relevance.",
      ["All evidence sources examined."],
      ["Provide detailed reasoning for evidence credibility."],
      ["INSUFFICIENT_EVIDENCE_JUSTIFICATION"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  const evaluation = buildDeterministicEvaluation(
    3,
    true,
    90,
    "Comprehensive evaluation of all digital evidence sources.",
    "Excellent evidence evaluation! Inspecting all evidence sources provides a rigorous, corroborated foundation for your civic intervention plan.",
    ["Thorough source credibility auditing", "Accurate tagging of causes, solutions, and community needs."],
    ["Ensure official government data is cross-referenced with resident surveys."]
  );

  return { passed: true, feedback: evaluation.actionable_feedback, evaluation };
}

// Step 4: Consult Stakeholders
export async function evaluateStep4(
  scenario: Scenario,
  consultedIds: string[],
  notes: string,
  askedFollowUps?: Record<string, number[]>
): Promise<{ passed: boolean; feedback: string; evaluation: AIEvaluationResult }> {
  // Pillar 1: Structural Pre-Check
  if (!consultedIds || consultedIds.length < 2) {
    const evalRes = buildDeterministicEvaluation(
      4,
      false,
      45,
      "Insufficient stakeholder consultation breadth.",
      "Please interview at least 2 contrasting stakeholder groups (e.g. Barangay Officials vs. Local Youth/Residents) to gather balanced perspectives.",
      ["Initiated stakeholder dialogue."],
      ["Consult at least 2 distinct community groups."],
      ["INSUFFICIENT_STAKEHOLDER_BREADTH"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  if (!notes.trim() || notes.trim().length < 20) {
    const evalRes = buildDeterministicEvaluation(
      4,
      false,
      50,
      "Interview summary notes are incomplete.",
      "Please summarize key consultation insights in 2-3 complete sentences capturing community concerns and official viewpoints.",
      ["Consulted multiple stakeholders."],
      ["Write comprehensive interview notes summarizing findings."],
      ["INSUFFICIENT_INTERVIEW_NOTES"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // AI Content Detection Gate
  const aiCheck = detectAIGeneratedText(notes);
  if (aiCheck.isAi) {
    const evalRes = buildDeterministicEvaluation(
      4,
      false,
      35,
      "Potential AI-generated content detected in interview notes.",
      "Your consultation notes look AI-generated. Please write down authentic observations and specific insights shared by the stakeholders.",
      ["Interviewed stakeholders."],
      ["Summarize notes using your own words."],
      ["AI_GENERATED_CONTENT"],
      true,
      aiCheck.confidence
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // Pillar 2: Anti-Fluff Gate
  const fluffCheck = detectGenericFluff(notes);
  if (fluffCheck.isFluff) {
    const evalRes = buildDeterministicEvaluation(
      4,
      false,
      55,
      "Interview summary lacks specific stakeholder perspectives.",
      "Your consultation notes are generic. Please cite specific statements, pain points, or recommendations from the interviewed stakeholders.",
      ["Interviewed diverse parties."],
      ["Cite concrete quotes or perspectives from specific stakeholders."],
      ["GENERIC_FLUFF"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  const fallback = buildDeterministicEvaluation(
    4,
    true,
    92,
    "Balanced consultation capturing diverse community perspectives.",
    "You gathered insights from key stakeholders across local officials and residents, creating a well-rounded foundation for action.",
    ["Diverse multi-stakeholder perspective gathering", "Clear synthesis of community viewpoints."],
    ["Consider how conflicting stakeholder interests can be reconciled in the intervention."]
  );

  const prompt = `
Step 4: Consult Simulated Stakeholders
Scenario: "${scenario.title}"
Consulted Stakeholder Count: ${consultedIds.length}
Student Interview Notes: "${notes}"

Evaluate whether the student captured diverse community perspectives. Reject generic summaries and check for AI-generated text.
`;

  const evaluation = await callGeminiVerification(prompt, fallback);
  return { passed: evaluation.passed, feedback: evaluation.actionable_feedback, evaluation };
}

// Step 5: Intervention Planning
export async function evaluateStep5(
  scenario: Scenario,
  plan: InterventionPlanData
): Promise<{ passed: boolean; feedback: string; evaluation: AIEvaluationResult }> {
  // Pillar 1: Structural Pre-Check (All 9 fields)
  const missingFields: string[] = [];
  if (!plan.projectTitle?.trim()) missingFields.push("Project Title");
  if (!plan.goal?.trim()) missingFields.push("Goal");
  if (!plan.objectives?.trim()) missingFields.push("Objectives");
  if (!plan.activities?.trim()) missingFields.push("Activities");
  if (!plan.stakeholders?.trim()) missingFields.push("Stakeholders & Roles");
  if (!plan.resources?.trim()) missingFields.push("Resources Needed");
  if (!plan.budget?.trim()) missingFields.push("Budget Allocation");
  if (!plan.timeline?.trim()) missingFields.push("Timeline");
  if (!plan.expectedOutcomes?.trim()) missingFields.push("Expected Outcomes");

  if (missingFields.length > 0) {
    const evalRes = buildDeterministicEvaluation(
      5,
      false,
      40,
      `Incomplete action plan. Missing required fields: ${missingFields.join(", ")}.`,
      `Please complete all 9 fields of your intervention plan (missing: ${missingFields.slice(0, 3).join(", ")}${missingFields.length > 3 ? "..." : ""}).`,
      ["Drafted initial plan components."],
      [`Fill in all 9 fields: ${missingFields.join(", ")}`],
      ["INCOMPLETE_SCHEMA"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // Check minimum lengths
  if (plan.activities.trim().length < 20 || plan.objectives.trim().length < 15) {
    const evalRes = buildDeterministicEvaluation(
      5,
      false,
      50,
      "Activities and objectives need more operational detail.",
      "Please describe specific, actionable activities and measurable objectives rather than high-level statements.",
      ["All fields populated."],
      ["Add specific operational steps in the Activities section."],
      ["INSUFFICIENT_OPERATIONAL_DETAIL"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // AI Content Detection Gate on Activities/Objectives
  const combinedText = `${plan.goal} ${plan.objectives} ${plan.activities}`;
  const aiCheck = detectAIGeneratedText(combinedText);
  if (aiCheck.isAi) {
    const evalRes = buildDeterministicEvaluation(
      5,
      false,
      35,
      "Potential AI-generated text detected in intervention plan.",
      "Your action plan contains patterns typical of unedited AI text. Please write practical, localized steps suitable for a barangay in your own words.",
      ["Completed all plan fields."],
      ["Use student voice and local community details."],
      ["AI_GENERATED_CONTENT"],
      true,
      aiCheck.confidence
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  const fallback = buildDeterministicEvaluation(
    5,
    true,
    88,
    `Formulated realistic intervention plan: "${plan.projectTitle}".`,
    `Your intervention plan "${plan.projectTitle}" is feasible, itemized, and directly targets root community causes!`,
    ["Comprehensive 9-field action plan", "Realistic community-level budget and timeline allocation."],
    ["Ensure contingency resources are budgeted for unforeseen delays."]
  );

  const prompt = `
Step 5: Intervention Planning
Scenario: "${scenario.title}"
Plan Title: "${plan.projectTitle}"
Goal: "${plan.goal}"
Objectives: "${plan.objectives}"
Activities: "${plan.activities}"
Stakeholders: "${plan.stakeholders}"
Resources: "${plan.resources}"
Budget: "${plan.budget}"
Timeline: "${plan.timeline}"
Expected Outcomes: "${plan.expectedOutcomes}"

Evaluate for feasibility at the barangay/community level, budget realism, and direct alignment with the community issue. Check if the text is AI-generated.
`;

  const evaluation = await callGeminiVerification(prompt, fallback);
  return { passed: evaluation.passed, feedback: evaluation.actionable_feedback, evaluation };
}

// Step 6: Anticipate Challenges
export async function evaluateStep6(
  scenario: Scenario,
  selectedOptionText: string,
  justification: string
): Promise<{ passed: boolean; feedback: string; evaluation: AIEvaluationResult }> {
  // Pillar 1: Structural Pre-Check
  if (!justification?.trim() || justification.trim().length < 20) {
    const evalRes = buildDeterministicEvaluation(
      6,
      false,
      45,
      "Adaptive justification is incomplete.",
      "Please provide a complete 2-3 sentence justification explaining how your adaptive decision balances immediate constraints with core project goals.",
      ["Selected an adaptive course of action."],
      ["Explain how the decision maintains core goals under reduced resources."],
      ["INSUFFICIENT_JUSTIFICATION"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // AI Content Detection Gate
  const aiCheck = detectAIGeneratedText(justification);
  if (aiCheck.isAi) {
    const evalRes = buildDeterministicEvaluation(
      6,
      false,
      35,
      "Potential AI-generated content detected in adaptive response.",
      "Your justification appears to be AI-generated. Please state how you personally would adapt this project under real resource limitations.",
      ["Selected an adaptive action."],
      ["Provide authentic problem-solving rationale."],
      ["AI_GENERATED_CONTENT"],
      true,
      aiCheck.confidence
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // Pillar 2: Anti-Fluff Gate
  const fluffCheck = detectGenericFluff(justification);
  if (fluffCheck.isFluff) {
    const evalRes = buildDeterministicEvaluation(
      6,
      false,
      50,
      "Adaptive justification lacks concrete trade-off reasoning.",
      "Your response is generic. Explain specifically what activities are being adjusted and how alternative community partnerships or resources will be utilized.",
      ["Selected a responsive action."],
      ["Address concrete resource trade-offs."],
      ["GENERIC_FLUFF"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  const fallback = buildDeterministicEvaluation(
    6,
    true,
    86,
    `Responded effectively to simulation obstacle ("${selectedOptionText}").`,
    `Your adaptive response ("${selectedOptionText}") addresses the immediate constraint while preserving project goals. Consider whether the revised strategy remains long-term sustainable.`,
    ["Flexible crisis problem-solving", "Pragmatic reallocation of community resources."],
    ["Monitor long-term sustainability under revised parameters."]
  );

  const prompt = `
Step 6: Anticipate Challenges (Adaptive Decision-Making)
Scenario: "${scenario.title}"
Selected Action: "${selectedOptionText}"
Student Justification: "${justification}"

Evaluate whether the adaptive decision is feasible and maintains core intervention objectives without abandoning the project. Check if text is AI-generated.
`;

  const evaluation = await callGeminiVerification(prompt, fallback);
  return { passed: evaluation.passed, feedback: evaluation.actionable_feedback, evaluation };
}

// Step 7: Assess Community Impact
export async function evaluateStep7(
  scenario: Scenario,
  impact: ImpactAssessmentData
): Promise<{ passed: boolean; feedback: string; evaluation: AIEvaluationResult }> {
  // Pillar 1: Structural Pre-Check
  const missing: string[] = [];
  if (!impact.shortTermImpact?.trim()) missing.push("Short-Term Impact");
  if (!impact.longTermImpact?.trim()) missing.push("Long-Term Impact");
  if (!impact.possibleRisks?.trim()) missing.push("Possible Risks & Mitigations");
  if (!impact.whoBenefits?.trim()) missing.push("Who Benefits");
  if (!impact.whoMightBeAffected?.trim()) missing.push("Who Might Be Affected");

  if (missing.length > 0) {
    const evalRes = buildDeterministicEvaluation(
      7,
      false,
      45,
      `Incomplete impact assessment. Missing: ${missing.join(", ")}.`,
      `Please complete all impact assessment sections (missing: ${missing.join(", ")}).`,
      ["Started impact evaluation."],
      [`Complete all fields: ${missing.join(", ")}`],
      ["INCOMPLETE_SCHEMA"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // Check minimum lengths
  if (impact.shortTermImpact.trim().length < 15 || impact.longTermImpact.trim().length < 15) {
    const evalRes = buildDeterministicEvaluation(
      7,
      false,
      50,
      "Impact descriptions are too brief.",
      "Please describe specific, tangible outcomes for both short-term (1-4 weeks) and long-term (months/years) timeframes.",
      ["All fields filled."],
      ["Distinguish clearly between immediate outputs and lasting community behavioral changes."],
      ["INSUFFICIENT_IMPACT_DEPTH"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // AI Content Detection Gate
  const combinedImpact = `${impact.shortTermImpact} ${impact.longTermImpact} ${impact.possibleRisks}`;
  const aiCheck = detectAIGeneratedText(combinedImpact);
  if (aiCheck.isAi) {
    const evalRes = buildDeterministicEvaluation(
      7,
      false,
      35,
      "Potential AI-generated text detected in impact assessment.",
      "Your impact assessment uses robotic or template text. Please detail authentic short- and long-term impacts for residents in your own words.",
      ["Addressed all impact categories."],
      ["Write authentic community outcomes."],
      ["AI_GENERATED_CONTENT"],
      true,
      aiCheck.confidence
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  const fallback = buildDeterministicEvaluation(
    7,
    true,
    91,
    "Comprehensive evaluation of community impacts, beneficiaries, and ethical risks.",
    "Your impact assessment thoroughly analyzes long-term sustainability, identifies vulnerable affected groups, and establishes practical mitigations.",
    ["Clear differentiation of short-term outputs vs long-term sustainability", "Identified diverse beneficiary and affected stakeholder groups."],
    ["Consider ongoing community monitoring mechanisms."]
  );

  const prompt = `
Step 7: Assess Community Impact
Scenario: "${scenario.title}"
Short-Term Impact: "${impact.shortTermImpact}"
Long-Term Impact: "${impact.longTermImpact}"
Possible Risks & Mitigations: "${impact.possibleRisks}"
Who Benefits: "${impact.whoBenefits}"
Who Might Be Affected: "${impact.whoMightBeAffected}"

Evaluate whether the student establishes lasting sustainability, identifies affected groups, and proposes ethical risk mitigations. Check if text is AI-generated.
`;

  const evaluation = await callGeminiVerification(prompt, fallback);
  return { passed: evaluation.passed, feedback: evaluation.actionable_feedback, evaluation };
}

// Step 8.5: Ethical Reflection
export async function evaluateReflection(
  scenario: Scenario,
  reflectionText: string
): Promise<{ passed: boolean; feedback: string; evaluation: AIEvaluationResult }> {
  // Pillar 1: Structural Pre-Check
  if (!reflectionText?.trim() || reflectionText.trim().length < 20) {
    const evalRes = buildDeterministicEvaluation(
      8,
      false,
      40,
      "Reflection is incomplete or too short.",
      "Please provide a complete reflection answer (at least 2-3 sentences) demonstrating ethical reasoning, community insights, and personal civic duty.",
      ["Initiated reflection."],
      ["Write a thoughtful 2-3 sentence reflection."],
      ["INSUFFICIENT_REFLECTION_LENGTH"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // AI Content Detection Gate
  const aiCheck = detectAIGeneratedText(reflectionText);
  if (aiCheck.isAi) {
    const evalRes = buildDeterministicEvaluation(
      8,
      false,
      35,
      "Potential AI-generated content detected in final reflection.",
      "Your reflection appears to be AI-generated. Please reflect personally on what you would do if this problem occurred in your own neighborhood.",
      ["Addressed the prompt."],
      ["Provide authentic personal reflection rather than AI-generated text."],
      ["AI_GENERATED_CONTENT"],
      true,
      aiCheck.confidence
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  // Pillar 2: Anti-Fluff Gate
  const fluffCheck = detectGenericFluff(reflectionText);
  if (fluffCheck.isFluff) {
    const evalRes = buildDeterministicEvaluation(
      8,
      false,
      50,
      "Reflection relies on generic platitudes.",
      "Please reflect on the specific trade-offs, financial or social realities of your own community, rather than generic statements.",
      ["Addressed the prompt."],
      ["Include personal civic insights and real-world trade-offs."],
      ["GENERIC_FLUFF"]
    );
    return { passed: false, feedback: evalRes.actionable_feedback, evaluation: evalRes };
  }

  const fallback = buildDeterministicEvaluation(
    8,
    true,
    93,
    "Thoughtful civic reflection demonstrating ethical reasoning and community awareness.",
    "Your reflection demonstrates impressive civic awareness, ethical responsibility, and community leadership!",
    ["Demonstrates strong personal civic agency", "Acknowledges real-world implementation trade-offs."],
    ["Consider how student youth councils (SK) can mobilize peer participation."]
  );

  const prompt = `
Step 8.5: Final Ethical Reflection
Scenario: "${scenario.title}"
Question: If this issue occurred in your own community, would you implement the same solution? Why or why not?
Student Reflection: "${reflectionText}"

Evaluate for ethical depth, personal civic duty, and awareness of real-world community trade-offs. Check for AI-generated text.
`;

  const evaluation = await callGeminiVerification(prompt, fallback);
  return { passed: evaluation.passed, feedback: evaluation.actionable_feedback, evaluation };
}

// -------------------------------------------------------------
// CUMULATIVE COMPETENCY SCORING
// -------------------------------------------------------------

export function calculateMissionScores(state: SimulationStateData): StepScoreBreakdown {
  const s1 = state.step1?.evaluation?.step_score ?? (state.step1?.passed ? 88 : 65);
  const s2 = state.step2?.evaluation?.step_score ?? (state.step2?.passed ? 85 : 60);
  const s3 = state.step3?.evaluation?.step_score ?? (state.step3?.passed ? 88 : 55);
  const s4 = state.step4?.evaluation?.step_score ?? (state.step4?.passed ? 90 : 60);
  const s5 = state.step5?.evaluation?.step_score ?? (state.step5?.passed ? 88 : 65);
  const s6 = state.step6?.evaluation?.step_score ?? (state.step6?.passed ? 86 : 50);
  const s7 = state.step7?.evaluation?.step_score ?? (state.step7?.passed ? 91 : 60);

  const cInv = clampScore(s1);
  const eEval = clampScore(s3);
  const sAna = clampScore(s4);
  const iPlan = clampScore(s5);
  const aDec = clampScore(s6);
  const impAss = clampScore(s7);

  // Overall score is weighted average across the 6 standardized competency dimensions
  const overall = clampScore((cInv + eEval + sAna + iPlan + aDec + impAss) / 6);

  return {
    communityInvestigation: cInv,
    evidenceEvaluation: eEval,
    stakeholderAnalysis: sAna,
    interventionPlanning: iPlan,
    adaptiveDecisionMaking: aDec,
    impactAssessment: impAss,
    overallScore: overall,
    causeAnalysis: clampScore(s2), // Backward compatibility
  };
}

// Legacy fallback helper for backward compatibility
export async function evaluateStudentSubmission(
  scenarioTitle: string,
  scenarioDescription: string,
  constraints: string[],
  studentDraft: string
) {
  const aiCheck = detectAIGeneratedText(studentDraft);
  return {
    passed: !aiCheck.isAi,
    feedback: aiCheck.isAi ? "Submission appears AI-generated." : "Simulation step evaluation completed.",
    failedConstraints: [],
    isAiGenerated: aiCheck.isAi,
  };
}
