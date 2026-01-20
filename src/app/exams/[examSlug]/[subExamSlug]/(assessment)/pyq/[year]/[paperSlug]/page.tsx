// src/app/exams/[examSlug]/[subExamSlug]/(assessment)/pyq/[year]/[paperSlug]/page.tsx
"use client";

import { notFound } from "next/navigation";

import { use } from "react";

interface PageProps {
    examSlug: string;
    subExamSlug: string;
    year: string;
    paperSlug: string;
}
export default function PYQPaperPage({ params }: { params: Promise<PageProps> }) {

  const { examSlug, subExamSlug, year, paperSlug } = use(params);

  /* -----------------------------
   * BASIC ROUTE VALIDATION
   * ----------------------------- */

  if (!examSlug || !subExamSlug || !paperSlug) {
    notFound();
  }

  // Year validation (strict by default)
  if (!/^\d{4}$/.test(year)) {
    notFound();
  }

  /* -----------------------------
   * DATA RESOLUTION (example)
   * ----------------------------- */
  /**
   * Internally:
   * examSlug      -> Exam
   * subExamSlug   -> SubExam
   * paperSlug     -> Paper / Subject / Semester
   * year          -> PYQ year
   *
   * const exam = await getExamBySlug(examSlug);
   * const subExam = await getSubExam(exam._id, subExamSlug);
   * const paper = await getPaperBySlug(subExam._id, paperSlug);
   * const questions = await getPYQs({ paperId: paper._id, year });
   */

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold">
        Previous Year Questions
      </h1>

      <p className="text-gray-600 mt-1 text-sm">
        Exam: <strong>{examSlug}</strong> ·{" "}
        Sub-Exam: <strong>{subExamSlug}</strong> ·{" "}
        Year: <strong>{year}</strong>
      </p>

      <section className="mt-6">
        {/* Replace with actual PYQ list */}
        <div className="border rounded-md p-4 text-sm text-gray-500">
          PYQs for <b>{paperSlug}</b> will appear here
        </div>
      </section>
    </main>
  );
}
