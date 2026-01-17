// src/app/exams/[examSlug]/[courseSlug]/[subjectSlug]/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ListChecks, 
  Map, 
  ArrowRight, 
  Circle,
  FileText
} from "lucide-react";

const getSubjectData = (slug: string) => {
  const safeSlug = slug || "subject";
  const displayName = safeSlug.replace(/-/g, " ").toUpperCase();

  return {
    name: displayName,
    syllabus: [
      { unit: "Unit 1", title: "Fundamental Theory", details: "History, evolution, and core principles of the domain." },
      { unit: "Unit 2", title: "Technical Application", details: "Practical implementation and framework standards." },
      { unit: "Unit 3", title: "Advanced Analysis", details: "Performance optimization and system debugging." },
    ],
    chapters: [
      { id: 1, title: "Getting Started", slug: "intro", status: "completed", topics: 4 },
      { id: 2, title: "Core Frameworks", slug: "core", status: "current", topics: 7 },
      { id: 3, title: "Advanced Patterns", slug: "advanced", status: "upcoming", topics: 5 },
      { id: 4, title: "Deployment & Scaling", slug: "final", status: "upcoming", topics: 3 },
    ],
  };
};

export default function SubjectPage({ params }: { params: any }) {
  const [activeTab, setActiveTab] = useState<"path" | "syllabus">("path");
  // In Next.js 15, params is a Promise. For simpler dummy code:
  const data = getSubjectData("Mathematics"); 

  return (
    <div className="p-4 lg:p-8">
      {/* 1. TABS NAVIGATION */}
      <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl mb-8 w-full sm:w-fit">
        <button
          onClick={() => setActiveTab("path")}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
            activeTab === "path"
              ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Map className="w-4 h-4" />
          Learning Path
        </button>
        <button
          onClick={() => setActiveTab("syllabus")}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
            activeTab === "syllabus"
              ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <ListChecks className="w-4 h-4" />
          Syllabus Details
        </button>
      </div>

      {/* 2. TAB CONTENT: LEARNING PATH */}
      {activeTab === "path" && (
        <div className="relative space-y-0">
          {data.chapters.map((chapter, index) => (
            <div key={chapter.id} className="relative flex gap-6 pb-10 last:pb-0">
              {/* Vertical Line Connector */}
              {index !== data.chapters.length - 1 && (
                <div className="absolute left-[23px] top-10 w-0.5 h-full bg-gray-200 dark:bg-slate-800" />
              )}

              {/* Status Marker */}
              <div className="relative z-10 flex-shrink-0 mt-1">
                {chapter.status === "completed" ? (
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center border-4 border-white dark:border-slate-950">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : chapter.status === "current" ? (
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-blue-100 dark:border-blue-900/50 animate-pulse">
                    <Clock className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-400 flex items-center justify-center border-4 border-white dark:border-slate-950">
                    <Circle className="w-5 h-5 fill-current" />
                  </div>
                )}
              </div>

              {/* Chapter Card */}
              <Link
                href={`#`} // Update with actual path logic
                className={`flex-1 group p-5 rounded-2xl border transition-all ${
                  chapter.status === "current"
                    ? "bg-white dark:bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10"
                    : "bg-white/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
                      Chapter {chapter.id}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{chapter.topics} Detailed Topics</p>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                    chapter.status === "upcoming" ? "text-gray-300" : "text-blue-500"
                  }`} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* 3. TAB CONTENT: SYLLABUS (Non-link version) */}
      {activeTab === "syllabus" && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Official Syllabus Breakdown
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {data.syllabus.map((item) => (
              <div key={item.unit} className="p-6">
                <div className="flex gap-4">
                  <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded h-fit">
                    {item.unit}
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}