import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Sidebar from "@/components/dashboard/Sidebar";
import LogoutButton from "@/components/dashboard/LogoutButton";

export const metadata = {
  title: "Dashboard | CASO Comply",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Use admin client to bypass RLS for tenant lookups
  const admin = createAdminClient();

  const { data: membership } = await admin
    .from("tenant_members")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .single();

  let tenantName = "My Organization";

  if (membership) {
    const { data: tenant } = await admin
      .from("tenants")
      .select("name")
      .eq("id", membership.tenant_id)
      .single();

    if (tenant) {
      tenantName = tenant.name;
    }
  }

  // Check if user is a super admin
  const { data: sa } = await admin
    .from("super_admins")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const isSuperAdmin = !!sa;

  return (
    <div className="min-h-screen bg-caso-navy flex">
      <Sidebar isSuperAdmin={isSuperAdmin} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-caso-border bg-caso-navy-light flex items-center justify-between px-6 shrink-0">
          {/* Spacer for mobile hamburger */}
          <div className="lg:hidden w-10" />

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm font-medium text-caso-white">
              {tenantName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-caso-slate hidden sm:inline">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
