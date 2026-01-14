// src/app/exams/[examSlug]/[courseSlug]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Subject {
  name: string;
  slug: string;
}

interface CourseOverview {
  exam: {
    name: string;
    slug: string;
  };
  course: {
    name: string;
    slug: string;
  };
  subjects: Subject[];
}

export default function CoursePage() {
  const { examSlug, courseSlug } = useParams<{
    examSlug: string;
    courseSlug: string;
  }>();

  const [data, setData] = useState<CourseOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const load = async () => {
    try {
      const res = await fetch(`/api/exams/${examSlug}/${courseSlug}`);

      if (res.status === 404) {
        setData(null);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load course");
      }

      const json = await res.json();
      setData(json.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  load();
}, [examSlug, courseSlug]);


  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500">
        Loading course…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-16 text-center text-red-500">
        Course not found
      </div>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link href="/exams" className="hover:underline">
          Exams
        </Link>
        <span className="mx-2">/</span>
        <span>{data.exam.name}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">
          {data.course.name}
        </span>
      </nav>

      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {data.course.name}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {data.exam.name}
        </p>
      </header>

      {/* Subjects */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Subjects
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.subjects.map((subject) => (
            <Link
              key={subject.slug}
              href={`/exams/${examSlug}/${courseSlug}/subject/${subject.slug}`}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-md transition"
            >
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {subject.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
