import React from 'react';
import Link from 'next/link';
import { MoreVertical, TrendingUp, ChevronRight } from 'lucide-react';

export interface Subject {
  id: string;
  name: string;
  icon: React.ReactNode;
  totalNotes: number;
  progress: number;
  color: string;
  bg: string;
  border: string;
  gradient: string;
}

interface SubjectGridProps {
  subjects: Subject[];
}

export const SubjectGrid = ({ subjects }: SubjectGridProps) => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Subjects</h2>
      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
        <MoreVertical className="w-5 h-5 text-slate-400" />
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subjects.map((subject) => (
        <Link key={subject.id} href={`/dashboard/notes/${subject.id}`}>
          <div className="group relative h-full">
            <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative h-full rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700/50 transition-all cursor-pointer flex flex-col justify-between backdrop-blur-sm active:scale-[0.99] shadow-sm dark:shadow-none">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border ${subject.border || 'border-slate-200 dark:border-slate-800'} ${subject.color} shadow-sm`}>
                  {subject.icon}
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-950/50 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800/50">
                  <TrendingUp className="w-3 h-3" />
                  <span>{subject.progress}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{subject.name}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>{subject.totalNotes} Notes</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-cyan-500/0 group-hover:text-cyan-500 flex items-center gap-1">
                    Open <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-1">
                  <div className={`h-full rounded-full ${subject.color.replace('text-', 'bg-')} opacity-50`} style={{ width: `${subject.progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
);