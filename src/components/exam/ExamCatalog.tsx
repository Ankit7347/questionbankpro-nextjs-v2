// src/components/exams/ExamCatalog.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchExamCatalog } from "@/services/client/exam.client";
import { EducationLevelGroup } from "@/types/exam";
import EducationLevelSection from "./EducationLevelSection";

interface Props {
  lang: "en" | "hi";
}

export default function ExamCatalog({ lang }: Props) {
  const [data, setData] = useState<EducationLevelGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamCatalog(lang)
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  }, [lang]);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading exams...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {data.map((group) => (
        <EducationLevelSection
          key={group.educationLevelId}
          group={group}
        />
      ))}
    </div>
  );
}
