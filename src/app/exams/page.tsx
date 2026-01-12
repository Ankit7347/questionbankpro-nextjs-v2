// src/app/exams/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchExamCatalog } from "@/services/client/exam.client";
import { EducationLevelGroup } from "@/dto/examCatalog.ui.dto";
import EducationLevelSection from "@/components/exams/catalog/EducationLevelSection";

export default function ExamsPage() {
  const [data, setData] = useState<EducationLevelGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // ONE API CALL ONLY
  useEffect(() => {
    fetchExamCatalog("en")
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
          // default tab = first education level
          if (res.data.length > 0) {
            setActiveLevelId(res.data[0].educationLevelId);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // filter by active tab
  const activeGroups = useMemo(() => {
    if (!activeLevelId) return [];
    return data.filter(
      (g) => g.educationLevelId === activeLevelId
    );
  }, [data, activeLevelId]);

  // search filter (client-side only)
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return activeGroups;

    const q = search.toLowerCase();

    return activeGroups.map((group) => ({
      ...group,
      exams: group.exams.filter(
        (exam) =>
          exam.examName.toLowerCase().includes(q) ||
          exam.courses.some((c) =>
            c.name.toLowerCase().includes(q)
          )
      ),
    }));
  }, [activeGroups, search]);

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500">
        Loading exams…
      </div>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Exams
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Browse exams and choose your course
        </p>
      </header>

      {/* Tabs (Education Levels) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {data.map((level) => {
          const isActive =
            level.educationLevelId === activeLevelId;

          return (
            <button
              key={level.educationLevelId}
              onClick={() =>
                setActiveLevelId(level.educationLevelId)
              }
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
              {level.educationLevelName}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search exam or course…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none"
        />
      </div>

      {/* Catalog */}
      <div className="space-y-12">
        {filteredGroups.map((group) => (
          <EducationLevelSection
            key={group.educationLevelId}
            group={group}
          />
        ))}
      </div>
    </main>
  );
}
