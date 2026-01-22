// src/components/exams/landing/ExamLandingList.tsx
import { fetchExamLanding } from "@/services/client/exam.client";
import ExamLandingCard from "./ExamLandingCard";

interface Props {
  lang: "en" | "hi";
}

export default async function ExamLandingList({ lang }: Props) {
  // 1. Fetch data on the server
  const res = await fetchExamLanding(); 

  const exams = res.success && res.data ? res.data : [];
  // 2. Handle empty states
  if (!exams.length) {
    return (
      <div className="py-10 text-center text-gray-500">
        No exams available in {lang === 'hi' ? 'Hindi' : 'English'}
      </div>
    );
  }

  return (
  // Changed max-w-screen-xl (1280px) to max-w-5xl (~1024px or 70% feel) 
// Added mx-auto to keep it in the middle
<section className="max-w-7xl mx-auto space-y-6 py-4 px-4">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
    {lang === 'hi' ? 'लोकप्रिय परीक्षाएँ' : 'Popular Exams'}
  </h2>
  
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {exams.map((exam) => (
      <ExamLandingCard key={exam.id} exam={exam} />
    ))}
  </div>
</section>
  );
}