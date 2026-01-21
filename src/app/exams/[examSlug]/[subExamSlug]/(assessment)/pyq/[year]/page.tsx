// src/app/exams/[examSlug]/[subExamSlug]/(assessment)/pyq/[year]/page.tsx
"use client";

import { use, useMemo } from "react";
import Link from "next/link";

/* ---------------------------------
 * CONFIGURATION & TYPES
 * --------------------------------- */
type CourseConfig = {
  years: number;
  semestersPerYear: number;
  colorScheme: string;
};

const COURSE_MAP: Record<string, CourseConfig> = {
  // --- UNDERGRADUATE PROGRAMS ---
  "btech-cs":        { years: 4, semestersPerYear: 2, colorScheme: "from-violet-500 to-purple-600" },
  "btech-me":        { years: 4, semestersPerYear: 2, colorScheme: "from-violet-500 to-purple-600" },
  "btech-ce":        { years: 4, semestersPerYear: 2, colorScheme: "from-violet-500 to-purple-600" },
  "btech-ece":       { years: 4, semestersPerYear: 2, colorScheme: "from-violet-500 to-purple-600" },
  "btech-ee":        { years: 4, semestersPerYear: 2, colorScheme: "from-violet-500 to-purple-600" },
  "btech-it":        { years: 4, semestersPerYear: 2, colorScheme: "from-violet-500 to-purple-600" },
  "mbbs":            { years: 5, semestersPerYear: 1, colorScheme: "from-red-500 to-rose-600" },
  "bds":             { years: 4, semestersPerYear: 2, colorScheme: "from-red-400 to-rose-500" },
  "bsc-physics":     { years: 3, semestersPerYear: 2, colorScheme: "from-emerald-500 to-teal-600" },
  "bsc-maths":       { years: 3, semestersPerYear: 2, colorScheme: "from-emerald-500 to-teal-600" },
  "bcom-hons":       { years: 3, semestersPerYear: 2, colorScheme: "from-amber-500 to-orange-600" },
  "ba-economics":    { years: 3, semestersPerYear: 2, colorScheme: "from-blue-500 to-indigo-600" },
  "ba-english":      { years: 3, semestersPerYear: 2, colorScheme: "from-blue-500 to-indigo-600" },
  "ba-llb":          { years: 5, semestersPerYear: 2, colorScheme: "from-slate-600 to-slate-800" },

  // --- POSTGRADUATE PROGRAMS ---
  "mtech-cs":         { years: 2, semestersPerYear: 2, colorScheme: "from-cyan-500 to-blue-600" },
  "mtech-structural": { years: 2, semestersPerYear: 2, colorScheme: "from-cyan-500 to-blue-600" },
  "mtech-vlsi":       { years: 2, semestersPerYear: 2, colorScheme: "from-cyan-500 to-blue-600" },
  "mba-finance":      { years: 2, semestersPerYear: 2, colorScheme: "from-pink-500 to-rose-600" },
  "mba-marketing":    { years: 2, semestersPerYear: 2, colorScheme: "from-pink-500 to-rose-600" },
  "mba-hr":           { years: 2, semestersPerYear: 2, colorScheme: "from-pink-500 to-rose-600" },
  "pgdm-analytics":   { years: 2, semestersPerYear: 2, colorScheme: "from-indigo-500 to-blue-700" },
  "msc-data-science": { years: 2, semestersPerYear: 2, colorScheme: "from-teal-500 to-cyan-600" },
  "msc-physics":      { years: 2, semestersPerYear: 2, colorScheme: "from-teal-500 to-cyan-600" },
  "mcom":             { years: 2, semestersPerYear: 2, colorScheme: "from-orange-500 to-yellow-600" },
  "ma-pol-science":   { years: 2, semestersPerYear: 2, colorScheme: "from-pink-500 to-rose-600" },
  "md-medicine":      { years: 3, semestersPerYear: 1, colorScheme: "from-red-600 to-rose-700" },
  "ms-surgery":       { years: 3, semestersPerYear: 1, colorScheme: "from-red-600 to-rose-700" },
  "llm-corporate":    { years: 1, semestersPerYear: 2, colorScheme: "from-slate-700 to-slate-900" },
};

// Default subjects for non-mapped exams (GATE, PCMB, etc.)
const DEFAULT_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology"];
const DEFAULT_COLOR = "from-gray-600 to-gray-800";

interface PageProps {
  examSlug: string;
  subExamSlug: string;
  year: string;
}

export default function PYQYearPage({ params }: { params: Promise<PageProps> }) {
  const { examSlug, subExamSlug, year } = use(params);

  const normalizedSlug = subExamSlug.toLowerCase();
  const course = COURSE_MAP[normalizedSlug];

  const displayItems = useMemo(() => {
    // IF NOT IN JSON: Show PCMB Subject Cards
    if (!course) {
      return DEFAULT_SUBJECTS.map((subject) => ({
        slug: subject.toLowerCase(),
        title: subject,
        info: `Subject-wise Previous Year Papers`,
        color: DEFAULT_COLOR,
        isSubject: true
      }));
    }

    // IF IN JSON: Show Semester/Year Cards
    const totalSemesters = course.years * course.semestersPerYear;
    return Array.from({ length: totalSemesters }, (_, i) => ({
      slug: `sem-${i + 1}`,
      title: course.semestersPerYear === 1 ? `Year ${i + 1}` : `Semester ${i + 1}`,
      info: `Past Papers & Solutions`,
      color: course.colorScheme,
      isSubject: false
    }));
  }, [course]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-2 uppercase tracking-widest">
          <span className="px-2 py-0.5 bg-indigo-100 rounded">{subExamSlug}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">Academic PYQs</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Select {!course ? "Subject" : (course.semestersPerYear === 1 ? "Year" : "Semester")} 
          <span className="text-gray-400 font-light ml-3">— {year}</span>
        </h1>
      </div>

      <section className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {displayItems.map((item) => (
          <Link
            key={item.slug}
            href={`/exams/${examSlug}/${subExamSlug}/pyq/${year}/${item.slug}`}
            className="group"
          >
            <div className="relative overflow-hidden h-full bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10">
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${item.color}`} />

              <div className="flex flex-col h-full justify-between pt-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    {item.info}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase group-hover:translate-x-1 transition-transform">
                    Explore →
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                     <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <div className="mt-16 p-5 bg-white border border-gray-200 rounded-xl flex items-start gap-4">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 font-bold">i</div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">Academic Structure Information</h4>
          <p className="text-sm text-gray-500 mt-1">
            Viewing resources for {subExamSlug.toUpperCase()}. 
            All papers are categorized by the official {!course ? "subject" : "semester"} scheme for the {year} academic session.
          </p>
        </div>
      </div>
    </main>
  );
}