// src/components/exams/ExamPageHeader.tsx
import DynamicBreadcrumbs from "@/components/exams/DynamicBreadcrumbs";

interface ExamPageHeaderProps {
  examName: string;
  title: string;
  description: string;
  subjectCount: number;
  chapterCount: number;
}

export default function ExamPageHeader({
  examName,
  title,
  description,
  subjectCount,
  chapterCount
}: ExamPageHeaderProps) {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* BREADCRUMBS */}
      <div className="hidden sm:block">
        <DynamicBreadcrumbs examName={examName} courseName={title} />
      </div>

      {/* HEADER CARD */}
      <header className="relative overflow-hidden p-5 md:p-8 rounded-2xl md:rounded-[1.5rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm transition-all">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          {/* Left Side: Title & Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9px] font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20">
                {examName}
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                Active Session
              </span>
            </div>

            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight leading-tight mb-1">
                {title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium max-w-md line-clamp-2 md:line-clamp-1">
                {description}
              </p>
            </div>
          </div>

          {/* Right Side: Stats */}
          <div className="grid grid-cols-3 gap-2 md:flex md:gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 dark:border-gray-800">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Subjects</span>
              <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{subjectCount}</span>
            </div>
            
            <div className="flex flex-col border-l border-gray-100 dark:border-gray-800 pl-4">
              <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Chapters</span>
              <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{chapterCount}</span>
            </div>

            <div className="flex flex-col border-l border-gray-100 dark:border-gray-800 pl-4">
              <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Status</span>
              <div className="pt-1">
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded uppercase">Live</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800">
          <div className="h-full bg-blue-600 w-1/4 rounded-r-full" />
        </div>
      </header>
    </div>
  );
}