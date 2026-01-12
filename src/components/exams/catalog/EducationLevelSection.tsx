// src/components/exams/EducationLevelSection.tsx

import Link from "next/link";
import { EducationLevelGroup } from "@/dto/examCatalog.ui.dto";

interface Props {
  group: EducationLevelGroup;
}

export default function EducationLevelSection({ group }: Props) {
  return (
    <section className="space-y-4">
      {/* Education Level Header */}
      <header>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {group.educationLevelName}
        </h2>

        {group.educationLevelDescription && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-3xl">
            {group.educationLevelDescription}
          </p>
        )}
      </header>

      {/* Exams Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {group.exams.map((exam) => (
          <div
            key={exam.id}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
          >
            {/* Exam Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {exam.examName}
            </h3>

            {/* Course Buttons */}
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
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Courses coming soon
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
