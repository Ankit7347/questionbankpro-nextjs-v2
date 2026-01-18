// File: app/(admin)/layout.tsx
import { auth } from "@/lib/auth"; // Import the auth function from your v5 config
import { redirect } from "next/navigation";
import ClientAdminLayout from "@/components/admin/ClientAdminLayout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const allowedRoles = ["superadmin"];

  if (!session || !allowedRoles.includes(session.user.role)) {
    redirect("/login");
  }

  return <ClientAdminLayout>{children}</ClientAdminLayout>;
}
