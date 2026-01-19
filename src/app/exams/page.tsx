"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchExamCatalog } from "@/services/client/exam.client";
import { EducationLevelGroupUI } from "@/dto/exam.ui.dto";
import EducationLevelSection from "@/components/exams/catalog/EducationLevelSection";

export default function ExamsPage() {
  const [data, setData] = useState<EducationLevelGroupUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchExamCatalog()
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
          if (res.data.length > 0) setActiveLevelId(res.data[0].educationLevelId);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredGroups = useMemo(() => {
    const active = activeLevelId ? data.filter(g => g.educationLevelId === activeLevelId) : [];
    if (!search.trim()) return active;
    const q = search.toLowerCase();
    return active.map(group => ({
      ...group,
      exams: group.exams.filter(e => 
        e.examName.toLowerCase().includes(q) || 
        e.subExams.some(c => c.name.toLowerCase().includes(q))
      ),
    }));
  }, [data, activeLevelId, search]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0B0E14] transition-colors duration-300">
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        
        {/* Header - Fixed Left Alignment */}
        <div className="mb-10 text-left">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Exams</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Find your path to success</p>
        </div>

        {/* Search & Tabs Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-start md:items-center justify-between">
          
          {/* Tabs - Now with visible borders in Light Mode */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            {data.map((level) => {
              const isActive = level.educationLevelId === activeLevelId;
              return (
                <button
                  key={level.educationLevelId}
                  onClick={() => setActiveLevelId(level.educationLevelId)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all
                    ${isActive 
                      ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-700" 
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                >
                  {level.educationLevelName}
                </button>
              );
            })}
          </div>

          {/* Search - Stronger contrast for Light Mode */}
          <div className="relative w-full md:max-w-sm">
            <input
              type="text"
              placeholder="Search exams or courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-16">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <EducationLevelSection key={group.educationLevelId} group={group} />
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
              <p className="text-gray-500 dark:text-gray-400">No results found for "{search}"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}