import React from 'react';
import { Library, Clock, Trophy } from 'lucide-react';

interface NotesStatsProps {
  totalNotes: number;
}

export const NotesStats = ({ totalNotes }: NotesStatsProps) => (
  <section className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
    <div className="min-w-36 flex-1 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col gap-2">
      <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400"><Library className="w-5 h-5" /></div>
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalNotes}</div>
        <div className="text-xs text-slate-500">Total Notes</div>
      </div>
    </div>
    <div className="min-w-36 flex-1 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col gap-2">
      <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-500 dark:text-purple-400"><Clock className="w-5 h-5" /></div>
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">12.5h</div>
        <div className="text-xs text-slate-500">Study Time</div>
      </div>
    </div>
    <div className="min-w-36 flex-1 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col gap-2">
      <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"><Trophy className="w-5 h-5" /></div>
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">85%</div>
        <div className="text-xs text-slate-500">Avg. Score</div>
      </div>
    </div>
  </section>
);