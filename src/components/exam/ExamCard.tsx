// src/components/exams/ExamCard.tsx

import Link from "next/link";
import { ExamCard as ExamCardType } from "@/types/exam";

interface Props {
  educationSlug: string;
  exam: ExamCardType;
}

export default function ExamCard({ educationSlug, exam }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-3">
        {exam.icon && (
          <i
            className={`${exam.icon} mt-1 text-lg text-gray-700 dark:text-gray-200`}
            aria-hidden="true"
          />
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {exam.examName}
          </h3>

          {exam.shortName && (
            <p className="text-xs text-gray-500">
              {exam.shortName}
            </p>
          )}
        </div>
      </div>

      {exam.description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {exam.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {exam.courses.map((course) => (
          <Link
            key={course.id}
            href={`/exams/${educationSlug}/${exam.examSlug}/${course.slug}`}
            className="flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {course.icon && (
              <i
                className={`${course.icon} text-sm`}
                aria-hidden="true"
              />
            )}

            <span>{course.name}</span>

            {course.badge && (
              <span className="ml-1 rounded bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-300">
                {course.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
