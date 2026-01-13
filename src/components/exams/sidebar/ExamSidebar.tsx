/**
 * src/components/exams/sidebar/ExamSidebar.tsx
 */

import { ExamSidebarDto } from "@/dto/examSidebar.ui.dto";
import Link from "next/link";

export default function ExamSidebar({ data }: { data: ExamSidebarDto }) {
  return (
    <aside className="w-72 border-r p-4">
      <h2 className="mb-4 font-semibold">
        {data.exam.name} – {data.course.name}
      </h2>

      {data.subjects.map((subject) => (
        <div key={subject.slug} className="mb-4">
          <p className="font-medium">{subject.name}</p>
          <ul className="ml-4 mt-2 space-y-1">
            {subject.chapters.map((chapter) => (
              <li key={chapter.slug}>
                <Link href={`${subject.slug}/${chapter.slug}`}>
                  {chapter.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
