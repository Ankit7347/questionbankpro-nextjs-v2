// src/components/exams/ui/ResourceNotFound.tsx
"use client";

import Link from "next/link";
import { Search, ArrowLeft, Home, HelpCircle, AlertTriangle } from "lucide-react";

interface ResourceNotFoundProps {
  type: "Exam" | "Course" | "Subject" | "Chapter" | "Topic";
  slug: string;
  backLink: string;
}

export default function ResourceNotFound({ type, slug, backLink }: ResourceNotFoundProps) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-white dark:bg-slate-950 rounded-3xl border border-gray-100 dark:border-slate-900 shadow-sm mt-4">
      <div className="max-w-md w-full text-center">
        
        {/* Animated Visual Header */}
        <div className="relative mb-10 flex justify-center">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full scale-125 blur-3xl opacity-40 animate-pulse" />
          <div className="relative">
            <div className="bg-white dark:bg-slate-900 border-2 border-gray-50 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl transform -rotate-3">
              <AlertTriangle className="w-14 h-14 text-amber-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-2xl shadow-lg transform rotate-12">
              <Search className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-10">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
            {type} Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed px-4">
            We looked everywhere, but we couldn't find the {type.toLowerCase()} 
            <span className="block mt-2 font-mono text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 py-1 px-3 rounded-lg w-fit mx-auto">
              "{slug}"
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href={backLink}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-blue-500/25"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Directory
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-slate-800 transition-all active:scale-95 border border-gray-100 dark:border-slate-800"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>

        {/* Helpful Tip */}
        <div className="mt-12 pt-6 border-t border-gray-50 dark:border-slate-900/50">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            Pro Tip: Double check the URL for typos
          </div>
        </div>
      </div>
    </div>
  );
}