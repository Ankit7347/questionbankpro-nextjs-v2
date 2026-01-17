// src/components/exams/course/CourseSubjectSection.tsx

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CourseSubjectSectionProps {
  subjects: { name: string; slug: string }[];
  examSlug: string;
  courseSlug: string;
}

export default function CourseSubjectSection({ 
  subjects, 
  examSlug, 
  courseSlug 
}: CourseSubjectSectionProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <Link
          key={subject.slug}
          href={`/exams/${examSlug}/${courseSlug}/${subject.slug}`}
          className="group flex items-center justify-between rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-[#11141B] p-6 shadow-sm hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/5"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
              {subject.name}
            </h3>
            <p className="text-xs text-gray-400 font-medium">View chapters & notes</p>
          </div>
          <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-600 transition-all">
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </div>
        </Link>
      ))}
    </div>
  );
}