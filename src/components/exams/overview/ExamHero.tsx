// src/components/exams/overview/ExamHero.tsx
import Link from "next/link";
import { BookOpen, CheckCircle, GraduationCap, Trophy, ChevronRight } from "lucide-react";

export function ExamHero({ examSlug }: { examSlug: string }) {
  const displayName = examSlug.replace(/-/g, " ");
  const syllabusPath = `/exams/${examSlug}/syllabus`;

  return (
    <header className="relative overflow-hidden border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] px-[5%] py-12 md:py-16 transition-colors duration-300">
      
      {/* Decorative Glow - Fixes the "Too White" feeling in light mode */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-50 dark:bg-blue-600/5 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative max-w-screen-xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500 dark:text-slate-400">
          <Link href="/exams" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Exams</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-gray-200 capitalize">{displayName}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="flex-1 space-y-6">
            {/* Main Title Section */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
                  Updated for 2026
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-[0.9]">
                {displayName}
              </h1>
            </div>
            
            <p className="max-w-xl text-lg md:text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
              Complete preparation hub for <span className="text-blue-600 dark:text-blue-400 font-bold">{displayName}</span>. 
              Access structured notes, previous year papers, and the latest syllabus.
            </p>

            {/* Feature Pills with Icons */}
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="group flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                Solutions
              </div>
              <div className="group flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                </div>
                Notes
              </div>
              <div className="group flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30 transition-colors">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                </div>
                Mocks
              </div>
            </div>
          </div>

          {/* Buttons: Fixed Visibility in Light Mode */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <Link 
              href={`/exams/${examSlug}/learn`}
              className="w-full sm:w-auto text-center px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all hover:-translate-y-1 active:scale-95"
            >
              Start Learning
            </Link>
            
            <Link 
              href={syllabusPath}
              className="w-full sm:w-auto text-center px-10 py-4 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-2xl font-extrabold hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5 opacity-70" />
              View Syllabus
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}