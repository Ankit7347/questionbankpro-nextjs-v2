// src/components/exams/overview/ExamHero.tsx

export function ExamHero({ examSlug }: { examSlug: string }) {
  return (
    <header className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-900/40 px-[5%] py-[4rem] transition-colors duration-300">
      <h1 className="text-[2.5rem] font-black text-gray-900 dark:text-white uppercase tracking-tight">
        {examSlug.replace("-", " ")}
      </h1>
      <p className="mt-4 text-gray-500 dark:text-slate-400 max-w-xl text-lg">
        Master your exams with chapter-wise solutions, revision notes, and mocks.
      </p>
    </header>
  );
}