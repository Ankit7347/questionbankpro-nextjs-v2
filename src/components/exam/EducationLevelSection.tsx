// src/components/exams/EducationLevelSection.tsx

import { EducationLevelGroup } from "@/types/exam";
import ExamCard from "./ExamCard";

interface Props {
  group: EducationLevelGroup;
}

export default function EducationLevelSection({ group }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        {group.educationLevelIcon && (
          <i
            className={`${group.educationLevelIcon} text-xl text-gray-700 dark:text-gray-200`}
            aria-hidden="true"
          />
        )}

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {group.educationLevelName}
        </h2>
      </div>

      {group.educationLevelDescription && (
        <p className="max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          {group.educationLevelDescription}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.exams.map((exam) => (
          <ExamCard
            key={exam.id}
            educationSlug={group.educationLevelId}
            exam={exam}
          />
        ))}
      </div>
    </section>
  );
}
