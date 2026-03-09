import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { User } from "@supabase/supabase-js";

// Authenticate the current user and verify they are a super admin.
// Returns the User object if authorized, or null otherwise.
export async function requireSuperAdmin(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Check super_admins table (authoritative source)
  const admin = createAdminClient();
  const { data: sa } = await admin
    .from("super_admins")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!sa) return null;

  return user;
}
