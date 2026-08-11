"use server";

import { LoginFormSchema, FormState, LoginFormInput } from "@/lib/definitions";
import { findStudentByLrn } from "@/lib/db";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function loginAction(data: LoginFormInput): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid credentials.",
    };
  }

  const { lrn, password } = validatedFields.data;

  // 1. Find student
  const student = await findStudentByLrn(lrn);
  if (!student) {
    return {
      status: "error",
      errors: {
        lrn: ["No student account found with this LRN."],
      },
      message: "Invalid LRN or account not found.",
    };
  }

  // 2. Verify password
  const passwordMatch = await bcrypt.compare(password, student.passwordHash);
  if (!passwordMatch) {
    return {
      status: "error",
      errors: {
        password: ["Incorrect password. Please try again."],
      },
      message: "Invalid password.",
    };
  }

  // 3. Create session
  await createSession(student.id, "student");

  return { status: "success", message: "Logged in successfully" };
}
