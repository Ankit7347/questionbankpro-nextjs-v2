// src/app/exams/[examSlug]/[subExamSlug]/(assessment)/pyq/[year]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";

/* ---------------------------------
 * MOCK DATA (TS FRIENDLY)
 * --------------------------------- */
type PYQPaper = {
  slug: string;
  title: string;
  questions: number;
  color: string;
};

const PYQ_PAPERS_MOCK: PYQPaper[] = [
  {
    slug: "computer-science",
    title: "Computer Science",
    questions: 65,
    color: "from-blue-500 to-indigo-500",
  },
  {
    slug: "mathematics",
    title: "Mathematics",
    questions: 42,
    color: "from-emerald-500 to-teal-500",
  },
  {
    slug: "aptitude",
    title: "General Aptitude",
    questions: 25,
    color: "from-pink-500 to-rose-500",
  },
];

interface PageProps {
  examSlug: string;
  subExamSlug: string;
  year: string;
}

export default function PYQYearPage({
  params,
}: {
  params: Promise<PageProps>;
}) {
  /* 🔒 RULE OBEYED — DO NOT TOUCH */
  const { examSlug, subExamSlug, year } = use(params);

  /* -----------------------------
   * VALIDATION
   * ----------------------------- */
  if (!examSlug || !subExamSlug) {
    notFound();
  }

  if (!/^\d{4}$/.test(year)) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* ---------- HEADER ---------- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          PYQ Papers – {year}
        </h1>
        <p className="text-gray-600 mt-2">
          Exam: <span className="font-medium">{examSlug}</span> ·{" "}
          Sub-Exam: <span className="font-medium">{subExamSlug}</span>
        </p>
      </div>

      {/* ---------- GRID ---------- */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PYQ_PAPERS_MOCK.map((paper) => (
          <Link
            key={paper.slug}
            href={`/exams/${examSlug}/${subExamSlug}/pyq/${year}/${paper.slug}`}
            className="group"
          >
            <div
              className={`h-full rounded-xl bg-gradient-to-br ${paper.color} p-[1px]`}
            >
              <div className="h-full rounded-xl bg-white p-5 transition group-hover:scale-[1.02]">
                <h2 className="text-lg font-semibold">
                  {paper.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {paper.questions} Questions
                </p>

                <div className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 group-hover:underline">
                  View PYQs →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ---------- FOOTER NOTE ---------- */}
      <div className="mt-10 text-sm text-gray-500">
        Select a paper to view detailed previous year questions.
      </div>
    </main>
  );
}
