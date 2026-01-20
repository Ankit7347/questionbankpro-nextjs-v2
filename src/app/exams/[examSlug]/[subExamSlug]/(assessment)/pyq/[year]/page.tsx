// src/app/exams/[examSlug]/[subExamSlug]/(assessment)/pyq/[year]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { use } from "react";

interface PageProps {
    examSlug: string;
    subExamSlug: string;
    year: string;
}

export default function PYQPaperPage({ params }: {params:Promise<PageProps>}) {
  const { examSlug, subExamSlug, year } = use(params);

  if (!examSlug || !subExamSlug) {
    notFound();
  }

  if (!/^\d{4}$/.test(year)) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold">Previous Year Questions</h1>

      <p className="text-gray-600 mt-1 text-sm">
        Exam: <strong>{examSlug}</strong> ·{" "}
        Sub-Exam: <strong>{subExamSlug}</strong> ·{" "}
        Year: <strong>{year}</strong>
      </p>

      <div className="mt-6 border rounded-md p-4 text-sm text-gray-500">
        PYQs for <b></b> will appear here
      </div>
    </main>
  );
}
