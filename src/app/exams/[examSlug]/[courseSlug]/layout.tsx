/**
 * src/app/exams/[examSlug]/[courseSlug]/layout.tsx
 */

import { ReactNode } from "react";
import ExamSidebar from "@/components/exams/sidebar/ExamSidebar";
import { loadExamSidebar } from "@/services/server/examSidebar.loader";

export default async function ExamCourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ examSlug: string; courseSlug: string }>;
}) {
  const { examSlug, courseSlug } = await params;

  const sidebarData = await loadExamSidebar(examSlug, courseSlug);

  return (
    <div className="flex min-h-screen">
      <ExamSidebar data={sidebarData} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
