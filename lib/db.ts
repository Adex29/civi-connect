import fs from "fs";
import path from "path";
import "server-only";
import { cache } from "react";
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

// --- Entity Mappers ---
function mapClassroom(row: any): Classroom {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description || undefined,
    createdBy: row.created_by || undefined,
    status: row.status as "active" | "archived",
    createdAt: row.created_at,
  };
}

function mapStudent(row: any): Student {
  return {
    id: row.id,
    fullName: row.full_name,
    lrn: row.lrn,
    passwordHash: row.password_hash,
    classroomId: row.classroom_id,
    groupId: row.group_id || undefined,
    createdAt: row.created_at,
  };
}

function mapAdmin(row: any): Admin {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    createdAt: row.created_at,
  };
}

function mapGroup(row: any): Group {
  return {
    id: row.id,
    name: row.name,
    classroomId: row.classroom_id,
    createdAt: row.created_at,
  };
}

function mapScenario(row: any): Scenario {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    context: row.context || undefined,
    constraints: Array.isArray(row.constraints) ? row.constraints : [],
    status: row.status as any,
    createdBy: row.created_by || undefined,
    createdAt: row.created_at,
    missionData: row.mission_data || undefined,
  };
}

function mapClassroomScenario(row: any): ClassroomScenario {
  return {
    id: row.id,
    classroomId: row.classroom_id,
    scenarioId: row.scenario_id,
    isActive: Boolean(row.is_active),
    assignedAt: row.assigned_at,
  };
}

function mapConstraint(row: any): Constraint {
  return {
    id: row.id,
    scenarioId: row.scenario_id,
    stepNumber: row.step_number,
    description: row.description,
    criteria: row.criteria,
  };
}

function mapAssignment(row: any): Assignment {
  return {
    id: row.id,
    scenarioId: row.scenario_id,
    classroomId: row.classroom_id,
    studentId: row.student_id || undefined,
    groupId: row.group_id || undefined,
    assignedAt: row.assigned_at,
  };
}

function mapSubmission(row: any): Submission {
  const simulationState = row.simulation_state
    ? typeof row.simulation_state === "string"
      ? JSON.parse(row.simulation_state)
      : JSON.parse(JSON.stringify(row.simulation_state))
    : row.simulationState
    ? typeof row.simulationState === "string"
      ? JSON.parse(row.simulationState)
      : row.simulationState
    : undefined;

  return {
    id: row.id,
    scenarioId: row.scenario_id || row.scenarioId,
    studentId: row.student_id || row.studentId,
    groupId: row.group_id || row.groupId || undefined,
    status: row.status,
    content: row.content || "",
    feedback: row.feedback || "",
    score: row.score !== undefined ? row.score : null,
    stepProgress: row.step_progress || simulationState?.currentStep || row.stepProgress || 1,
    simulationState,
    submittedAt: row.submitted_at || row.submittedAt,
  };
}

// --- Classrooms ---
export async function getAllClassrooms(): Promise<Classroom[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("classrooms").select("*");
      if (!error && data) {
        return data.map(mapClassroom);
      }
    } catch (err) {
      // Quietly fall back to local JSON data on network / fetch failure
    }
  }
  return readData<Classroom>("classrooms");
}

export const findClassroomByCode = cache(async (code: string): Promise<Classroom | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("classrooms")
        .select("*")
        .eq("code", code)
        .maybeSingle();
      if (!error && data) {
        return mapClassroom(data);
      }
    } catch (err) {}
  }
  const classrooms = readData<Classroom>("classrooms");
  return classrooms.find((c) => c.code === code) || null;
});

export const findClassroomById = cache(async (id: string): Promise<Classroom | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("classrooms")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        return mapClassroom(data);
      }
    } catch (err) {}
  }
  const classrooms = readData<Classroom>("classrooms");
  return classrooms.find((c) => c.id === id) || null;
});

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
        return data.map(mapStudent);
      }
    } catch (err) {
      // Fallback to local
    }
  }
  return readData<Student>("students");
}

export const findStudentByLrn = cache(async (lrn: string): Promise<Student | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("lrn", lrn)
        .maybeSingle();
      if (!error && data) {
        return mapStudent(data);
      }
    } catch (err) {}
  }
  const students = readData<Student>("students");
  return students.find((s) => s.lrn === lrn) || null;
});

export const findStudentById = cache(async (id: string): Promise<Student | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        return mapStudent(data);
      }
    } catch (err) {}
  }
  const students = readData<Student>("students");
  return students.find((s) => s.id === id) || null;
});

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

export const getStudentsByClassroom = cache(async (classroomId: string): Promise<Student[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("classroom_id", classroomId);
      if (!error && data) {
        return data.map(mapStudent);
      }
    } catch (err) {}
  }
  const students = readData<Student>("students");
  return students.filter((s) => s.classroomId === classroomId);
});

// --- Admins ---
export async function getAllAdmins(): Promise<Admin[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("admins").select("*");
      if (!error && data) {
        return data.map(mapAdmin);
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Admin>("admins");
}

export const findAdminByEmail = cache(async (email: string): Promise<Admin | null> => {
  const normalized = email.toLowerCase().trim();
  const candidateEmails = Array.from(
    new Set([
      normalized,
      normalized.replace("@civiconnect.local", "@civi-tech.local"),
      normalized.replace("@civi-tech.local", "@civiconnect.local"),
    ])
  );

  if (isSupabaseConfigured) {
    try {
      for (const candidate of candidateEmails) {
        const { data, error } = await supabase
          .from("admins")
          .select("*")
          .ilike("email", candidate)
          .maybeSingle();
        if (!error && data) {
          return mapAdmin(data);
        }
      }
    } catch (err) {}
  }
  const admins = readData<Admin>("admins");
  return (
    admins.find((a) =>
      candidateEmails.some((cand) => a.email.toLowerCase() === cand)
    ) || null
  );
});

export const findAdminById = cache(async (id: string): Promise<Admin | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        return mapAdmin(data);
      }
    } catch (err) {}
  }
  const admins = readData<Admin>("admins");
  return admins.find((a) => a.id === id) || null;
});

// --- Groups ---
export async function getAllGroups(): Promise<Group[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("groups").select("*");
      if (!error && data) {
        return data.map(mapGroup);
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Group>("groups");
}

export const getGroupsByClassroom = cache(async (classroomId: string): Promise<Group[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("classroom_id", classroomId);
      if (!error && data) {
        return data.map(mapGroup);
      }
    } catch (err) {}
  }
  const groups = readData<Group>("groups");
  return groups.filter((g) => g.classroomId === classroomId);
});

export const findGroupByName = cache(async (name: string, classroomId: string): Promise<Group | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("name", name)
        .eq("classroom_id", classroomId)
        .maybeSingle();
      if (!error && data) {
        return mapGroup(data);
      }
    } catch (err) {}
  }
  const groups = readData<Group>("groups");
  return groups.find((g) => g.name === name && g.classroomId === classroomId) || null;
});

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
        return data.map(mapScenario);
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Scenario>("scenarios");
}

export const findScenarioById = cache(async (id: string): Promise<Scenario | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        return mapScenario(data);
      }
    } catch (err) {}
  }
  const scenarios = readData<Scenario>("scenarios");
  return scenarios.find((s) => s.id === id) || null;
});

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
        return data.map(mapClassroomScenario);
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<ClassroomScenario>("classroomScenarios");
}

export const getClassroomScenariosByClassroom = cache(async (classroomId: string): Promise<ClassroomScenario[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("classroom_scenarios")
        .select("*")
        .eq("classroom_id", classroomId);
      if (!error && data) {
        return data.map(mapClassroomScenario);
      }
    } catch (err) {}
  }
  const all = readData<ClassroomScenario>("classroomScenarios");
  return all.filter((cs) => cs.classroomId === classroomId);
});

export const findClassroomScenario = cache(async (
  classroomId: string,
  scenarioId: string
): Promise<ClassroomScenario | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("classroom_scenarios")
        .select("*")
        .eq("classroom_id", classroomId)
        .eq("scenario_id", scenarioId)
        .maybeSingle();
      if (!error && data) {
        return mapClassroomScenario(data);
      }
    } catch (err) {}
  }
  const all = readData<ClassroomScenario>("classroomScenarios");
  return all.find((cs) => cs.classroomId === classroomId && cs.scenarioId === scenarioId) || null;
});

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
        { onConflict: "classroom_id,scenario_id" }
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

export const getScenariosByClassroom = cache(async (classroomId: string): Promise<Scenario[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data: assignments, error: aErr } = await supabase
        .from("classroom_scenarios")
        .select("scenario_id")
        .eq("classroom_id", classroomId)
        .eq("is_active", true);

      if (!aErr && assignments && assignments.length > 0) {
        const scenarioIds = assignments.map((a) => a.scenario_id);
        const { data: scenarios, error: sErr } = await supabase
          .from("scenarios")
          .select("*")
          .in("id", scenarioIds);

        if (!sErr && scenarios) {
          return scenarios.map(mapScenario);
        }
      } else if (!aErr && assignments && assignments.length === 0) {
        return [];
      }
    } catch (err) {}
  }

  const assignments = readData<ClassroomScenario>("classroomScenarios").filter(
    (a) => a.classroomId === classroomId && a.isActive
  );
  const scenarios = readData<Scenario>("scenarios");
  return assignments
    .map((a) => scenarios.find((s) => s.id === a.scenarioId))
    .filter((s): s is Scenario => Boolean(s));
});

// --- Constraints ---
export async function getAllConstraints(): Promise<Constraint[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("constraints").select("*");
      if (!error && data) {
        return data.map(mapConstraint);
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Constraint>("constraints");
}

export const getConstraintsByScenario = cache(async (scenarioId: string): Promise<Constraint[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("constraints")
        .select("*")
        .eq("scenario_id", scenarioId);
      if (!error && data) {
        return data.map(mapConstraint);
      }
    } catch (err) {}
  }
  const constraints = readData<Constraint>("constraints");
  return constraints.filter((c) => c.scenarioId === scenarioId);
});

export const getConstraintsByStep = cache(async (scenarioId: string, stepNumber: number): Promise<Constraint[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("constraints")
        .select("*")
        .eq("scenario_id", scenarioId)
        .eq("step_number", stepNumber);
      if (!error && data) {
        return data.map(mapConstraint);
      }
    } catch (err) {}
  }
  const constraints = readData<Constraint>("constraints");
  return constraints.filter((c) => c.scenarioId === scenarioId && c.stepNumber === stepNumber);
});

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
        return data.map(mapAssignment);
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Assignment>("assignments");
}

export const findAssignmentById = cache(async (id: string): Promise<Assignment | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        return mapAssignment(data);
      }
    } catch (err) {}
  }
  const assignments = readData<Assignment>("assignments");
  return assignments.find((a) => a.id === id) || null;
});

export const getAssignmentsByClassroom = cache(async (classroomId: string): Promise<Assignment[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("classroom_id", classroomId);
      if (!error && data) {
        return data.map(mapAssignment);
      }
    } catch (err) {}
  }
  const assignments = readData<Assignment>("assignments");
  return assignments.filter((a) => a.classroomId === classroomId);
});

export const getAssignmentForStudent = cache(async (studentId: string): Promise<Assignment | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle();
      if (!error && data) {
        return mapAssignment(data);
      }
    } catch (err) {}
  }
  const assignments = readData<Assignment>("assignments");
  return assignments.find((a) => a.studentId === studentId) || null;
});

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
        return data.map(mapSubmission);
      }
    } catch (err) {
      // Fallback
    }
  }
  return readData<Submission>("submissions");
}

export const findSubmissionById = cache(async (id: string): Promise<Submission | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        return mapSubmission(data);
      }
    } catch (err) {}
  }
  const submissions = readData<Submission>("submissions");
  return submissions.find((s) => s.id === id) || null;
});

export const getSubmissionsForStudent = cache(async (studentId: string, groupId?: string): Promise<Submission[]> => {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from("submissions").select("*");
      if (groupId) {
        query = query.or(`student_id.eq.${studentId},group_id.eq.${groupId}`);
      } else {
        query = query.eq("student_id", studentId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data.map(mapSubmission);
      }
    } catch (err) {}
  }
  const all = readData<Submission>("submissions");
  return all.filter((s) => s.studentId === studentId || (groupId && s.groupId === groupId));
});

export const findSubmissionForStudent = cache(async (
  scenarioId: string,
  studentId: string,
  groupId?: string
): Promise<Submission | null> => {
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from("submissions")
        .select("*")
        .eq("scenario_id", scenarioId);
      if (groupId) {
        query = query.or(`student_id.eq.${studentId},group_id.eq.${groupId}`);
      } else {
        query = query.eq("student_id", studentId);
      }
      const { data, error } = await query.maybeSingle();
      if (!error && data) {
        return mapSubmission(data);
      }
    } catch (err) {}
  }
  const all = readData<Submission>("submissions");
  return (
    all.find(
      (s) =>
        s.scenarioId === scenarioId &&
        (s.studentId === studentId || (groupId && s.groupId === groupId))
    ) || null
  );
});

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
