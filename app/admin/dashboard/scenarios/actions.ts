"use server";

import { requireRole } from "@/lib/dal";
import { createScenario, readData, DataFileType, writeData, createClassroomScenario } from "@/lib/db";
import { Scenario, ScenarioId, ClassroomScenarioId, ClassroomId, ClassroomScenario } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function createScenarioAction(title: string, description: string, constraintsText: string) {
  await requireRole("admin");

  if (!title.trim() || !description.trim() || !constraintsText.trim()) {
    return { error: "All fields are required" };
  }

  const constraints = constraintsText.split('\n').filter(c => c.trim().length > 0).map(c => c.trim());
  if (constraints.length === 0) {
    return { error: "At least one constraint must be provided" };
  }

  const scenario = createScenario({
    id: nanoid() as ScenarioId,
    title,
    description,
    constraints,
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/admin/dashboard/scenarios");
  revalidatePath("/dashboard");
  return { success: true, scenario };
}

export async function updateScenarioAction(
  scenarioId: string,
  title: string,
  description: string,
  constraintsText: string
) {
  await requireRole("admin");

  if (!title.trim() || !description.trim() || !constraintsText.trim()) {
    return { error: "All fields are required" };
  }

  const constraints = constraintsText
    .split("\n")
    .filter((c) => c.trim().length > 0)
    .map((c) => c.trim());

  if (constraints.length === 0) {
    return { error: "At least one constraint must be provided" };
  }

  const scenarios = readData<Scenario>(DataFileType.Scenarios);
  const existing = scenarios.find((s) => s.id === scenarioId);
  if (!existing) {
    return { error: "Scenario not found" };
  }

  const updatedScenario: Scenario = {
    ...existing,
    title,
    description,
    constraints,
  };

  const { updateScenario } = await import("@/lib/db");
  updateScenario(updatedScenario);

  revalidatePath("/admin/dashboard/scenarios");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/activity/${scenarioId}`);
  return { success: true };
}

export async function deleteScenarioAction(scenarioId: string): Promise<{ success: boolean; error?: string }> {
  await requireRole("admin");

  const { deleteScenario } = await import("@/lib/db");
  deleteScenario(scenarioId);

  revalidatePath("/admin/dashboard/scenarios");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function assignScenarioAction(scenarioId: string, classroomId: string) {
  await requireRole("admin");

  const assignments = readData<ClassroomScenario>(DataFileType.ClassroomScenarios);
  
  // Check if already assigned
  const existing = assignments.find(a => a.scenarioId === scenarioId && a.classroomId === classroomId);
  if (existing) {
    return { error: "Scenario is already assigned to this classroom" };
  }

  createClassroomScenario({
    id: nanoid() as ClassroomScenarioId,
    classroomId: classroomId as ClassroomId,
    scenarioId: scenarioId as ScenarioId,
    isActive: true,
    assignedAt: new Date().toISOString(),
  });

  revalidatePath("/admin/dashboard/scenarios");
  return { success: true };
}
