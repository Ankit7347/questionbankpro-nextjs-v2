import Link from "next/link";
import { EducationLevelGroupUI } from "@/dto/exam.ui.dto";

interface Props {
  group: EducationLevelGroupUI;
}

export default function EducationLevelSection({ group }: Props) {
  return (
    <section className="space-y-6">
      {/* Section Header with Left-Aligned Border Accent */}
      <header className="relative pl-4">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full"></div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {group.educationLevelName}
        </h2>
        {group.educationLevelDescription && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            {group.educationLevelDescription}
          </p>
        )}
      </header>

      {/* Exams Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {group.exams.map((exam) => (
          <div
            key={exam.id}
            className="group flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12151C] p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900/50 transition-all duration-300"
          >
            <div>
              {/* Exam Title - Highly visible */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {exam.examName}
              </h3>
              
              <div className="mt-1 h-1 w-8 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:w-12 group-hover:bg-blue-500 transition-all duration-300"></div>
            </div>

            {/* Course Buttons */}
            <div className="mt-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 block">
                Available Courses
              </span>
              
              {exam.subExams.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {exam.subExams.map((course) => (
                    <Link
                      key={course.id}
                      href={`/exams/${exam.examSlug}/${course.slug}`}
                      className="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                    >
                      {course.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm italic text-gray-400 dark:text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                  Coming soon
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}