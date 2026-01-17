// src/app/exams/[examSlug]/[courseSlug]/[subjectSlug]/[chapterSlug]/page.tsx
"use client";

import { useState,use } from "react";
import Link from "next/link";
import { 
  PlayCircle, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Download, 
  MessageSquare,
  Clock
} from "lucide-react";

// Dummy Data for the specific chapter
const getChapterDetails = (slug: string) => ({
  title: slug.replace(/-/g, " ").toUpperCase(),
  duration: "1h 45m",
  totalTopics: 5,
  topics: [
    { id: "t1", title: "Introduction to the Concept", type: "video", duration: "12:00", isCompleted: true },
    { id: "t2", title: "Deep Dive: Core Principles", type: "video", duration: "45:00", isCompleted: true },
    { id: "t3", title: "Practical Workbook", type: "document", duration: "15 min read", isCompleted: false },
    { id: "t4", title: "Industry Use Cases", type: "video", duration: "22:00", isCompleted: false },
    { id: "t5", title: "Chapter Quiz", type: "quiz", duration: "10 questions", isCompleted: false },
  ]
});

export default function ChapterPage({ params }: { params: Promise<{ chapterSlug: string }> }) {
  // 2. Unwrap the params promise using React.use()
  const resolvedParams = use(params); 
  
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const data = getChapterDetails(resolvedParams.chapterSlug || "chapter-1");
  const activeTopic = data.topics[activeTopicIndex];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-white dark:bg-slate-950">
      
      {/* LEFT SIDE: Content Player Area */}
      <main className="flex-1 overflow-y-auto border-r border-gray-100 dark:border-slate-900">
        {/* Breadcrumb Navigation for Chapter */}
        <div className="p-4 border-b border-gray-50 dark:border-slate-900 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
          <Link 
            href=".." 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Subject
          </Link>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Topic {activeTopicIndex + 1} of {data.totalTopics}
          </div>
        </div>

        {/* Dynamic Content Display */}
        <div className="p-6 lg:p-10 max-w-4xl mx-auto">
          {activeTopic.type === "video" ? (
            <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center group cursor-pointer relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <PlayCircle className="w-20 h-20 text-white/80 group-hover:text-blue-500 transition-all transform group-hover:scale-110" />
              <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm font-medium">Click to Play Lecture</p>
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full bg-blue-50 dark:bg-blue-900/10 rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-800 flex flex-col items-center justify-center p-10 text-center">
              <FileText className="w-16 h-16 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold dark:text-white">Reading Material & Resources</h3>
              <p className="text-gray-500 max-w-xs mt-2">This topic contains PDF notes and interactive worksheets.</p>
              <button className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                <Download className="w-4 h-4" /> Download Notes
              </button>
            </div>
          )}

          {/* Title & Actions */}
          <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {activeTopic.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activeTopic.duration}</span>
                <span className="flex items-center gap-1 uppercase tracking-tighter bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">{activeTopic.type}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="p-3 rounded-xl border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>
               <button className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  <CheckCircle className="w-5 h-5" /> Mark as Done
               </button>
            </div>
          </div>

          <div className="mt-10 prose dark:prose-invert max-w-none">
            <h4 className="text-lg font-bold">About this Lesson</h4>
            <p className="text-gray-600 dark:text-gray-400">
              In this session, we explore the core mechanics of {data.title}. We will cover the practical implementation, 
              common pitfalls, and how this relates to the overall syllabus. Ensure you have your workbook ready.
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-gray-100 dark:border-slate-900 p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button 
              disabled={activeTopicIndex === 0}
              onClick={() => setActiveTopicIndex(prev => prev - 1)}
              className="flex items-center gap-2 font-bold text-gray-400 disabled:opacity-30 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <button 
              disabled={activeTopicIndex === data.topics.length - 1}
              onClick={() => setActiveTopicIndex(prev => prev + 1)}
              className="flex items-center gap-2 font-bold text-blue-600 disabled:opacity-30 hover:gap-3 transition-all"
            >
              Next Lesson <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* RIGHT SIDE: Topic Playlist Sidebar */}
      <aside className="w-full lg:w-80 xl:w-96 bg-gray-50/50 dark:bg-slate-900/30 overflow-y-auto">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">Chapter Content</h2>
          <div className="mt-2 w-full bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-[40%] transition-all duration-500" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">40% Completed</p>
        </div>

        <nav>
          {data.topics.map((topic, index) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopicIndex(index)}
              className={`w-full flex items-start gap-4 p-5 text-left border-b border-gray-100 dark:border-slate-800/50 transition-all ${
                activeTopicIndex === index 
                  ? "bg-white dark:bg-slate-800 shadow-sm z-10" 
                  : "hover:bg-gray-100/50 dark:hover:bg-slate-800/30"
              }`}
            >
              <div className="mt-1">
                {topic.isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 ${activeTopicIndex === index ? 'border-blue-600' : 'border-gray-300 dark:border-slate-700'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${activeTopicIndex === index ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                  {topic.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{topic.type}</span>
                  <span className="text-[10px] text-gray-300">•</span>
                  <span className="text-[10px] font-bold text-gray-400">{topic.duration}</span>
                </div>
              </div>
              {activeTopicIndex === index && (
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
              )}
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
}