// src/app/exams/[examSlug]/page.tsx
import { ExamHero } from "@/components/exams/overview/ExamHero";
import { ExamQuickStats } from "@/components/exams/overview/ExamQuickStats";
import { ExamSyllabusPicker } from "@/components/exams/overview/ExamSyllabusPicker";
import { syllabi } from "@/components/exams/overview/examOverview.mock";

export default async function ExamCategoryPortal({
  params,
}: {
  params: Promise<{ examSlug: string }>;
}) {
  const { examSlug } = await params;

  return (
    <div className="w-[90%] max-w-9xl mx-auto flex flex-col pb-20">
      {/* Hero shows general "GATE EXAM 2026" info */}
      <ExamHero examSlug={examSlug} />
      
      <div className="relative z-10 -mt-8"> 
        <ExamQuickStats /> 
      </div>

      <div className="mt-16 space-y-20">
        {/* BIG Focus: Choosing the specific stream (e.g. GATE CS vs GATE ME) */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              Select Your Stream
            </h2>
            <p className="text-gray-500 dark:text-slate-400">
              Select your specific paper to view the detailed syllabus and subject-wise notes.
            </p>
          </div>
          <ExamSyllabusPicker examSlug={examSlug} syllabi={syllabi} />
        </section>

        {/* General Overview Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 border-t border-gray-100 dark:border-slate-800 pt-16">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">About {examSlug.replace(/-/g, ' ').toUpperCase()}</h3>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              The {examSlug.replace(/-/g, ' ')} is a national-level examination... 
              {/* You can fetch this description from a DB later */}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-gray-100 dark:border-slate-800">
            <h4 className="font-bold mb-4">Important Links</h4>
            <ul className="space-y-3 text-blue-600 dark:text-blue-400 font-medium">
              <li><a href="#" className="hover:underline">Official Notification</a></li>
              <li><a href="#" className="hover:underline">Eligibility Criteria</a></li>
              <li><a href="#" className="hover:underline">Exam Pattern</a></li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}