import React from 'react';
import { BookOpen, Flame, Search } from 'lucide-react';

export const NotesHeader = () => (
  <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#0B0F17]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
    <div className="w-full px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <BookOpen className="w-6 h-6 text-cyan-600 dark:text-cyan-400 fill-cyan-400/20" />
            Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Welcome back, Architect.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400">
            <Flame className="w-4 h-4 fill-orange-500/20" />
            <span className="text-xs font-bold">12</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-px">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-700 dark:text-white">AS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
        <div className="relative flex items-center bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3" />
          <input
            type="text"
            placeholder="Search for notes, topics, or tags..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:outline-none"
          />
          <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">⌘K</span>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {['All', 'Favorites', 'Recent', 'Physics', 'Chemistry', 'Maths', 'Biology', 'CS'].map((tag, i) => (
          <button key={tag} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap ${i === 0 ? 'bg-cyan-500 text-white border-cyan-600' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-500/30'}`}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  </header>
);