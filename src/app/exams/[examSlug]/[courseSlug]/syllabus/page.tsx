"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Target, ChevronRight, GraduationCap, BarChart3 } from "lucide-react";

// In a real app, you'd fetch this from your getExamSidebarServer API
const SYLLABUS_DATA = [
  {
    id: "s1",
    name: "Engineering Mathematics",
    slug: "engineering-mathematics",
    weightage: "15 Marks",
    description: "Core mathematical foundations for computer science.",
    chapters: ["Linear Algebra", "Calculus", "Differential Equations", "Probability"]
  },
  {
    id: "s2",
    name: "Theory of Computation",
    slug: "theory-of-computation",
    weightage: "8-10 Marks",
    description: "Automata theory, languages, and computability.",
    chapters: ["Regular Languages", "Context Free Grammars", "Turing Machines"]
  }
];

export default function SyllabusPage() {
  const params = useParams();
  const examSlug = params.examSlug;
  const courseSlug = params.courseSlug;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black">
      {/* MODERN HERO SECTION */}
      <div className="bg-white dark:bg-gray-950 border-b dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
            <GraduationCap size={20} />
            <span className="tracking-widest text-xs uppercase">Official Curriculum</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 italic">
            {courseSlug?.toString().replace(/-/g, " ").toUpperCase()}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            A comprehensive breakdown of subjects, chapters, and marking schemes. Plan your study strategy based on subject weightage.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN SYLLABUS LIST */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-8">
              <BookOpen className="text-blue-500" /> Subjects & Chapters
            </h2>
            
            {SYLLABUS_DATA.map((subject) => (
              <div key={subject.id} className="group bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">{subject.description}</p>
                    </div>
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                      {subject.weightage}
                    </span>
                  </div>

                  {/* CHAPTER PILLS */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {subject.chapters.map((ch) => (
                      <span key={ch} className="text-[11px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                        {ch}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/exams/${examSlug}/${courseSlug}/${subject.slug}`}
                    className="inline-flex items-center font-bold text-sm text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
                  >
                    Explore Subject Details <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* SIDEBAR: STATS & PREP TIPS */}
          <div className="space-y-6">
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-lg shadow-blue-500/20">
              <Target className="mb-4 opacity-80" size={32} />
              <h3 className="text-xl font-bold mb-2">Preparation Tip</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Focus on high-weightage subjects like {SYLLABUS_DATA[0].name} first. They contribute to nearly 15% of the total score.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="text-emerald-500" />
                <h3 className="font-bold dark:text-white">Quick Stats</h3>
              </div>
              <div className="space-y-4">
                <StatItem label="Total Subjects" value={SYLLABUS_DATA.length.toString()} />
                <StatItem label="Total Chapters" value="45+" />
                <StatItem label="Exam Duration" value="3 Hours" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b dark:border-gray-800 pb-2">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-bold dark:text-white">{value}</span>
    </div>
  );
}