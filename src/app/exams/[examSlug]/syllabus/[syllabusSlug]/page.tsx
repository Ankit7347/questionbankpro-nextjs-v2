// src/app/exams/[examSlug]/syllabus/[syllabusSlug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Layers, ChevronRight } from "lucide-react";

export default function SyllabusPage() {
  const params = useParams();
  const examSlug = params.examSlug as string;
  const syllabusSlug = params.syllabusSlug as string;

  // Safety guard
  if (!examSlug || !syllabusSlug) {
    return (
      <div className="p-10 text-center text-red-500">
        Invalid syllabus
      </div>
    );
  }

  // UI-only dummy data (replace later)
  const subjects = [
    { slug: "mathematics", name: "Mathematics" },
    { slug: "science", name: "Science" },
    { slug: "english", name: "English" },
  ];

  return (
    <div className="max-w-screen-xl mx-auto bg-white dark:bg-gray-900">

      {/* HEADER */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
            Syllabus
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {syllabusSlug.replace("-", " ").toUpperCase()}
          </h1>
          <p className="text-gray-500 mt-3 max-w-2xl">
            Select a subject to explore chapters and topics for this syllabus.
          </p>
        </div>
      </div>

      {/* QUICK INFO CARDS */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border dark:border-gray-700 p-6">
          <Layers className="text-blue-600 mb-4" />
          <h3 className="font-bold text-gray-900 dark:text-white">
            Structured Learning
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Subjects → Chapters → Topics
          </p>
        </div>

        <div className="rounded-2xl border dark:border-gray-700 p-6">
          <BookOpen className="text-emerald-600 mb-4" />
          <h3 className="font-bold text-gray-900 dark:text-white">
            Practice Ready
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Questions available at topic level
          </p>
        </div>
      </div>

      {/* SUBJECT LIST */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Subjects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Link
              key={subject.slug}
              href={`/exams/${examSlug}/syllabus/${syllabusSlug}/subject/${subject.slug}`}
              className="flex items-center justify-between rounded-xl border dark:border-gray-700 p-5 hover:border-blue-500 transition"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {subject.name}
              </span>
              <ChevronRight className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
