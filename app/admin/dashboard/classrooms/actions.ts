"use server";

import { requireRole, getCurrentAdmin } from "@/lib/dal";
import { createClassroom, findClassroomById, updateClassroom, deleteClassroom } from "@/lib/db";
import { Classroom, ClassroomId, AdminId } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function createClassroomAction(name: string, description: string) {
  await requireRole("admin");
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Not logged in" };

  if (!name.trim()) {
    return { error: "Classroom name is required" };
  }

  // Generate 6 character alphanumeric code
  const code = nanoid(6).toUpperCase();

  const classroom = await createClassroom({
    id: nanoid() as ClassroomId,
    name,
    code,
    description: description || undefined,
    status: "active",
    createdBy: admin.id as AdminId,
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/admin/dashboard/classrooms");
  return { success: true, classroom };
}

export async function updateClassroomAction(
  classroomId: string,
  name: string,
  description: string,
  status: "active" | "archived"
) {
  await requireRole("admin");

  if (!name.trim()) {
    return { error: "Classroom name is required" };
  }

  const existing = await findClassroomById(classroomId);
  if (!existing) {
    return { error: "Classroom not found" };
  }

  const updatedClassroom: Classroom = {
    ...existing,
    name,
    description: description || undefined,
    status,
  };

  await updateClassroom(updatedClassroom);

  revalidatePath("/admin/dashboard/classrooms");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteClassroomAction(classroomId: string): Promise<{ success: boolean; error?: string }> {
  await requireRole("admin");

  await deleteClassroom(classroomId);

  revalidatePath("/admin/dashboard/classrooms");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function archiveClassroomAction(classroomId: string) {
  await requireRole("admin");

  const existing = await findClassroomById(classroomId);
  if (!existing) {
    return { error: "Classroom not found" };
  }

  await updateClassroom({
    ...existing,
    status: "archived",
  });

  revalidatePath("/admin/dashboard/classrooms");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleClassroomStatusAction(classroomId: string, newStatus: "active" | "archived") {
  await requireRole("admin");

  const existing = await findClassroomById(classroomId);
  if (!existing) {
    return { error: "Classroom not found" };
  }

  await updateClassroom({
    ...existing,
    status: newStatus,
  });

  revalidatePath("/admin/dashboard/classrooms");
  revalidatePath("/dashboard");
  return { success: true, status: newStatus };
}

export async function regenerateClassroomCodeAction(classroomId: string) {
  await requireRole("admin");

  const existing = await findClassroomById(classroomId);
  if (!existing) {
    return { error: "Classroom not found" };
  }

  const newCode = nanoid(6).toUpperCase();

  await updateClassroom({
    ...existing,
    code: newCode,
  });

  revalidatePath("/admin/dashboard/classrooms");
  revalidatePath("/dashboard");
  return { success: true, code: newCode };
}

export async function assignScenarioToClassroomAction(
  scenarioId: string,
  classroomId: string
): Promise<{ success: boolean; error?: string }> {
  await requireRole("admin");

  const { createClassroomScenario } = await import("@/lib/db");
  const { nanoid } = await import("nanoid");

  await createClassroomScenario({
    id: nanoid() as any,
    classroomId: classroomId as any,
    scenarioId: scenarioId as any,
    isActive: true,
    assignedAt: new Date().toISOString(),
  });

  revalidatePath("/admin/dashboard/classrooms");
  revalidatePath("/admin/dashboard/scenarios");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function unassignScenarioFromClassroomAction(
  scenarioId: string,
  classroomId: string
): Promise<{ success: boolean; error?: string }> {
  await requireRole("admin");

  const { removeScenarioFromClassroom } = await import("@/lib/db");

  await removeScenarioFromClassroom(scenarioId, classroomId);

  revalidatePath("/admin/dashboard/classrooms");
  revalidatePath("/admin/dashboard/scenarios");
  revalidatePath("/dashboard");
  return { success: true };
}
