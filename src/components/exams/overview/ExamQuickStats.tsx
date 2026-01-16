// src/components/exams/overview/ExamQuickStats.tsx

import {
  FileText,
  Clock,
  Trophy,
} from "lucide-react";

export function ExamQuickStats() {
  const stats = [
    {
      Icon: FileText,
      label: "Question Bank",
      desc: "2,500+ Solved Questions",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      Icon: Clock,
      label: "Previous Years",
      desc: "10 Years Solved Papers",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-500/10",
    },
    {
      Icon: Trophy,
      label: "Mock Series",
      desc: "Latest Pattern",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
  ];

  return (
    /* Removed px-[5%] so it aligns with the parent layout padding. 
       Maintained -mt-[3.5rem] for the overlap effect. */
    <section className="mt-[3.5rem] relative z-10 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
        {stats.map(({ Icon, label, desc, color, bg }) => (
          <div
            key={label}
            className="group bg-white dark:bg-slate-900 rounded-[1.25rem] border border-gray-100 dark:border-slate-800 p-[1.5rem] shadow-sm hover:shadow-xl dark:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className={`w-[3.5rem] h-[3.5rem] rounded-[1rem] ${bg} flex items-center justify-center ${color} mb-[1.25rem] transition-colors`}
            >
              <Icon size={28} />
            </div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-[1.25rem]">
              {label}
            </h3>
            <p className="text-[0.875rem] text-gray-500 dark:text-slate-400 mt-[0.5rem]">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}