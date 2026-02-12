// src/components/student-dashboard/papers/YearPaperList.tsx
"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Search, 
  Layers, 
  ArrowRight, 
  FileText, 
  Star, 
  Clock, 
  Zap,
  TrendingUp 
} from 'lucide-react';

interface PaperItem {
  id: string;
  title: string;
  subjectCode: string;
  session: string; 
  difficulty: string;
  isVerified: boolean;
  views: number;
}

interface YearPaperListProps {
  year: string;
  papers: PaperItem[];
  mode: 'previous' | 'solved';
}

export default function YearPaperList({ year, papers, mode }: YearPaperListProps) {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const isSolved = mode === 'solved';
  const accentColor = isSolved ? 'text-amber-500' : 'text-blue-500';
  const accentBg = isSolved ? 'bg-amber-500/10' : 'bg-blue-500/10';

  // Grouping logic for sessions
  const sessions = useMemo(() => {
    const groups: Record<string, PaperItem[]> = {};
    papers.forEach(p => {
      if (!groups[p.session]) groups[p.session] = [];
      groups[p.session].push(p);
    });
    return groups;
  }, [papers]);

  const sessionNames = Object.keys(sessions);
  const currentSession = activeSession || sessionNames[0] || "";

  // Filter logic
  const filteredPapers = useMemo(() => {
    return sessions[currentSession]?.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.subjectCode.toLowerCase().includes(search.toLowerCase())
    ) || [];
  }, [currentSession, search, sessions]);

  return (
    <div className="text-slate-900 dark:text-slate-100 selection:bg-blue-500/30">
      {/* --- Sticky Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <Link href={`/dashboard/${mode}-papers`} className="flex items-center gap-2 group p-1">
          <ChevronLeft className="w-5 h-5 text-slate-500 group-hover:text-blue-500 transition-colors" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Back</span>
        </Link>
        <div className="text-[10px] font-black px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
          Batch {year}
        </div>
      </nav>

      <main className="max-w-8xl mx-auto px-4 py-6">
        {/* --- Header --- */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-2">
             <Zap className={`w-4 h-4 ${accentColor} fill-current`} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Archive</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-2">
            {isSolved ? "Verified Solutions" : "Question Bank"}
          </h1>
          <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Select a session card below to view specific subjects for this academic year.
          </p>
        </header>

        {/* --- STEP 1: Session Horizontal Scroll --- */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 mb-6">
          {sessionNames.map(session => (
            <button
              key={session}
              onClick={() => setActiveSession(session)}
              className={`flex-shrink-0 p-4 w-36 rounded-2xl border transition-all text-left relative overflow-hidden ${
                currentSession === session 
                ? 'border-blue-500 bg-white dark:bg-slate-900 shadow-lg shadow-blue-500/10' 
                : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30'
              } active:scale-95`}
            >
              <Layers className={`w-4 h-4 mb-4 ${currentSession === session ? 'text-blue-500' : 'text-slate-400'}`} />
              <h3 className="text-xs font-bold leading-tight truncate">{session}</h3>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{sessions[session].length} Items</p>
            </button>
          ))}
        </div>

        {/* --- STEP 2: Search & List --- */}
        <div className="space-y-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              placeholder="Quick search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {filteredPapers.map(paper => (
              <Link 
                href={`/dashboard/${mode}-papers/${year}/${paper.id}`}
                key={paper.id}
                className="group p-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between hover:border-blue-500/50 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`flex-shrink-0 p-2.5 rounded-lg transition-colors ${accentBg}`}>
                    {isSolved ? <Star className="w-4 h-4 text-amber-500" /> : <FileText className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-xs truncate group-hover:text-blue-500 transition-colors">
                      {paper.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded uppercase tracking-tighter">
                        {paper.subjectCode}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold whitespace-nowrap">
                        <Clock className="w-2.5 h-2.5" />
                        {paper.difficulty}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-2 p-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>

          {filteredPapers.length === 0 && (
            <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/30 dark:bg-slate-900/20">
              <TrendingUp className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No results found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}