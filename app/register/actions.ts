"use server";

import { SignupFormSchema, FormState, SignupFormInput, Group, Student, StudentId, GroupId } from "@/lib/definitions";
import { findClassroomByCode, findStudentByLrn, createStudent, findGroupByName, createGroup } from "@/lib/db";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export async function registerAction(data: SignupFormInput): Promise<FormState> {
  const validatedFields = SignupFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Please check your inputs.",
    };
  }

  const { classCode, fullName, lrn, password, isGroup, groupName } = validatedFields.data;

  // 1. Verify class code
  const classroom = await findClassroomByCode(classCode);
  if (!classroom) {
    return {
      status: "error",
      errors: {
        classCode: ["Invalid class code. Classroom not found."],
      },
      message: "Invalid class code. Classroom not found.",
    };
  }
  if (classroom.status === "archived") {
    return {
      status: "error",
      errors: {
        classCode: ["This classroom is archived and is no longer accepting new registrations."],
      },
      message: "This classroom is archived and no longer accepting students.",
    };
  }

  // 2. Check LRN uniqueness
  const existingStudent = await findStudentByLrn(lrn);
  if (existingStudent) {
    return {
      status: "error",
      errors: {
        lrn: ["A student with this LRN is already registered. Please log in instead."],
      },
      message: "A student with this LRN is already registered.",
    };
  }

  // 3. Handle Group Creation/Joining if applicable
  let groupId: string | undefined = undefined;
  if (isGroup && groupName) {
    const existingGroup = await findGroupByName(groupName, classroom.id as string);
    if (existingGroup) {
      groupId = existingGroup.id;
    } else {
      const newGroup = await createGroup({
        id: nanoid() as GroupId,
        name: groupName,
        classroomId: classroom.id,
        createdAt: new Date().toISOString(),
      });
      groupId = newGroup.id;
    }
  }

  // 4. Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 5. Create student
  const student = await createStudent({
    id: nanoid() as StudentId,
    fullName,
    lrn,
    passwordHash,
    classroomId: classroom.id,
    groupId: groupId as GroupId,
    createdAt: new Date().toISOString(),
  });

  // 6. Create session
  await createSession(student.id, "student");

  return { status: "success", message: "Registered successfully" };
}
