/**
 * src/components/exams/sidebar/ExamSidebar.tsx
 */

import { ExamSidebarDto } from "@/dto/examSidebar.ui.dto";
import Link from "next/link";

export default function ExamSidebar({ data }: { data: ExamSidebarDto }) {
  if (!data.exam || !data.course) {
    return null;
  }

  // ✅ TS now knows these are NOT null
  const { exam, course, subjects } = data;

  return (
    <aside className="w-72 border-r p-4">
      <h2 className="mb-4 font-semibold">
        {exam.name} – {course.name}
      </h2>

      {subjects
        .sort((a, b) => a.order - b.order)
        .map((subject) => (
          <div key={subject.slug} className="mb-4">
            <p className="font-medium">{subject.name}</p>

            <ul className="ml-4 mt-2 space-y-1">
              {subject.chapters
                .sort((a, b) => a.order - b.order)
                .map((chapter) => (
                  <li key={chapter.slug}>
                    <Link
                      href={`/exams/${exam.slug}/${course.slug}/${subject.slug}/${chapter.slug}`}
                    >
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
