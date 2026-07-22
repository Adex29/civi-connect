import fs from "fs";
import path from "path";
import "server-only";
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
  StudentId,
  ClassroomId,
  AdminId,
  GroupId,
  ScenarioId,
  ClassroomScenarioId,
  ConstraintId,
  AssignmentId,
  SubmissionId,
} from "./definitions";

// --- File Paths ---
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

// --- Generic Helpers ---
export function readData<T>(type: DataFileTypeType): T[] {
  try {
    const data = fs.readFileSync(filePaths[type], "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export function writeData<T>(type: DataFileTypeType, data: T[]): void {
  fs.writeFileSync(filePaths[type], JSON.stringify(data, null, 2));
}

// --- Classrooms ---
export function getAllClassrooms(): Classroom[] {
  return readData<Classroom>("classrooms");
}

export function findClassroomByCode(code: string): Classroom | null {
  const classrooms = getAllClassrooms();
  return classrooms.find((c) => c.code === code) || null;
}

export function findClassroomById(id: string): Classroom | null {
  const classrooms = getAllClassrooms();
  return classrooms.find((c) => c.id === id) || null;
}

export function createClassroom(classroom: Classroom): Classroom {
  const classrooms = getAllClassrooms();
  classrooms.push(classroom);
  writeData("classrooms", classrooms);
  return classroom;
}

export function updateClassroom(classroom: Classroom): Classroom {
  const classrooms = getAllClassrooms();
  const index = classrooms.findIndex((c) => c.id === classroom.id);
  if (index !== -1) {
    classrooms[index] = classroom;
    writeData("classrooms", classrooms);
  }
  return classroom;
}

export function deleteClassroom(id: string): void {
  const classrooms = getAllClassrooms();
  const filtered = classrooms.filter((c) => c.id !== id);
  writeData("classrooms", filtered);

  // Remove related classroom scenario assignments
  const assignments = getAllClassroomScenarios();
  const filteredAssignments = assignments.filter((a) => a.classroomId !== id);
  writeData("classroomScenarios", filteredAssignments);
}

// --- Students ---
export function getAllStudents(): Student[] {
  return readData<Student>("students");
}

export function findStudentByLrn(lrn: string): Student | null {
  const students = getAllStudents();
  return students.find((s) => s.lrn === lrn) || null;
}

export function findStudentById(id: string): Student | null {
  const students = getAllStudents();
  return students.find((s) => s.id === id) || null;
}

export function createStudent(student: Student): Student {
  const students = getAllStudents();
  students.push(student);
  writeData("students", students);
  return student;
}

export function getStudentsByClassroom(classroomId: string): Student[] {
  return getAllStudents().filter((s) => s.classroomId === classroomId);
}

// --- Admins ---
export function getAllAdmins(): Admin[] {
  return readData<Admin>("admins");
}

export function findAdminByEmail(email: string): Admin | null {
  const admins = getAllAdmins();
  return admins.find((a) => a.email === email) || null;
}

export function findAdminById(id: string): Admin | null {
  const admins = getAllAdmins();
  return admins.find((a) => a.id === id) || null;
}

// --- Groups ---
export function getAllGroups(): Group[] {
  return readData<Group>("groups");
}

export function getGroupsByClassroom(classroomId: string): Group[] {
  return getAllGroups().filter((g) => g.classroomId === classroomId);
}

export function findGroupByName(name: string, classroomId: string): Group | null {
  return getAllGroups().find((g) => g.name === name && g.classroomId === classroomId) || null;
}

export function createGroup(group: Group): Group {
  const groups = getAllGroups();
  groups.push(group);
  writeData("groups", groups);
  return group;
}

// --- Scenarios ---
export function getAllScenarios(): Scenario[] {
  return readData<Scenario>("scenarios");
}

export function findScenarioById(id: string): Scenario | null {
  return getAllScenarios().find((s) => s.id === id) || null;
}

export function createScenario(scenario: Scenario): Scenario {
  const scenarios = getAllScenarios();
  scenarios.push(scenario);
  writeData("scenarios", scenarios);
  return scenario;
}

export function updateScenario(scenario: Scenario): Scenario {
  const scenarios = getAllScenarios();
  const index = scenarios.findIndex((s) => s.id === scenario.id);
  if (index !== -1) {
    scenarios[index] = scenario;
    writeData("scenarios", scenarios);
  }
  return scenario;
}

export function deleteScenario(id: string): void {
  const scenarios = getAllScenarios();
  const filtered = scenarios.filter((s) => s.id !== id);
  writeData("scenarios", filtered);

  // Remove related classroom scenario assignments
  const assignments = getAllClassroomScenarios();
  const filteredAssignments = assignments.filter((a) => a.scenarioId !== id);
  writeData("classroomScenarios", filteredAssignments);
}

// --- Classroom-Scenarios ---
export function getAllClassroomScenarios(): ClassroomScenario[] {
  return readData<ClassroomScenario>("classroomScenarios");
}

export function createClassroomScenario(assignment: ClassroomScenario): ClassroomScenario {
  const assignments = getAllClassroomScenarios();
  // Prevent duplicate assignment
  if (!assignments.find((a) => a.scenarioId === assignment.scenarioId && a.classroomId === assignment.classroomId)) {
    assignments.push(assignment);
    writeData("classroomScenarios", assignments);
  }
  return assignment;
}

export function removeScenarioFromClassroom(scenarioId: string, classroomId: string): void {
  const assignments = getAllClassroomScenarios();
  const filtered = assignments.filter((a) => !(a.scenarioId === scenarioId && a.classroomId === classroomId));
  writeData("classroomScenarios", filtered);
}

export function getScenariosByClassroom(classroomId: string): Scenario[] {
  const assignments = getAllClassroomScenarios().filter((a) => a.classroomId === classroomId);
  const scenarios = getAllScenarios();
  return assignments
    .map((a) => scenarios.find((s) => s.id === a.scenarioId))
    .filter((s): s is Scenario => !!s);
}

// --- Constraints ---
export function getAllConstraints(): Constraint[] {
  return readData<Constraint>("constraints");
}

export function getConstraintsByScenario(scenarioId: string): Constraint[] {
  return getAllConstraints().filter((c) => c.scenarioId === scenarioId);
}

export function getConstraintsByStep(scenarioId: string, stepNumber: number): Constraint[] {
  return getAllConstraints().filter((c) => c.scenarioId === scenarioId && c.stepNumber === stepNumber);
}

export function createConstraint(constraint: Constraint): Constraint {
  const constraints = getAllConstraints();
  constraints.push(constraint);
  writeData("constraints", constraints);
  return constraint;
}

export function deleteConstraint(id: string): void {
  const constraints = getAllConstraints();
  writeData("constraints", constraints.filter((c) => c.id !== id));
}

// --- Assignments ---
export function getAllAssignments(): Assignment[] {
  return readData<Assignment>("assignments");
}

export function findAssignmentById(id: string): Assignment | null {
  return getAllAssignments().find((a) => a.id === id) || null;
}

export function getAssignmentsByClassroom(classroomId: string): Assignment[] {
  return getAllAssignments().filter((a) => a.classroomId === classroomId);
}

export function getAssignmentForStudent(studentId: string): Assignment | null {
  return getAllAssignments().find((a) => a.studentId === studentId) || null;
}

export function createAssignment(assignment: Assignment): Assignment {
  const assignments = getAllAssignments();
  assignments.push(assignment);
  writeData("assignments", assignments);
  return assignment;
}

// --- Submissions ---
export function getAllSubmissions(): Submission[] {
  return readData<Submission>("submissions");
}

export function findSubmissionById(id: string): Submission | null {
  return getAllSubmissions().find((s) => s.id === id) || null;
}



export function createSubmission(submission: Submission): Submission {
  const submissions = getAllSubmissions();
  submissions.push(submission);
  writeData("submissions", submissions);
  return submission;
}

export function updateSubmission(submission: Submission): Submission {
  const submissions = getAllSubmissions();
  const index = submissions.findIndex((s) => s.id === submission.id);
  if (index !== -1) {
    submissions[index] = submission;
    writeData("submissions", submissions);
  }
  return submission;
}
