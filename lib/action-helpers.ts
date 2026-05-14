import { startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";

export async function requireSessionUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export function todayDate() {
  return startOfDay(new Date());
}

export function refreshPaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}
