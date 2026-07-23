"use server";

import { AdminLoginFormSchema, FormState, AdminLoginFormInput } from "@/lib/definitions";
import { findAdminByEmail } from "@/lib/db";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function adminLoginAction(data: AdminLoginFormInput): Promise<FormState> {
  const validatedFields = AdminLoginFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid credentials.",
    };
  }

  const { email, password } = validatedFields.data;

  // 1. Find admin
  const admin = await findAdminByEmail(email);
  if (!admin) {
    return {
      status: "error",
      message: "Invalid email or password.",
    };
  }

  // 2. Verify password
  const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatch) {
    return {
      status: "error",
      message: "Invalid email or password.",
    };
  }

  // 3. Create session
  await createSession(admin.id, "admin");

  return { status: "success", message: "Logged in successfully" };
}
