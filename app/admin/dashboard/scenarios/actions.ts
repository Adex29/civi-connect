"use server";

import { requireRole } from "@/lib/dal";
import {
  createScenario,
  findScenarioById,
  updateScenario,
  deleteScenario,
  removeScenarioFromClassroom,
  getAllClassroomScenarios,
  createClassroomScenario,
} from "@/lib/db";
import { Scenario, ScenarioId, ClassroomScenarioId, ClassroomId, MissionDataConfig } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function createScenarioAction(
  title: string,
  description: string,
  constraintsText: string,
  missionData?: MissionDataConfig
) {
  await requireRole("admin");

  if (!title.trim() || !description.trim() || !constraintsText.trim()) {
    return { error: "All fields are required" };
  }

  const constraints = constraintsText.split('\n').filter(c => c.trim().length > 0).map(c => c.trim());
  if (constraints.length === 0) {
    return { error: "At least one constraint must be provided" };
  }

  const scenario = await createScenario({
    id: nanoid() as ScenarioId,
    title,
    description,
    constraints,
    missionData,
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
  constraintsText: string,
  missionData?: MissionDataConfig
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

  const existing = await findScenarioById(scenarioId);
  if (!existing) {
    return { error: "Scenario not found" };
  }

  const updatedScenario: Scenario = {
    ...existing,
    title,
    description,
    constraints,
    missionData: missionData ?? existing.missionData,
  };

  await updateScenario(updatedScenario);

  revalidatePath("/admin/dashboard/scenarios");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/activity/${scenarioId}`);
  return { success: true };
}

export async function deleteScenarioAction(scenarioId: string): Promise<{ success: boolean; error?: string }> {
  await requireRole("admin");

  await deleteScenario(scenarioId);

  revalidatePath("/admin/dashboard/scenarios");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function unassignScenarioAction(scenarioId: string, classroomId: string): Promise<{ success: boolean; error?: string }> {
  await requireRole("admin");

  await removeScenarioFromClassroom(scenarioId, classroomId);

  revalidatePath("/admin/dashboard/scenarios");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateScenarioAssignmentsAction(
  scenarioId: string,
  targetClassroomIds: string[]
): Promise<{ success: boolean; error?: string; addedCount?: number; removedCount?: number }> {
  await requireRole("admin");

  const assignments = await getAllClassroomScenarios();

  // Current active assigned classroom IDs for this scenario
  const currentAssignedIds: string[] = assignments
    .filter((a) => a.scenarioId === scenarioId && a.isActive)
    .map((a) => a.classroomId as string);

  const toAdd = targetClassroomIds.filter((id) => !currentAssignedIds.includes(id));
  const toRemove = currentAssignedIds.filter((id) => !targetClassroomIds.includes(id));

  // Add new assignments
  for (const classroomId of toAdd) {
    await createClassroomScenario({
      id: nanoid() as ClassroomScenarioId,
      classroomId: classroomId as ClassroomId,
      scenarioId: scenarioId as ScenarioId,
      isActive: true,
      assignedAt: new Date().toISOString(),
    });
  }

  // Remove deselected assignments
  for (const classroomId of toRemove) {
    await removeScenarioFromClassroom(scenarioId, classroomId);
  }

  revalidatePath("/admin/dashboard/scenarios");
  revalidatePath("/dashboard");
  return {
    success: true,
    addedCount: toAdd.length,
    removedCount: toRemove.length,
  };
}
