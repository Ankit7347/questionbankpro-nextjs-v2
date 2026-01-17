// src/components/exams/DynamicBreadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface Props {
  examName: string;
  courseName: string;
}

export default function DynamicBreadcrumbs({ examName, courseName }: Props) {
  const pathname = usePathname();
  
  // Split path: /exams/gate-exam/gate-2026-cs-it/mathematics/linear-algebra
  // Segments: ["exams", "gate-exam", "gate-2026-cs-it", "mathematics", "linear-algebra"]
  const segments = pathname.split("/").filter(Boolean);

  const formatSlug = (slug: string) => {
    return slug.replace(/-/g, " ").toUpperCase();
  };

  return (
    <nav className="flex items-center gap-2 text-sm font-semibold text-gray-500 overflow-x-auto no-scrollbar py-2">
      <Link href="/exams" className="hover:text-blue-600 shrink-0">Exams</Link>

      {segments.slice(1).map((segment, index) => {
        // Build the URL for this specific breadcrumb link
        const url = `/${segments.slice(0, index + 2).join("/")}`;
        const isLast = index === segments.length - 2;
        
        // Decide what text to show: 
        // Index 0 is Exam, Index 1 is Course, others are Subject/Chapter
        let label = formatSlug(segment);
        if (index === 0) label = examName;
        if (index === 1) label = courseName;

        return (
          <div key={url} className="flex items-center gap-2 shrink-0">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 dark:text-white truncate">
                {label}
              </span>
            ) : (
              <Link href={url} className="hover:text-blue-600 transition truncate">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}