import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../api/supabase-server";

const ROLE_HOME = {
  admin: "/admin",
  aspiring: "/aspiring",
  established: "/established",
};

export async function requireRoleServer(allowedRoles) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role || normalizePublicRole(user.user_metadata?.role);

  if (!allowedRoles.includes(role)) {
    redirect(ROLE_HOME[role] || "/login");
  }

  return { user, profile, role };
}

function normalizePublicRole(role) {
  return role === "established" ? "established" : "aspiring";
}
