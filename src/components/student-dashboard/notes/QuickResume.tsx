import React from 'react';
import Link from 'next/link';
import { Sparkles, Clock, ChevronRight } from 'lucide-react';

export interface QuickResumeData {
  topicId: string;
  topicName: string;
  chapterName: string;
  subjectName: string;
  progress: number;
  lastAccessed: string;
}

interface QuickResumeProps {
  data: QuickResumeData;
}

export const QuickResume = ({ data }: QuickResumeProps) => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500 dark:text-yellow-400 fill-yellow-400/20" />
        Continue Learning
      </h2>
      <Link href="#" className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-medium">View History</Link>
    </div>

    <Link href={`/dashboard/notes/${data.subjectName.toLowerCase()}/${data.chapterName.toLowerCase()}/${data.topicId}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 hover:border-cyan-500/30 transition-all cursor-pointer active:scale-[0.99] shadow-sm dark:shadow-none">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-slate-50/50 dark:bg-slate-950/50 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">{data.subjectName}</span>
                <span className="text-slate-400 dark:text-slate-500">&bull;</span>
                <span className="text-slate-500 dark:text-slate-400">{data.chapterName}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{data.topicName}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Last read {data.lastAccessed}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all text-slate-600 dark:text-slate-400">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500 dark:text-slate-400">Progress</span>
              <span className="text-slate-900 dark:text-white">{data.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${data.progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  </section>
);