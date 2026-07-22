"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/session";

export async function logoutAction(isAdmin = false) {
  await deleteSession();
  if (isAdmin) {
    redirect("/admin");
  } else {
    redirect("/login");
  }
}
