// src/app/exams/[examSlug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Layers,
  GraduationCap,
  ChevronRight,
  FileText,
  Clock,
  Trophy,
} from "lucide-react";

export default function ExamOverviewPage() {
  const params = useParams();
  const examSlug = params.examSlug as string;

  if (!examSlug) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-[2.5rem] text-center text-red-500 bg-red-50 rounded-[1.5rem]">
          Invalid exam code. Please return to the library.
        </div>
      </div>
    );
  }

  const syllabi = [
    { slug: "cbse-2025", name: "CBSE Curriculum 2024-25", boards: "Central Board" },
    { slug: "icse-2025", name: "ICSE Curriculum 2024-25", boards: "Council Schools" },
    { slug: "state-board", name: "State Board Syllabus", boards: "Regional" },
  ];

  const subjects = [
    { slug: "mathematics", name: "Mathematics", topics: 14, color: "bg-blue-600" },
    { slug: "physics", name: "Physics", topics: 12, color: "bg-orange-500" },
    { slug: "chemistry", name: "Chemistry", topics: 10, color: "bg-purple-600" },
    { slug: "biology", name: "Biology", topics: 8, color: "bg-emerald-600" },
    { slug: "english", name: "English", topics: 15, color: "bg-pink-600" },
    { slug: "computer-science", name: "Computer Science", topics: 9, color: "bg-indigo-600" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors selection:bg-blue-100">
      
      {/* 1. HERO HEADER - Fluid Spacing */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/30 backdrop-blur-md">
        <div className="max-w-[80rem] mx-auto px-[5%] py-[4rem] lg:py-[6rem]">
          <div className="flex items-center gap-[0.75rem] text-blue-600 dark:text-blue-400 font-bold text-[0.75rem] uppercase tracking-[0.15em] mb-[1.5rem]">
            <span className="w-[2rem] h-[2px] bg-blue-600"></span> 
            Exam Portal
          </div>
          <h1 className="text-[2.5rem] lg:text-[3.5rem] font-[900] text-gray-900 dark:text-white tracking-tight leading-[1.1]">
            {examSlug.replace("-", " ").toUpperCase()}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-[1.5rem] max-w-[40rem] text-[1.125rem] leading-relaxed">
            Master your exams with chapter-wise solutions, last-minute revision notes, and highly curated mock tests.
          </p>
        </div>
      </header>

      {/* 2. FLOATING DASHBOARD - REM based grid */}
      <section className="max-w-[80rem] mx-auto px-[5%] -mt-[3.5rem] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
          {[
            { Icon: FileText, label: "Question Bank", desc: "2,500+ Solved Questions", color: "text-blue-600", bg: "bg-blue-50" },
            { Icon: Clock, label: "Previous Years", desc: "10 Years Solved Papers", color: "text-purple-600", bg: "bg-purple-50" },
            { Icon: Trophy, label: "Mock Series", desc: "2025 Pattern Updated", color: "text-emerald-600", bg: "bg-emerald-50" }
          ].map((item, i) => (
            <div key={i} className="group bg-white dark:bg-gray-800 rounded-[1.25rem] border border-gray-100 dark:border-gray-700 p-[1.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className={`w-[3.5rem] h-[3.5rem] rounded-[1rem] ${item.bg} dark:bg-gray-700/50 flex items-center justify-center ${item.color} mb-[1.25rem] group-hover:scale-110 transition-transform`}>
                <item.Icon size={28} />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-[1.25rem]">{item.label}</h3>
              <p className="text-[0.875rem] text-gray-500 dark:text-gray-400 mt-[0.5rem] leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SYLLABUS SECTION */}
      <section className="max-w-[80rem] mx-auto px-[5%] py-[5rem]">
        <div className="flex items-center gap-[1.5rem] mb-[3rem]">
            <h2 className="text-[1.75rem] font-[900] text-gray-900 dark:text-white shrink-0">
              Pick Your Syllabus
            </h2>
            <div className="h-[1px] w-full bg-gray-100 dark:bg-gray-800"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.25rem]">
          {syllabi.map((s) => (
            <Link
              key={s.slug}
              href={`/exams/${examSlug}/syllabus/${s.slug}`}
              className="group flex items-center justify-between rounded-[1.5rem] border border-gray-100 dark:border-gray-700 p-[1.75rem] bg-white dark:bg-gray-900 hover:border-blue-500 hover:shadow-[0_20px_40px_-20px_rgba(59,130,246,0.15)] transition-all"
            >
              <div className="space-y-[0.25rem]">
                <span className="block font-[800] text-[1.125rem] text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {s.name}
                </span>
                <span className="text-[0.75rem] text-gray-400 font-bold uppercase tracking-widest">
                    {s.boards}
                </span>
              </div>
              <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                <ChevronRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SUBJECT GRID - Fluid aspect ratios */}
      <section className="max-w-[80rem] mx-auto px-[5%] pb-[6rem]">
        <div className="flex items-center gap-[1.5rem] mb-[3rem]">
            <h2 className="text-[1.75rem] font-[900] text-gray-900 dark:text-white shrink-0">
              Subject Explorer
            </h2>
            <div className="h-[1px] w-full bg-gray-100 dark:bg-gray-800"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[1rem]">
          {subjects.map((s) => (
            <Link
              key={s.slug}
              href={`/exams/${examSlug}/syllabus/cbse-2025/subject/${s.slug}`}
              className="group relative flex flex-col items-center justify-center aspect-[4/5] lg:aspect-square rounded-[2rem] border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-[1rem] text-center hover:border-blue-500 hover:shadow-2xl transition-all"
            >
              {/* Subtle hover background ring */}
              <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-blue-500/10 transition-all pointer-events-none scale-105 opacity-0 group-hover:opacity-100"></div>
              
              <div className={`w-[3.5rem] h-[3.5rem] rounded-[1.25rem] ${s.color} flex items-center justify-center text-white mb-[1.25rem] shadow-lg shadow-current/30 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                <Layers size={24} />
              </div>
              <span className="font-extrabold text-gray-900 dark:text-white text-[0.9375rem] group-hover:text-blue-600 transition-colors px-1">
                {s.name}
              </span>
              <div className="mt-[0.5rem] flex items-center gap-[0.25rem] text-[0.6875rem] text-gray-400 font-black uppercase tracking-tighter">
                <BookOpen size={10} />
                {s.topics} Topics
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}