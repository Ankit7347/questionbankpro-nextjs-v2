// src/app/exams/[examSlug]/[subExamSlug]/(assessment)/pyq/[year]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";

/* ---------------------------------
 * MOCK DATA WITH CONDITIONAL LOGIC
 * --------------------------------- */
const EXAM_DATA_MOCK = {
  "gate-2026-cs-it": {
    type: "papers",
    items: [
      { slug: "computer-science", title: "Computer Science", info: "65 Qs", color: "from-blue-500 to-indigo-500" },
      { slug: "mathematics", title: "Mathematics", info: "42 Qs", color: "from-emerald-500 to-teal-500" },
    ]
  },
  "mba": {
    type: "semesters",
    items: [
      { slug: "sem-1", title: "Semester 1", info: "8 Subjects", color: "from-purple-500 to-pink-500" },
      { slug: "sem-2", title: "Semester 2", info: "7 Subjects", color: "from-orange-500 to-red-500" },
      { slug: "sem-3", title: "Semester 3", info: "6 Subjects", color: "from-blue-500 to-cyan-500" },
    ]
  }
};

interface PageProps {
  examSlug: string;
  subExamSlug: string;
  year: string;
}

export default function PYQYearPage({ params }: { params: Promise<PageProps> }) {
  const { examSlug, subExamSlug, year } = use(params);

  // 1. Find the correct data based on the subExamSlug
  const data = EXAM_DATA_MOCK[subExamSlug as keyof typeof EXAM_DATA_MOCK];

  if (!data) return notFound();

  const isSemesterType = data.type === "semesters";

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {isSemesterType ? "Select Semester" : "Select Paper"} — {year}
        </h1>
        <p className="text-gray-600 mt-2 capitalize">
          {examSlug.replace(/-/g, ' ')} / {subExamSlug.replace(/-/g, ' ')}
        </p>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item) => (
          <Link
            key={item.slug}
            href={`/exams/${examSlug}/${subExamSlug}/pyq/${year}/${item.slug}`}
            className="group"
          >
            {/* Conditional Styling: Semesters often look better as solid cards, 
                while papers look good with gradients */}
            <div className={`h-full rounded-2xl p-6 transition-all duration-300 shadow-sm border 
              ${isSemesterType 
                ? "bg-white hover:border-indigo-500 hover:shadow-md" 
                : `bg-gradient-to-br ${item.color} text-white hover:scale-[1.02]`
              }`}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className={`text-xl font-bold ${isSemesterType ? "text-gray-900" : "text-white"}`}>
                    {item.title}
                  </h2>
                  <p className={`mt-1 text-sm ${isSemesterType ? "text-gray-500" : "text-white/80"}`}>
                    {item.info}
                  </p>
                </div>

                <div className={`mt-6 inline-flex items-center text-sm font-bold 
                  ${isSemesterType ? "text-indigo-600" : "text-white"}`}
                >
                  {isSemesterType ? "View Subjects" : "Start Practice"} →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <div className="mt-10 p-4 bg-gray-50 rounded-lg text-sm text-gray-500 italic">
        Note: You are viewing {isSemesterType ? "Academic Semester" : "Competitive Exam"} PYQs for the year {year}.
      </div>
    </main>
  );
}