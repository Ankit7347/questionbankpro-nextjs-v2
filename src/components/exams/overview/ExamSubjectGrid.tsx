// src/components/exams/overview/ExamSyllabusGrid.tsx

import Link from "next/link";
import { Layers } from "lucide-react";

export function ExamSubjectGrid({
  examSlug,
  subjects,
}: {
  examSlug: string;
  subjects: {
    slug: string;
    name: string;
    topics: number;
    color: string; // Use 'text-blue-600', 'text-indigo-600', etc.
  }[];
}) {
  return (
    <section className="px-[5%] pb-[6rem]">
      <h2 className="mb-6 text-xl font-black text-gray-900 dark:text-white transition-colors">
        Subject Explorer
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {subjects.map((s) => (
          <Link
            key={s.slug}
            href={`/exams/${examSlug}/syllabus/cbse-2025/subject/${s.slug}`}
            className="group relative flex flex-col items-center justify-center aspect-[4/5] lg:aspect-square rounded-[2rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center transition-all duration-300 hover:border-blue-500 hover:shadow-2xl dark:hover:shadow-blue-900/20"
          >
            {/* ICON BLOCK — No solid blue square background */}
            <div className="relative mb-4 flex h-14 w-14 items-center justify-center transition-transform duration-300 group-hover:scale-110">
              
              {/* THE SHINE: Soft glow adapts via opacity in dark mode */}
              <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 dark:opacity-30 transition-opacity duration-300 group-hover:opacity-40 dark:group-hover:opacity-60 ${s.color.replace('text-', 'bg-')}`} />
              
              {/* THE ICON: Transparent background with colored lines */}
              <Layers
                size={38}
                className={`${s.color.replace('600', '500')} relative z-10`}
                strokeWidth={2.5}
              />
            </div>

            <span className="font-extrabold text-gray-900 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {s.name}
            </span>

            <div className="mt-1 text-[0.7rem] font-black uppercase tracking-tight text-gray-400 dark:text-slate-500">
              {s.topics} Topics
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}