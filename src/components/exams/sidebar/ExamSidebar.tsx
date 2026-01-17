"use client"; // Required for the mobile toggle state

import { ExamSidebarDto } from "@/dto/examSidebar.ui.dto";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react"; // Optional: Install lucide-react for icons

export default function ExamSidebar({ data }: { data: ExamSidebarDto }) {
  const [isOpen, setIsOpen] = useState(false);

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
          .map((subject) => (
            <div key={subject.slug}>
              <p className="px-2 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {subject.name}
              </p>
              <ul className="space-y-1">
                {subject.chapters
                  .sort((a, b) => a.order - b.order)
                  .map((chapter) => (
                    <li key={chapter.slug}>
                      <Link
                        href={`/exams/${exam.slug}/${course.slug}/${subject.slug}/${chapter.slug}`}
                        onClick={() => setIsOpen(false)} // Close drawer on link click
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors group"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="truncate">{chapter.name}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* MOBILE TOGGLE BUTTON (Floating) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-xl active:scale-95 transition-transform"
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* MOBILE OVERLAY & DRAWER */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-visibility duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Drawer */}
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

      {/* DESKTOP SIDEBAR (Static) */}
      <div className="hidden lg:block h-full">
        <SidebarContent />
      </div>
    </>
  );
}