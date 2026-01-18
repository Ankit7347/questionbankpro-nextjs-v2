// src/app/exams/[examSlug]/[courseSlug]/layout.tsx
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import ExamSidebar from "@/components/exams/sidebar/ExamSidebar";
import ExamPageHeader from "@/components/exams/ExamPageHeader";
import { loadExamSidebar } from "@/services/server/examSidebar.loader";

export default async function CourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ examSlug: string; courseSlug: string }>;
}) {
  const { examSlug, courseSlug } = await params;
  
  // Pass BOTH slugs to your loader
  const data = await loadExamSidebar(examSlug, courseSlug);

  if (!data.exam || !data.course) notFound();

  const totalChapters = data.subjects?.reduce(
    (acc, sub) => acc + (sub.chapters?.length || 0), 0
  ) || 0;

  return (
    <div className="flex w-full items-stretch min-h-[calc(100vh-64px)]">
      {/* 1. SIDEBAR */}
      <aside className="hidden lg:block w-[18%] shrink-0 sticky top-16 h-[calc(100vh-64px)] border-r border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 overflow-y-auto z-20">
        <ExamSidebar data={data} />
      </aside>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 bg-white dark:bg-slate-950 transition-colors duration-300">
        <main className="py-6 px-4 md:py-8 md:px-8 space-y-6 md:space-y-8">
          
          <ExamPageHeader 
            examName={data.exam.name}
            title={data.course.name}
            description={`Comprehensive curriculum for ${data.exam.name} 2026.`}
            subjectCount={data.subjects?.length || 0}
            chapterCount={totalChapters}
          />

          <div className="w-full pb-20 lg:pb-0"> 
            {children}
          </div>
        </main>
      </div>

      {/* 3. MOBILE NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-6 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
         <div className="flex justify-around items-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Course Navigation Available via Menu
            </p>
         </div>
      </div>
    </div>
  );
}