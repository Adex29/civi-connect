import fs from "fs";
import path from "path";
import "server-only";
import { supabase, isSupabaseConfigured } from "./supabase";
import {
  Student,
  Admin,
  Classroom,
  Group,
  Scenario,
  ClassroomScenario,
  Constraint,
  Assignment,
  Submission,
} from "./definitions";

// --- Local File Paths Fallback ---
const DATA_DIR = path.join(process.cwd(), "data");

const filePaths = {
  classrooms: path.join(DATA_DIR, "classrooms.json"),
  students: path.join(DATA_DIR, "students.json"),
  admins: path.join(DATA_DIR, "admins.json"),
  groups: path.join(DATA_DIR, "groups.json"),
  scenarios: path.join(DATA_DIR, "scenarios.json"),
  classroomScenarios: path.join(DATA_DIR, "classroom-scenarios.json"),
  constraints: path.join(DATA_DIR, "constraints.json"),
  assignments: path.join(DATA_DIR, "assignments.json"),
  submissions: path.join(DATA_DIR, "submissions.json"),
};

export const DataFileType = {
  Classrooms: "classrooms",
  Scenarios: "scenarios",
  Students: "students",
  Groups: "groups",
  ClassroomScenarios: "classroomScenarios",
  Submissions: "submissions",
  Admins: "admins",
  Constraints: "constraints",
  Assignments: "assignments",
} as const;

export type DataFileTypeType = typeof DataFileType[keyof typeof DataFileType];

// Synchronous JSON helpers (for legacy compatibility / fallback)
export function readData<T>(type: DataFileTypeType): T[] {
  try {
    const data = fs.readFileSync(filePaths[type], "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export function writeData<T>(type: DataFileTypeType, data: T[]): void {
  try {
    fs.writeFileSync(filePaths[type], JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Failed to write local data for ${type}:`, err);
  }
}

// --- Classrooms ---
export async function getAllClassrooms(): Promise<Classroom[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("classrooms").select("*");
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          code: row.code,
          description: row.description || undefined,
          createdBy: row.created_by || undefined,
          status: row.status as "active" | "archived",
          createdAt: row.created_at,
        }));
      }
    } catch (err) {
      // Quietly fall back to local JSON data on network / fetch failure
    }
  }
  return readData<Classroom>("classrooms");
}

export async function findClassroomByCode(code: string): Promise<Classroom | null> {
  const classrooms = await getAllClassrooms();
  return classrooms.find((c) => c.code === code) || null;
}

export async function findClassroomById(id: string): Promise<Classroom | null> {
  const classrooms = await getAllClassrooms();
  return classrooms.find((c) => c.id === id) || null;
}

export async function createClassroom(classroom: Classroom): Promise<Classroom> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("classrooms").insert({
        id: classroom.id,
        name: classroom.name,
        code: classroom.code,
        description: classroom.description || null,
        created_by: classroom.createdBy || null,
        status: classroom.status,
        created_at: classroom.createdAt,
      });
    } catch (err) {
      // Ignored
    }
  }

  const local = readData<Classroom>("classrooms");
  local.push(classroom);
  writeData("classrooms", local);

  return classroom;
}

export async function updateClassroom(classroom: Classroom): Promise<Classroom> {
  if (isSupabaseConfigured) {
    try {
      await supabase
        .from("classrooms")
        .update({
          name: classroom.name,
          code: classroom.code,
          description: classroom.description || null,
          created_by: classroom.createdBy || null,
          status: classroom.status,
        })
        .eq("id", classroom.id);
    } catch (err) {
      // Ignored
    }
  }

  const local = readData<Classroom>("classrooms");
  const index = local.findIndex((c) => c.id === classroom.id);
  if (index !== -1) {
    local[index] = classroom;
    writeData("classrooms", local);
  }
  return classroom;
}

export async function deleteClassroom(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("classrooms").delete().eq("id", id);
      await supabase.from("classroom_scenarios").delete().eq("classroom_id", id);
    } catch (err) {
      // Ignored
    }
  }

  const classrooms = readData<Classroom>("classrooms").filter((c) => c.id !== id);
  writeData("classrooms", classrooms);

  const assignments = readData<ClassroomScenario>("classroomScenarios").filter((a) => a.classroomId !== id);
  writeData("classroomScenarios", assignments);
}

// --- Students ---
export async function getAllStudents(): Promise<Student[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("students").select("*");
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          fullName: row.full_name,
          lrn: row.lrn,
          passwordHash: row.password_hash,
          classroomId: row.classroom_id,
          groupId: row.group_id || undefined,
          createdAt: row.created_at,
        }));
      }
    } catch (err) {
      // Fallback to local
    }
  }
  return readData<Student>("students");
}

export async function findStudentByLrn(lrn: string): Promise<Student | null> {
  const students = await getAllStudents();
  return students.find((s) => s.lrn === lrn) || null;
}

export async function findStudentById(id: string): Promise<Student | null> {
  const students = await getAllStudents();
  return students.find((s) => s.id === id) || null;
}

export async function createStudent(student: Student): Promise<Student> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("students").insert({
        id: student.id,
        full_name: student.fullName,
        lrn: student.lrn,
        password_hash: student.passwordHash,
        classroom_id: student.classroomId,
        group_id: student.groupId || null,
        created_at: student.createdAt,
      });
    } catch (err) {
      // Ignored
    }
  }

  const local = readData<Student>("students");
  local.push(student);
  writeData("students", local);

  return student;
}

export async function getStudentsByClassroom(classroomId: string): Promise<Student[]> {
  const students = await getAllStudents();
  return students.filter((s) => s.classroomId === classroomId);
}

// --- Admins ---
export async function getAllAdmins(): Promise<Admin[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("admins").select("*");
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          email: row.email,
          passwordHash: row.password_hash,
          name: row.name,
          createdAt: row.created_at,
        }));
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Admin>("admins");
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
  const admins = await getAllAdmins();
  return admins.find((a) => a.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findAdminById(id: string): Promise<Admin | null> {
  const admins = await getAllAdmins();
  return admins.find((a) => a.id === id) || null;
}

// --- Groups ---
export async function getAllGroups(): Promise<Group[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("groups").select("*");
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          classroomId: row.classroom_id,
          createdAt: row.created_at,
        }));
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Group>("groups");
}

export async function getGroupsByClassroom(classroomId: string): Promise<Group[]> {
  const groups = await getAllGroups();
  return groups.filter((g) => g.classroomId === classroomId);
}

export async function findGroupByName(name: string, classroomId: string): Promise<Group | null> {
  const groups = await getAllGroups();
  return groups.find((g) => g.name === name && g.classroomId === classroomId) || null;
}

export async function createGroup(group: Group): Promise<Group> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("groups").insert({
        id: group.id,
        name: group.name,
        classroom_id: group.classroomId,
        created_at: group.createdAt,
      });
    } catch (err) {
      // Ignored
    }
  }

  const local = readData<Group>("groups");
  local.push(group);
  writeData("groups", local);

  return group;
}

// --- Scenarios ---
export async function getAllScenarios(): Promise<Scenario[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("scenarios").select("*");
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          context: row.context || undefined,
          constraints: Array.isArray(row.constraints) ? row.constraints : [],
          status: row.status as any,
          createdBy: row.created_by || undefined,
          createdAt: row.created_at,
          missionData: row.mission_data || undefined,
        }));
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Scenario>("scenarios");
}

export async function findScenarioById(id: string): Promise<Scenario | null> {
  const scenarios = await getAllScenarios();
  return scenarios.find((s) => s.id === id) || null;
}

export async function createScenario(scenario: Scenario): Promise<Scenario> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("scenarios").insert({
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        context: scenario.context || null,
        constraints: scenario.constraints || [],
        status: scenario.status || "active",
        created_by: scenario.createdBy || null,
        created_at: scenario.createdAt,
        mission_data: scenario.missionData || null,
      });
    } catch (err) {
      // Ignored
    }
  }

  const local = readData<Scenario>("scenarios");
  local.push(scenario);
  writeData("scenarios", local);

  return scenario;
}

export async function updateScenario(scenario: Scenario): Promise<Scenario> {
  if (isSupabaseConfigured) {
    try {
      await supabase
        .from("scenarios")
        .update({
          title: scenario.title,
          description: scenario.description,
          context: scenario.context || null,
          constraints: scenario.constraints || [],
          status: scenario.status || "active",
          mission_data: scenario.missionData || null,
        })
        .eq("id", scenario.id);
    } catch (err) {
      // Ignored
    }
  }

  const local = readData<Scenario>("scenarios");
  const index = local.findIndex((s) => s.id === scenario.id);
  if (index !== -1) {
    local[index] = scenario;
    writeData("scenarios", local);
  }
  return scenario;
}

export async function deleteScenario(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("scenarios").delete().eq("id", id);
      await supabase.from("classroom_scenarios").delete().eq("scenario_id", id);
    } catch (err) {
      // Ignored
    }
  }

  const scenarios = readData<Scenario>("scenarios").filter((s) => s.id !== id);
  writeData("scenarios", scenarios);

  const assignments = readData<ClassroomScenario>("classroomScenarios").filter((a) => a.scenarioId !== id);
  writeData("classroomScenarios", assignments);
}

// --- Classroom-Scenarios ---
export async function getAllClassroomScenarios(): Promise<ClassroomScenario[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("classroom_scenarios").select("*");
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          classroomId: row.classroom_id,
          scenarioId: row.scenario_id,
          isActive: Boolean(row.is_active),
          assignedAt: row.assigned_at,
        }));
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<ClassroomScenario>("classroomScenarios");
}

export async function createClassroomScenario(assignment: ClassroomScenario): Promise<ClassroomScenario> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("classroom_scenarios").upsert(
        {
          id: assignment.id,
          classroom_id: assignment.classroomId,
          scenario_id: assignment.scenarioId,
          is_active: assignment.isActive,
          assigned_at: assignment.assignedAt,
        },
        { onConflict: "id" }
      );
    } catch (err) {
      // Ignored
    }
  }

  const local = readData<ClassroomScenario>("classroomScenarios");
  if (!local.find((a) => a.scenarioId === assignment.scenarioId && a.classroomId === assignment.classroomId)) {
    local.push(assignment);
    writeData("classroomScenarios", local);
  }
  return assignment;
}

export async function removeScenarioFromClassroom(scenarioId: string, classroomId: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase
        .from("classroom_scenarios")
        .delete()
        .eq("scenario_id", scenarioId)
        .eq("classroom_id", classroomId);
    } catch (err) {
      // Ignored
    }
  }

  const local = readData<ClassroomScenario>("classroomScenarios");
  const filtered = local.filter((a) => !(a.scenarioId === scenarioId && a.classroomId === classroomId));
  writeData("classroomScenarios", filtered);
}

export async function getScenariosByClassroom(classroomId: string): Promise<Scenario[]> {
  const assignments = (await getAllClassroomScenarios()).filter((a) => a.classroomId === classroomId);
  const scenarios = await getAllScenarios();
  return assignments
    .map((a) => scenarios.find((s) => s.id === a.scenarioId))
    .filter((s): s is Scenario => !!s);
}

// --- Constraints ---
export async function getAllConstraints(): Promise<Constraint[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("constraints").select("*");
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          scenarioId: row.scenario_id,
          stepNumber: row.step_number,
          description: row.description,
          criteria: row.criteria,
        }));
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Constraint>("constraints");
}

export async function getConstraintsByScenario(scenarioId: string): Promise<Constraint[]> {
  const constraints = await getAllConstraints();
  return constraints.filter((c) => c.scenarioId === scenarioId);
}

export async function getConstraintsByStep(scenarioId: string, stepNumber: number): Promise<Constraint[]> {
  const constraints = await getAllConstraints();
  return constraints.filter((c) => c.scenarioId === scenarioId && c.stepNumber === stepNumber);
}

export async function createConstraint(constraint: Constraint): Promise<Constraint> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("constraints").insert({
        id: constraint.id,
        scenario_id: constraint.scenarioId,
        step_number: constraint.stepNumber,
        description: constraint.description,
        criteria: constraint.criteria,
      });
    } catch (err) {
      // Ignored
    }
  }

  const local = readData<Constraint>("constraints");
  local.push(constraint);
  writeData("constraints", local);

  return constraint;
}

export async function deleteConstraint(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("constraints").delete().eq("id", id);
    } catch (err) {
      // Ignored
    }
  }
  const local = readData<Constraint>("constraints");
  writeData("constraints", local.filter((c) => c.id !== id));
}

// --- Assignments ---
export async function getAllAssignments(): Promise<Assignment[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("assignments").select("*");
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          scenarioId: row.scenario_id,
          classroomId: row.classroom_id,
          studentId: row.student_id || undefined,
          groupId: row.group_id || undefined,
          assignedAt: row.assigned_at,
        }));
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Assignment>("assignments");
}

export async function findAssignmentById(id: string): Promise<Assignment | null> {
  const assignments = await getAllAssignments();
  return assignments.find((a) => a.id === id) || null;
}

export async function getAssignmentsByClassroom(classroomId: string): Promise<Assignment[]> {
  const assignments = await getAllAssignments();
  return assignments.filter((a) => a.classroomId === classroomId);
}

export async function getAssignmentForStudent(studentId: string): Promise<Assignment | null> {
  const assignments = await getAllAssignments();
  return assignments.find((a) => a.studentId === studentId) || null;
}

export async function createAssignment(assignment: Assignment): Promise<Assignment> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("assignments").insert({
        id: assignment.id,
        scenario_id: assignment.scenarioId,
        classroom_id: assignment.classroomId,
        student_id: assignment.studentId || null,
        group_id: assignment.groupId || null,
        assigned_at: assignment.assignedAt,
      });
    } catch (err) {
      // Ignored
    }
  }

  const local = readData<Assignment>("assignments");
  local.push(assignment);
  writeData("assignments", local);

  return assignment;
}

// --- Submissions ---
export async function getAllSubmissions(): Promise<Submission[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("submissions").select("*");
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          scenarioId: row.scenario_id,
          studentId: row.student_id,
          groupId: row.group_id || undefined,
          status: row.status,
          content: row.content || "",
          feedback: row.feedback || "",
          score: row.score,
          simulationState: row.simulation_state ? JSON.parse(JSON.stringify(row.simulation_state)) : undefined,
          submittedAt: row.submitted_at,
        }));
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Submission>("submissions");
}

export async function findSubmissionById(id: string): Promise<Submission | null> {
  const submissions = await getAllSubmissions();
  return submissions.find((s) => s.id === id) || null;
}

export async function createSubmission(submission: Submission): Promise<Submission> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("submissions").upsert(
        {
          id: submission.id,
          scenario_id: submission.scenarioId,
          student_id: submission.studentId,
          group_id: submission.groupId || null,
          status: submission.status,
          content: submission.content || "",
          feedback: submission.feedback || "",
          score: submission.score,
          simulation_state: submission.simulationState || null,
          submitted_at: submission.submittedAt,
        },
        { onConflict: "id" }
      );
    } catch (err) {
      // Ignored
    }
  }

  const local = readData<Submission>("submissions");
  const existingIdx = local.findIndex((s) => s.id === submission.id);
  if (existingIdx !== -1) {
    local[existingIdx] = submission;
  } else {
    local.push(submission);
  }
  writeData("submissions", local);

  return submission;
}

export async function updateSubmission(submission: Submission): Promise<Submission> {
  return createSubmission(submission);
}
