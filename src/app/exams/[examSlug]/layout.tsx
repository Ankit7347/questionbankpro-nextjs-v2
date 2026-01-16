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

  if (!sidebarData.exam) {
    notFound();
  }

  return (
    /* items-stretch ensures the sidebar border reaches the bottom 
       even if the content is short */
    <div className="flex w-full items-stretch min-h-screen">
      
      {/* SIDEBAR: 
          - shrink-0: Prevents the 15% width from collapsing on small screens
          - z-20: Keeps it above content but below Navbar
      */}
      <aside className="hidden lg:block w-[15%] shrink-0 sticky top-16 h-[calc(100vh-64px)] border-r border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 overflow-y-auto custom-scrollbar z-20">
        <div className="h-full">
          <ExamSidebar data={sidebarData} />
        </div>
      </aside>

      {/* CONTENT AREA: 
          - min-h-full: Inherits stretch from parent to fill vertical space
      */}
      <div className="flex-1 bg-white dark:bg-slate-950 min-h-full transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto p-6 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}