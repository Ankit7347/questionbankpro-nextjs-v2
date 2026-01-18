// src/app/exams/[examSlug]/page.tsx

import { ExamHero } from "@/components/exams/overview/ExamHero";
import { ExamQuickStats } from "@/components/exams/overview/ExamQuickStats";
import { ExamSyllabusPicker } from "@/components/exams/overview/ExamSyllabusPicker";
import { ExamSubjectGrid } from "@/components/exams/overview/ExamSubjectGrid";
import { syllabi, subjects } from "@/components/exams/overview/examOverview.mock";

export default async function ExamOverviewPage({
  params,
}: {
  params: Promise<{ examSlug: string }>;
}) {
  const { examSlug } = await params;

  return (
    <div className="w-[90%] max-w-9xl mx-auto flex flex-col">
      {/* 1. Hero: Keeps full width for background bleed */}
      <ExamHero examSlug={examSlug} />
      
      {/* Wrapper for 90% width content */}
        
        {/* 2. Stats: Pulling up to overlap the Hero if needed via negative margin */}
        <div className="relative z-10 -mt-8"> 
          <ExamQuickStats /> 
        </div>

        {/* 3. Main Content Area */}
        <div className="space-y-12 mt-12 mb-20">
          <ExamSyllabusPicker examSlug={examSlug} syllabi={syllabi} />
          <ExamSubjectGrid examSlug={examSlug} subjects={subjects} />
        </div>
    </div>
  );
}