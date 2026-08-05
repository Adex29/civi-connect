import { z } from "zod";

// --- Branded Types ---
export type StudentId = string & { readonly __brand: "StudentId" };
export type AdminId = string & { readonly __brand: "AdminId" };
export type ClassroomId = string & { readonly __brand: "ClassroomId" };
export type GroupId = string & { readonly __brand: "GroupId" };
export type ScenarioId = string & { readonly __brand: "ScenarioId" };
export type ClassroomScenarioId = string & { readonly __brand: "ClassroomScenarioId" };
export type ConstraintId = string & { readonly __brand: "ConstraintId" };
export type AssignmentId = string & { readonly __brand: "AssignmentId" };
export type SubmissionId = string & { readonly __brand: "SubmissionId" };

// --- Literal Unions ---
export type StepStatus = "locked" | "in_progress" | "evaluating" | "passed" | "needs_revision";
export type SubmissionStatus = "draft" | "in_progress" | "submitted";
export type ScenarioStatus = "active" | "archived";
export type UserRole = "student" | "admin";

// --- Zod Schemas ---
export const SignupFormSchema = z.object({
  classCode: z.string().length(6, { message: "Class code must be exactly 6 characters" }),
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50),
  lrn: z.string().regex(/^\d{12}$/, { message: "LRN must be exactly 12 digits" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter" })
    .regex(/[0-9]/, { message: "Contain at least one number" }),
  confirmPassword: z.string(),
  isGroup: z.boolean(),
  groupName: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.isGroup && (!data.groupName || data.groupName.length < 2)) return false;
  return true;
}, {
  message: "Group name is required when joining as a group",
  path: ["groupName"],
});

export const LoginFormSchema = z.object({
  lrn: z.string().regex(/^\d{12}$/, { message: "LRN must be exactly 12 digits" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const AdminLoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const CreateClassroomSchema = z.object({
  name: z.string().min(3, { message: "Classroom name must be at least 3 characters" }),
  description: z.string().optional(),
});

export const CreateScenarioSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  context: z.string().min(20, { message: "Context must be at least 20 characters" }),
});

export const CreateConstraintSchema = z.object({
  stepNumber: z.number().int().min(1).max(4),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  criteria: z.string().min(5, { message: "Criteria must be at least 5 characters" }),
});

export const EvaluateStepSchema = z.object({
  response: z.string().min(10, { message: "Response must be at least 10 characters" }),
});

// --- Inferred Types from Zod ---
export type SignupFormInput = z.infer<typeof SignupFormSchema>;
export type LoginFormInput = z.infer<typeof LoginFormSchema>;
export type AdminLoginFormInput = z.infer<typeof AdminLoginFormSchema>;
export type CreateClassroomInput = z.infer<typeof CreateClassroomSchema>;
export type CreateScenarioInput = z.infer<typeof CreateScenarioSchema>;
export type CreateConstraintInput = z.infer<typeof CreateConstraintSchema>;
export type EvaluateStepInput = z.infer<typeof EvaluateStepSchema>;

// --- Entity Interfaces ---
export interface Classroom {
  id: ClassroomId;
  name: string;
  code: string;
  description?: string;
  createdBy: AdminId;
  status: "active" | "archived";
  createdAt: string;
}

export interface Student {
  id: StudentId;
  fullName: string;
  lrn: string;
  passwordHash: string;
  classroomId: ClassroomId;
  groupId?: GroupId;
  createdAt: string;
}

export interface Admin {
  id: AdminId;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

export interface Group {
  id: GroupId;
  name: string;
  classroomId: ClassroomId;
  createdAt: string;
}

export interface MissionDataConfig {
  issues?: string[];
  causes?: CauseItem[];
  evidenceLibrary?: EvidenceItem[];
  stakeholders?: Stakeholder[];
  unexpectedEvent?: UnexpectedEvent;
  stepTips?: Record<number, string>;
}

export interface Scenario {
  id: ScenarioId;
  title: string;
  description: string;
  context?: string;
  constraints: string[];
  status?: ScenarioStatus;
  createdBy?: AdminId;
  createdAt: string;
  missionData?: MissionDataConfig;
}

export interface ClassroomScenario {
  id: ClassroomScenarioId;
  classroomId: ClassroomId;
  scenarioId: ScenarioId;
  isActive: boolean;
  assignedAt: string;
}

export interface Constraint {
  id: ConstraintId;
  scenarioId: ScenarioId;
  stepNumber: number; // 1-4
  description: string;
  criteria: string;
}

export interface Assignment {
  id: AssignmentId;
  scenarioId: ScenarioId;
  classroomId: ClassroomId;
  studentId?: StudentId;
  groupId?: GroupId;
  assignedAt: string;
}

export interface StepData {
  response: string;
  status: StepStatus;
  evaluation?: {
    constraintResults: {
      constraintId: ConstraintId;
      met: boolean;
      feedback: string;
    }[];
    overallFeedback: string;
    score: number; // 0-100
    evaluatedAt: string;
    attempts: number;
  };
  savedAt?: string;
}

export interface Submission {
  id: SubmissionId;
  scenarioId: ScenarioId;
  studentId: StudentId;
  groupId?: GroupId;
  status: string; // "draft" | "in_progress" | "completed"
  content: string;
  feedback: string;
  score: number | null;
  stepProgress?: number; // Current active step (1 to 7)
  simulationState?: SimulationStateData;
  submittedAt: string;
}

// --- Civi-Tech Simulation Engine Types ---
export type StepCategory = 
  | "identify"
  | "analyze"
  | "evidence"
  | "stakeholders"
  | "intervention"
  | "challenge"
  | "impact";

export interface CauseItem {
  id: string;
  title: string;
  description: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: string; // e.g. "Government Report", "Community Survey", "News Article", "Photo Evidence", "Interview", "Social Media"
  snippet: string;
  fullText: string;
  imageUrl?: string; // Optional image / photo URL or base64 photo data
  defaultCredibility: number; // 1-5 stars
  supports: ("cause" | "solution" | "need")[];
}

export interface FollowUpQuestion {
  question: string;
  answer: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  avatarIcon?: string;
  initialStatement: string;
  followUps: FollowUpQuestion[];
}

export interface UnexpectedEvent {
  title: string;
  description: string;
  options: {
    id: string;
    text: string;
    isOptimal: boolean;
    feedback: string;
  }[];
}

export interface InterventionPlanData {
  projectTitle: string;
  goal: string;
  objectives: string;
  activities: string;
  stakeholders: string;
  resources: string;
  budget: string;
  timeline: string;
  expectedOutcomes: string;
}

export interface ImpactAssessmentData {
  shortTermImpact: string;
  longTermImpact: string;
  possibleRisks: string;
  whoBenefits: string;
  whoMightBeAffected: string;
}

export interface StepScoreBreakdown {
  communityInvestigation: number; // Step 1 Score (0-100)
  causeAnalysis: number;           // Step 2 Score (0-100)
  evidenceEvaluation: number;      // Step 3 Score (0-100)
  stakeholderAnalysis: number;     // Step 4 Score (0-100)
  interventionPlanning: number;    // Step 5 Score (0-100)
  adaptiveDecisionMaking: number;  // Step 6 Score (0-100)
  impactAssessment: number;        // Step 7 Score (0-100)
  overallScore: number;            // Average score (0-100)
}

export interface SimulationStateData {
  currentStep: number; // 1 to 7 (or 8 for score/reflection, 9 for complete)
  step1?: {
    selectedIssue: string;
    justification: string;
    feedback?: string;
    passed?: boolean;
  };
  step2?: {
    orderedCauseIds: string[];
    feedback?: string;
    passed?: boolean;
  };
  step3?: {
    evaluatedEvidences: {
      evidenceId: string;
      userCredibility: number;
      selectedSupports: ("cause" | "solution" | "need")[];
      justification: string;
    }[];
    feedback?: string;
    passed?: boolean;
  };
  step4?: {
    consultedStakeholderIds: string[];
    interviewNotes: string;
    askedFollowUps: Record<string, number[]>; // stakeholderId -> array of followUp indices asked
    feedback?: string;
    passed?: boolean;
  };
  step5?: {
    plan: InterventionPlanData;
    feedback?: string;
    passed?: boolean;
  };
  step6?: {
    selectedOptionId: string;
    justification: string;
    feedback?: string;
    passed?: boolean;
  };
  step7?: {
    impact: ImpactAssessmentData;
    feedback?: string;
    passed?: boolean;
  };
  scores?: StepScoreBreakdown;
  reflection?: {
    answer: string;
    feedback?: string;
  };
}

// --- Session & Forms ---
export interface SessionPayload {
  userId: string;
  role: UserRole;
  expiresAt: Date;
}

export type FormState =
  | { status: "idle" }
  | { status: "error"; errors?: Record<string, string[]>; message?: string }
  | { status: "success"; message: string };

// --- API Responses ---
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
