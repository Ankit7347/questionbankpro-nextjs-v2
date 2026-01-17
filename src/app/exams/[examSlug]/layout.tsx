// src/app/exams/[examSlug]/layout.tsx
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import ExamSidebar from "@/components/exams/sidebar/ExamSidebar";
import { loadExamSidebar } from "@/services/server/examSidebar.loader";
import DynamicBreadcrumbs from "@/components/exams/DynamicBreadcrumbs";

export default async function ExamLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ examSlug: string }>;
}) {
  const { examSlug } = await params;
  const data = await loadExamSidebar(examSlug);

  if (!data.exam) notFound();

  return (
    <div className="flex w-full items-stretch min-h-[calc(100vh-64px)]">
      {/* 1. PERSISTENT SIDEBAR (Desktop) */}
      <aside className="hidden lg:block w-[18%] shrink-0 sticky top-16 h-[calc(100vh-64px)] border-r border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 overflow-y-auto z-20">
        <ExamSidebar data={data} />
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 bg-white dark:bg-slate-950 transition-colors duration-300">
        {/* Adjusted padding for mobile (px-4) vs desktop (px-8) */}
        <main className="py-6 px-4 md:py-8 md:px-8 space-y-6 md:space-y-8">
          
          {/* SMART DYNAMIC BREADCRUMBS - Hidden on very small screens to save space */}
          <div className="hidden sm:block">
            <DynamicBreadcrumbs 
              examName={data.exam.name} 
              courseName={data.course?.name || ""} 
            />
          </div>

          {/* COMMON HEADER */}
          <header className="relative overflow-hidden p-5 md:p-8 rounded-2xl md:rounded-[1.5rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm transition-all">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              
              {/* Left Side: Title & Info */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9px] font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20">
                    {data.exam.name}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Active Session
                  </span>
                </div>

                <div>
                  <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight leading-tight mb-1">
                    {data.course?.name || data.exam.name}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-medium max-w-md line-clamp-2 md:line-clamp-1">
                    Comprehensive curriculum for {data.exam.name} 2026.
                  </p>
                </div>
              </div>

              {/* Right Side: Stats Grid - Improved spacing for mobile */}
              <div className="grid grid-cols-3 gap-2 md:flex md:gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 dark:border-gray-800">
                <div className="flex flex-col">
                  <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Subjects</span>
                  <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                    {data.subjects?.length || 0}
                  </span>
                </div>
                
                <div className="flex flex-col border-l border-gray-100 dark:border-gray-800 pl-4">
                  <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Chapters</span>
                  <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                    {data.subjects?.reduce((acc, sub) => acc + (sub.chapters?.length || 0), 0)}
                  </span>
                </div>

                <div className="flex flex-col border-l border-gray-100 dark:border-gray-800 pl-4">
                  <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Status</span>
                  <div className="pt-1">
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded uppercase">
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800">
              <div className="h-full bg-blue-600 w-1/4 rounded-r-full" />
            </div>
          </header>

          {/* DYNAMIC PAGE CONTENT */}
          <div className="w-full pb-20 lg:pb-0"> 
            {children}
          </div>
        </main>
      </div>

      {/* 3. MOBILE NAVIGATION (Floating or Bottom) */}
      {/* This ensures mobile users can still navigate since the sidebar is hidden */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-6 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
         <div className="flex justify-around items-center">
            {/* You can add simplified icons/links here that trigger a mobile menu or link to major sections */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exam Navigation Available via Menu</p>
         </div>
      </div>
    </div>
  );
}