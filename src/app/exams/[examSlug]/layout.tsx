// src/app/exams/[examSlug]/layout.tsx
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { verifyExamExists } from "@/services/server/exam.loader";

export default async function ExamLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ examSlug: string }>;
}) {
  const { examSlug } = await params;
  
  // Clean structure: Layout -> Loader -> Service -> DB
  const exists = await verifyExamExists(examSlug);

  if (!exists) {
    notFound();
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white dark:bg-slate-950 transition-colors duration-300">
      {children}
    </div>
  );
}