"use server";

import { requireRole, getCurrentAdmin } from "@/lib/dal";
import { createClassroom, readData, DataFileType, writeData } from "@/lib/db";
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

  const classroom = createClassroom({
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

  const classrooms = readData<Classroom>(DataFileType.Classrooms);
  const existing = classrooms.find((c) => c.id === classroomId);
  if (!existing) {
    return { error: "Classroom not found" };
  }

  const updatedClassroom: Classroom = {
    ...existing,
    name,
    description: description || undefined,
    status,
  };

  const { updateClassroom } = await import("@/lib/db");
  updateClassroom(updatedClassroom);

  revalidatePath("/admin/dashboard/classrooms");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteClassroomAction(classroomId: string): Promise<{ success: boolean; error?: string }> {
  await requireRole("admin");

  const { deleteClassroom } = await import("@/lib/db");
  deleteClassroom(classroomId);

  revalidatePath("/admin/dashboard/classrooms");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function archiveClassroomAction(classroomId: string) {
  await requireRole("admin");

  const classrooms = readData<Classroom>(DataFileType.Classrooms);
  const updated = classrooms.map(c => 
    c.id === classroomId ? { ...c, status: "archived" as const } : c
  );
  
  writeData(DataFileType.Classrooms, updated);
  revalidatePath("/admin/dashboard/classrooms");
  revalidatePath("/dashboard");
  return { success: true };
}
