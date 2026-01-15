// src/app/exams/[examSlug]/layout.tsx

import { ReactNode } from "react";
import { notFound } from "next/navigation";
import ExamSidebar from "@/components/exams/sidebar/ExamSidebar";
import { loadExamSidebar } from "@/services/server/examSidebar.loader";

export default async function ExamLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ examSlug: string }>;
}) {
  const { examSlug } = await params;

  const sidebarData = await loadExamSidebar(examSlug);

  // Hard route guard: invalid exam → 404
  if (!sidebarData.exam) {
    notFound();
  }

  return (
    <div className="flex min-h-screen">
      <ExamSidebar data={sidebarData} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
