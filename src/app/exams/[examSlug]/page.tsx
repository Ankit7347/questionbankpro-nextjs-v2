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
    <div className="flex flex-col">
      {/* 1. Hero renders first with its background bleeding to edges */}
      <ExamHero examSlug={examSlug} />
      
      {/* 2. Stats container overlaps Hero. No space-y between Hero and Stats! */}
      {/* <div className="relative z-10"> */}
        <ExamQuickStats /> 
      {/* </div> */}

      {/* 3. The rest of the content has standard spacing */}
      {/* <div className="space-y-12 mt-12"> */}
        <ExamSyllabusPicker examSlug={examSlug} syllabi={syllabi} />
        <ExamSubjectGrid examSlug={examSlug} subjects={subjects} />
      {/* </div> */}
    </div>
  );
}