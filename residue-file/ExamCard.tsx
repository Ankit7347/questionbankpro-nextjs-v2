// components/exams/ExamCard.tsx

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ExamItem, ExamCategory } from "@/types/exam";

interface Props {
  exam: ExamItem;
  category: ExamCategory;
}

export function ExamCard({ exam, category }: Props) {
  const Icon = category.icon;

  return (
    <Link
      href={`/exams/${exam.slug}`}
      className="group flex flex-col rounded-2xl border bg-white dark:bg-gray-800 hover:shadow-xl transition-all"
    >
      <div className={`h-1.5 ${category.theme.accent}`} />
      <div className="flex flex-col flex-1 p-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5 ${category.theme.accent}`}>
          <Icon size={22} />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600">
          {exam.title}
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex-1">
          {exam.subtitle}
        </p>

        <div className="mt-6 pt-4 border-t flex items-center justify-between">
          <span className="text-sm font-bold text-blue-600">
            View Materials
          </span>
          <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white">
            <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
