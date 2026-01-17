// src/app/exams/[examSlug]/[syllabusSlug]/[subjectSlug]/[chapterSlug]/[topicSlug]/page.tsx
"use client";

import { useState, use } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Download, 
  Printer, 
  Share2, 
  Bookmark,
  CheckCircle,
  ArrowRight,
  FileText,
  AlertCircle
} from "lucide-react";

// Import Centralized Data
import { EXAMS_DATA } from "@/data/mockData";

export default function TopicPage({ 
  params 
}: { 
  params: Promise<{ examSlug: string; courseSlug: string; subjectSlug: string; chapterSlug: string; topicSlug: string }> 
}) {
  const { examSlug, courseSlug, subjectSlug, chapterSlug, topicSlug } = use(params);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Data Lookup Logic
  const exam = EXAMS_DATA[examSlug as keyof typeof EXAMS_DATA];
  const course = exam?.courses[courseSlug as keyof typeof exam.courses];
  const subject = course?.subjects[subjectSlug as keyof typeof course.subjects];
  const chapter = subject?.chapters.find((c) => c.slug === chapterSlug);
  const data = chapter?.topics.find((t) => t.slug === topicSlug);

  // Fallback if topic is not found
  if (!data) {
    return <div className="p-20 text-center font-bold">Topic content not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* 1. TOP FOCUS HEADER */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-900">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href={`/exams/${examSlug}/${courseSlug}/${subjectSlug}/${chapterSlug}`}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline italic opacity-60 font-normal">Chapter:</span> {chapter?.title}
          </Link>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 2. MAIN CONTENT */}
        <article className="lg:col-span-8">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest">
                {data.difficulty}
              </span>
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Updated {data.lastUpdated}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              {data.title}
            </h1>
            <p className="text-gray-500 font-medium">Estimated Reading Time: {data.readingTime}</p>
          </header>

          <div className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-black prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:py-1"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />

          <div className="mt-16 pt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
              <Printer className="w-4 h-4" /> Print Article
            </button>
            <Link 
              href={`/exams/${examSlug}/${courseSlug}/${subjectSlug}/${chapterSlug}`} 
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:translate-x-1"
            >
              Back to Playlist <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </article>

        {/* 3. SIDEBAR RESOURCES */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-gray-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-500" />
              Resources
            </h3>
            <div className="space-y-3">
              {data.resources?.map((res) => (
                <button 
                  key={res.name}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-blue-500 group transition-all"
                >
                  <div className="flex items-center gap-3 text-left">
                    <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate w-32">{res.name}</p>
                      <p className="text-[10px] text-gray-400">{res.size}</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <CheckCircle className="w-10 h-10 mb-4 text-blue-200" />
              <h3 className="text-xl font-bold mb-2">Topic Quiz</h3>
              <p className="text-blue-100 text-sm mb-6">Test your knowledge of {data.title} before moving on.</p>
              <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-black text-sm hover:bg-blue-50 transition-colors">
                Start Quiz
              </button>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          </div>
        </aside>

      </div>
    </div>
  );
}