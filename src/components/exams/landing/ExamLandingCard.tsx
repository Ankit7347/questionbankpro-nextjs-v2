// src/components/exams/landing/ExamLandingCard.tsx

import Link from "next/link";
import { ExamLandingUI } from "@/dto/examLanding.ui.dto";

interface Props {
  exam: ExamLandingUI;
}

export default function ExamLandingCard({ exam }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {exam.examName}
      </h3>

      {exam.courses.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {exam.courses.map((course) => (
            <Link
              key={course.id}
              href={`/exams/${exam.examSlug}/${course.slug}`}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {course.name}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
          Courses coming soon
        </p>
      )}
    </div>
  );
}
