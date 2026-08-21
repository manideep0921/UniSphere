import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Admin } from "@/types/database";

export class UnauthorizedError extends Error {
  constructor(message = "Not authorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Confirms the current request belongs to a logged-in, active admin.
 * Every mutating server action must call this before touching the
 * service-role client — the service role bypasses RLS, so this check
 * is the actual authorization boundary for admin writes.
 */
export async function requireAdmin(): Promise<Admin> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new UnauthorizedError("You must be signed in as an admin.");
  }

  const { data: admin, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .single();

  if (error || !admin) {
    throw new UnauthorizedError("Your admin account is not active.");
  }

  return admin;
}
