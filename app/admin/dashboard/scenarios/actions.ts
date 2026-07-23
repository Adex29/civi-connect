"use server";

import { requireRole } from "@/lib/dal";
import { createScenario, readData, DataFileType, createClassroomScenario } from "@/lib/db";
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



export async function unassignScenarioAction(scenarioId: string, classroomId: string): Promise<{ success: boolean; error?: string }> {
  await requireRole("admin");

  const { removeScenarioFromClassroom } = await import("@/lib/db");
  removeScenarioFromClassroom(scenarioId, classroomId);

  revalidatePath("/admin/dashboard/scenarios");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateScenarioAssignmentsAction(
  scenarioId: string,
  targetClassroomIds: string[]
): Promise<{ success: boolean; error?: string; addedCount?: number; removedCount?: number }> {
  await requireRole("admin");

  const { removeScenarioFromClassroom } = await import("@/lib/db");
  const assignments = readData<ClassroomScenario>(DataFileType.ClassroomScenarios);

  // Current active assigned classroom IDs for this scenario
  const currentAssignedIds: string[] = assignments
    .filter((a) => a.scenarioId === scenarioId && a.isActive)
    .map((a) => a.classroomId as string);

  const toAdd = targetClassroomIds.filter((id) => !currentAssignedIds.includes(id));
  const toRemove = currentAssignedIds.filter((id) => !targetClassroomIds.includes(id));

  // Add new assignments
  for (const classroomId of toAdd) {
    createClassroomScenario({
      id: nanoid() as ClassroomScenarioId,
      classroomId: classroomId as ClassroomId,
      scenarioId: scenarioId as ScenarioId,
      isActive: true,
      assignedAt: new Date().toISOString(),
    });
  }

  // Remove deselected assignments
  for (const classroomId of toRemove) {
    removeScenarioFromClassroom(scenarioId, classroomId);
  }

  revalidatePath("/admin/dashboard/scenarios");
  revalidatePath("/dashboard");
  return {
    success: true,
    addedCount: toAdd.length,
    removedCount: toRemove.length,
  };
}
