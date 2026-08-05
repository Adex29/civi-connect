import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Manually parse .env.local if process.env values are not set
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      const val = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in your environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const dataDir = path.join(process.cwd(), "data");

function readJsonFile(filename) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function seed() {
  console.log("🌱 Starting Supabase Seeding from local data/*.json files...\n");

  // 1. Admins
  const admins = readJsonFile("admins.json");
  if (admins.length > 0) {
    const formattedAdmins = admins.map(a => ({
      id: a.id,
      email: a.email,
      password_hash: a.passwordHash,
      name: a.name,
      created_at: a.createdAt,
    }));
    const { error } = await supabase.from("admins").upsert(formattedAdmins, { onConflict: "id" });
    if (error) console.error("Error seeding admins:", error.message);
    else console.log(`✓ Seeded ${admins.length} admin(s)`);
  }

  // 2. Classrooms
  const classrooms = readJsonFile("classrooms.json");
  if (classrooms.length > 0) {
    const formattedClassrooms = classrooms.map(c => ({
      id: c.id,
      name: c.name,
      code: c.code,
      description: c.description || null,
      created_by: c.createdBy || null,
      status: c.status || "active",
      created_at: c.createdAt,
    }));
    const { error } = await supabase.from("classrooms").upsert(formattedClassrooms, { onConflict: "id" });
    if (error) console.error("Error seeding classrooms:", error.message);
    else console.log(`✓ Seeded ${classrooms.length} classroom(s)`);
  }

  // 3. Groups
  const groups = readJsonFile("groups.json");
  if (groups.length > 0) {
    const formattedGroups = groups.map(g => ({
      id: g.id,
      name: g.name,
      classroom_id: g.classroomId,
      created_at: g.createdAt,
    }));
    const { error } = await supabase.from("groups").upsert(formattedGroups, { onConflict: "id" });
    if (error) console.error("Error seeding groups:", error.message);
    else console.log(`✓ Seeded ${groups.length} group(s)`);
  }

  // 4. Students
  const students = readJsonFile("students.json");
  if (students.length > 0) {
    const formattedStudents = students.map(s => ({
      id: s.id,
      full_name: s.fullName,
      lrn: s.lrn,
      password_hash: s.passwordHash,
      classroom_id: s.classroomId,
      group_id: s.groupId || null,
      created_at: s.createdAt,
    }));
    const { error } = await supabase.from("students").upsert(formattedStudents, { onConflict: "id" });
    if (error) console.error("Error seeding students:", error.message);
    else console.log(`✓ Seeded ${students.length} student(s)`);
  }

  // 5. Scenarios
  const scenarios = readJsonFile("scenarios.json");
  if (scenarios.length > 0) {
    const formattedScenarios = scenarios.map(sc => ({
      id: sc.id,
      title: sc.title,
      description: sc.description,
      context: sc.context || null,
      constraints: sc.constraints || [],
      mission_data: sc.missionData || null,
      status: sc.status || "active",
      created_by: sc.createdBy || null,
      created_at: sc.createdAt,
    }));
    const { error } = await supabase.from("scenarios").upsert(formattedScenarios, { onConflict: "id" });
    if (error) console.error("Error seeding scenarios:", error.message);
    else console.log(`✓ Seeded ${scenarios.length} scenario(s)`);
  }

  // 6. Classroom Scenarios
  const classroomScenarios = readJsonFile("classroom-scenarios.json");
  if (classroomScenarios.length > 0) {
    const formattedCS = classroomScenarios.map(cs => ({
      id: cs.id,
      classroom_id: cs.classroomId,
      scenario_id: cs.scenarioId,
      is_active: cs.isActive ?? true,
      assigned_at: cs.assignedAt,
    }));
    const { error } = await supabase.from("classroom_scenarios").upsert(formattedCS, { onConflict: "id" });
    if (error) console.error("Error seeding classroom scenarios:", error.message);
    else console.log(`✓ Seeded ${classroomScenarios.length} classroom scenario assignment(s)`);
  }

  // 7. Constraints
  const constraints = readJsonFile("constraints.json");
  if (constraints.length > 0) {
    const formattedConstraints = constraints.map(co => ({
      id: co.id,
      scenario_id: co.scenarioId,
      step_number: co.stepNumber,
      description: co.description,
      criteria: co.criteria,
    }));
    const { error } = await supabase.from("constraints").upsert(formattedConstraints, { onConflict: "id" });
    if (error) console.error("Error seeding constraints:", error.message);
    else console.log(`✓ Seeded ${constraints.length} constraint(s)`);
  }

  // 8. Assignments
  const assignments = readJsonFile("assignments.json");
  if (assignments.length > 0) {
    const formattedAssignments = assignments.map(a => ({
      id: a.id,
      scenario_id: a.scenarioId,
      classroom_id: a.classroomId,
      student_id: a.studentId || null,
      group_id: a.groupId || null,
      assigned_at: a.assignedAt,
    }));
    const { error } = await supabase.from("assignments").upsert(formattedAssignments, { onConflict: "id" });
    if (error) console.error("Error seeding assignments:", error.message);
    else console.log(`✓ Seeded ${assignments.length} assignment(s)`);
  }

  // 9. Submissions
  const submissions = readJsonFile("submissions.json");
  if (submissions.length > 0) {
    const formattedSubmissions = submissions.map(sub => ({
      id: sub.id,
      scenario_id: sub.scenarioId,
      student_id: sub.studentId,
      group_id: sub.groupId || null,
      status: sub.status,
      content: sub.content || "",
      feedback: sub.feedback || "",
      score: sub.score ?? null,
      submitted_at: sub.submittedAt,
    }));
    const { error } = await supabase.from("submissions").upsert(formattedSubmissions, { onConflict: "id" });
    if (error) console.error("Error seeding submissions:", error.message);
    else console.log(`✓ Seeded ${submissions.length} submission(s)`);
  }

  console.log("\n🎉 Supabase database seeding complete!");
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
