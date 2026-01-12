// components/exams/CategoryTabs.tsx

"use client";

import { ExamCategory } from "@/types/exam";

interface Props {
  categories: ExamCategory[];
  active: string;
  counts: Record<string, number>;
  onChange: (id: any) => void;
}

export function CategoryTabs({ categories, active, counts, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = active === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`
              min-w-[7.5rem] rounded-2xl border transition-all
              ${isActive
                ? `${cat.theme.activeBg} text-white shadow-lg scale-[1.03]`
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
              }
            `}
          >
            <div className="flex flex-col items-center p-4">
              <div className={`rounded-xl p-3 mb-2 ${isActive ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"}`}>
                <Icon className={isActive ? "text-white" : "text-gray-400"} size={24} />
              </div>
              <span className="text-sm font-extrabold uppercase">
                {cat.label}
              </span>
              <span className={`mt-1 text-[0.65rem] px-2 py-0.5 rounded-md font-bold
                ${isActive ? "bg-white/30" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}
              `}>
                {counts[cat.id] ?? 0}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
