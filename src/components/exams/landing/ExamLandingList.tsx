// src/components/exams/landing/ExamLandingList.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchExamLanding } from "@/services/client/exam.client";
import { ExamLandingUI } from "@/dto/examLanding.ui.dto";
import ExamLandingCard from "./ExamLandingCard";

interface Props {
  lang: "en" | "hi";
}

export default function ExamLandingList({ lang }: Props) {
  const [exams, setExams] = useState<ExamLandingUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamLanding()
      .then((res) => {
        if (res.success && res.data) {
          setExams(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading exams...
      </div>
    );
  }

  if (!exams.length) {
    return (
      <div className="py-10 text-center text-gray-500">
        No exams available
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Popular Exams
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <ExamLandingCard
            key={exam.id}
            exam={exam}
          />
        ))}
      </div>
    </section>
  );
}
