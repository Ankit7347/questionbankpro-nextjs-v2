// src/components/exams/overview/ExamSyllabusPicker.tsx

import Link from "next/link";

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
    <section className="py-[5rem]">
      <h2 className="mb-6 text-xl font-black text-gray-900 dark:text-white transition-colors">
        Pick Your Syllabus
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {syllabi.map((s) => (
          <Link
            key={s.slug}
            href={`/exams/${examSlug}/syllabus/${s.slug}`}
            className="group rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-blue-900/10">
            <div className="font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {s.name}
            </div>
            <div className="mt-1 text-xs text-gray-400 dark:text-slate-500 uppercase font-bold tracking-wider">
              {s.boards}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}