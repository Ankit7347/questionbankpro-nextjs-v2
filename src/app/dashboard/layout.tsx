// File: app/exams/layout.tsx 
import { auth } from "@/lib/auth"; // Import the auth function from your v5 config
import { redirect } from "next/navigation";
import StudentLayout from "@/components/student-dashboard/StudentLayout";

export default async function ExamPortalLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // 1. Fetch the session using the new Auth.js v5 'auth()' helper
  const session = await auth();
  
  // 2. Define allowed roles
  const allowedRoles = ["superadmin", "contentmanager", "student"];

  // 3. Security Check
  if (!session) {
    // Redirect to login if no session exists
    redirect("/login");
  }

  // Check if the user's role is in the allowed list
  // Note: session.user.role is available because you added it to the session callback in lib/auth.ts
  if (!session.user?.role || !allowedRoles.includes(session.user.role)) {
    redirect("/");
  }

  // 4. Return the layout with the user session passed down
  return (
    <StudentLayout user={session.user}>
      {children}
    </StudentLayout>
  );
}