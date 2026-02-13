import React from 'react';
import { BrainCircuit, Zap, Calculator, FileText, Bookmark } from 'lucide-react';

export const StudyTools = () => (
  <section>
    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <BrainCircuit className="w-5 h-5 text-purple-500" />
      Study Tools
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { name: 'Flashcards', icon: <Zap className="w-4 h-4" />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { name: 'Formulas', icon: <Calculator className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Summaries', icon: <FileText className="w-4 h-4" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Saved', icon: <Bookmark className="w-4 h-4" />, color: 'text-pink-500', bg: 'bg-pink-500/10' },
      ].map((tool) => (
        <button key={tool.name} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm dark:shadow-none active:scale-95">
          <div className={`p-2 rounded-lg ${tool.bg} ${tool.color}`}>
            {tool.icon}
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tool.name}</span>
        </button>
      ))}
    </div>
  </section>
);