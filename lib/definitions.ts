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

export interface Scenario {
  id: ScenarioId;
  title: string;
  description: string;
  context?: string;
  constraints: string[];
  status?: ScenarioStatus;
  createdBy?: AdminId;
  createdAt: string;
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
  status: string; // "draft" | "completed"
  content: string;
  feedback: string;
  score: number | null;
  submittedAt: string;
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
