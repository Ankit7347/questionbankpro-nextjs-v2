"use client";

import { ExamSidebarDto } from "@/dto/examSidebar.ui.dto";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation"; // Added for active state
import { Menu, X, ChevronRight } from "lucide-react";

export default function ExamSidebar({ data }: { data: ExamSidebarDto }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get current URL path

  if (!data.exam || !data.course) return null;
  const { exam, course, subjects } = data;

  // Shared Sidebar Content
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <div className="p-6 border-b border-gray-100 dark:border-slate-800">
        <h2 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">
          {exam.name}
        </h2>
        <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
          {course.name}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {subjects
          .sort((a, b) => a.order - b.order)
          .map((subject) => {
            const subjectHref = `/exams/${exam.slug}/${course.slug}/${subject.slug}`;
            // Check if current path matches subject link
            const isSubjectActive = pathname === subjectHref;

            return (
              <div key={subject.slug}>
                {/* Subject Link */}
                <Link
                  href={subjectHref}
                  onClick={() => setIsOpen(false)}
                  className={`block px-2 mb-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    isSubjectActive 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                >
                  {subject.name}
                </Link>

                <ul className="space-y-1">
                  {subject.chapters
                    .sort((a, b) => a.order - b.order)
                    .map((chapter) => {
                      const chapterHref = `${subjectHref}/${chapter.slug}`;
                      // Check if current path matches chapter link
                      const isChapterActive = pathname === chapterHref;

                      return (
                        <li key={chapter.slug}>
                          <Link
                            href={chapterHref}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors group ${
                              isChapterActive
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600"
                            }`}
                          >
                            <ChevronRight 
                              className={`w-3 h-3 transition-opacity ${
                                isChapterActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              }`} 
                            />
                            <span className="truncate">{chapter.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
            );
          })}
      </nav>
    </div>
  );

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-xl active:scale-95 transition-transform"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* MOBILE OVERLAY & DRAWER */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        <aside
          className={`absolute left-0 top-0 h-full w-[280px] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          <SidebarContent />
        </aside>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block h-full border-r border-gray-100 dark:border-slate-800">
        <SidebarContent />
      </div>
    </>
  );
}