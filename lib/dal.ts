import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./session";
import { UserRole } from "./definitions";
import { findStudentById, findAdminById } from "./db";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: session.userId,
    role: session.role,
  };
});

export const requireRole = cache(async (role: UserRole) => {
  const session = await verifySession();
  
  if (session.role !== role) {
    if (role === "admin") {
      redirect("/admin");
    } else {
      redirect("/login");
    }
  }

  return session;
});

export const getCurrentStudent = cache(async () => {
  const session = await verifySession();
  if (session.role !== "student") return null;

  const student = await findStudentById(session.userId);
  if (!student) return null;

  // DTO: Exclude password hash
  return {
    id: student.id,
    fullName: student.fullName,
    lrn: student.lrn,
    classroomId: student.classroomId,
    groupId: student.groupId,
  };
});

export const getCurrentAdmin = cache(async () => {
  const session = await verifySession();
  if (session.role !== "admin") return null;

  const admin = await findAdminById(session.userId);
  if (!admin) return null;

  // DTO: Exclude password hash
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
  };
});
