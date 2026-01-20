// src/app/exams/[examSlug]/[subExamSlug]/(assessment)/pyq/[year]/[paperSlug]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { use } from "react";

/* ---------------------------------
 * MOCK DATA (TS FRIENDLY)
 * --------------------------------- */
type PYQQuestion = {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  topic: string;
};

const PYQ_QUESTIONS_MOCK: PYQQuestion[] = [
  {
    id: 1,
    title: "Explain the working of a process scheduler",
    difficulty: "Medium",
    marks: 5,
    topic: "Process Management",
  },
  {
    id: 2,
    title: "What is deadlock? Explain necessary conditions",
    difficulty: "Easy",
    marks: 3,
    topic: "Deadlocks",
  },
  {
    id: 3,
    title: "Design a page replacement algorithm",
    difficulty: "Hard",
    marks: 10,
    topic: "Memory Management",
  },
  {
    id: 4,
    title: "Compare paging and segmentation",
    difficulty: "Medium",
    marks: 5,
    topic: "Memory Management",
  },
];

interface PageProps {
  examSlug: string;
  subExamSlug: string;
  year: string;
  paperSlug: string;
}

export default function PYQPaperPage({
  params,
}: {
  params: Promise<PageProps>;
}) {
  /* 🔒 RULE PRESERVED — DO NOT TOUCH */
  const { examSlug, subExamSlug, year, paperSlug } = use(params);

  /* -----------------------------
   * VALIDATION
   * ----------------------------- */
  if (!examSlug || !subExamSlug || !paperSlug) {
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
          {paperSlug.replace(/-/g, " ").toUpperCase()} – PYQs {year}
        </h1>

        <p className="text-gray-600 mt-2">
          Exam: <span className="font-medium">{examSlug}</span> ·{" "}
          Sub-Exam: <span className="font-medium">{subExamSlug}</span>
        </p>
      </div>

      {/* ---------- STATS ---------- */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-blue-700">Total Questions</p>
          <p className="text-2xl font-bold text-blue-900">
            {PYQ_QUESTIONS_MOCK.length}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">Total Marks</p>
          <p className="text-2xl font-bold text-emerald-900">
            {PYQ_QUESTIONS_MOCK.reduce((a, q) => a + q.marks, 0)}
          </p>
        </div>

        <div className="rounded-xl bg-purple-50 p-4">
          <p className="text-sm text-purple-700">Difficulty Mix</p>
          <p className="text-sm font-medium text-purple-900">
            Easy · Medium · Hard
          </p>
        </div>
      </div>

      {/* ---------- QUESTIONS LIST ---------- */}
      <section className="space-y-4">
        {PYQ_QUESTIONS_MOCK.map((q) => (
          <div
            key={q.id}
            className="rounded-xl border p-5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-medium text-lg">{q.title}</h2>

              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  q.difficulty === "Easy"
                    ? "bg-green-100 text-green-700"
                    : q.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {q.difficulty}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              <span>
                🧠 Topic: <b>{q.topic}</b>
              </span>
              <span>
                📝 Marks: <b>{q.marks}</b>
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* ---------- FOOTER NOTE ---------- */}
      <div className="mt-10 text-sm text-gray-500">
        These questions are collected from official previous year papers.
      </div>
    </main>
  );
}
