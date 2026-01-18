// src/components/exams/overview/ExamSyllabusPicker.tsx
import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";

export function ExamSyllabusPicker({
  examSlug,
  syllabi,
}: {
  examSlug: string;
  syllabi: {
    slug: string;
    name: string;
    boards: string;
  }[];
}) {
  return (
    <section className="py-10">
      <div className="mb-8">
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
          Available Courses
        </h2>
      </div>

      {/* Compact Grid: Using smaller sizing for a tighter look */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {syllabi.map((s) => (
          <div
            key={s.slug}
            className="group flex flex-col aspect-square rounded-[1.5rem] border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-xl"
          >
            {/* Top Half: General Info / Click to Learn */}
            <Link 
              href={`/exams/${examSlug}/${s.slug}`}
              className="flex-1 p-4 flex flex-col justify-center items-center text-center space-y-1 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <GraduationCap size={20} className="text-blue-600 mb-1" />
              <h3 className="text-xs font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
                {s.name}
              </h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {s.boards}
              </span>
            </Link>

            {/* Bottom Bar: Syllabus Link */}
            <Link
              href={`/exams/${examSlug}/${s.slug}/syllabus`}
              className="h-10 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 flex items-center justify-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              <BookOpen size={12} />
              Syllabus
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}