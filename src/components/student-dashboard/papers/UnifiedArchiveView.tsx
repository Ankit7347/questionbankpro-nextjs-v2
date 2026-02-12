// src/components/student-dashboard/papers/UnifiedArchiveView.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, FileText, Calendar, Clock, Download, 
  X, Star, Eye, ChevronRight, BookOpen, Zap 
} from 'lucide-react';

// --- Interfaces ---

interface PaperItem {
  id: string;
  title?: string;
  subject?: string;
  code: string;
  year: string | number;
  session: string;
  dateAdded: string;
}

interface Stats {
  totalPapers: number;
  totalViews?: number;
  totalDownloads?: number;
}

interface YearItem {
  year: string | number;
  paperCount: number;
}

interface UnifiedArchiveProps {
  mode: 'previous' | 'solved';
  stats: Stats;
  recentPapers: PaperItem[];
  years: YearItem[];
  onSearch: (query: string) => Promise<PaperItem[]>;
}

export default function UnifiedArchiveView({ 
  mode, 
  stats, 
  recentPapers, 
  years, 
  onSearch 
}: UnifiedArchiveProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PaperItem[]>([]);
  const [loading, setLoading] = useState(false);

  const isSolved = mode === 'solved';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setIsSearching(true);
    try {
      const results = await onSearch(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="text-slate-900 dark:text-slate-100 p-3 md:p-8 font-sans max-w-7xl mx-auto space-y-6 md:space-y-10 selection:bg-blue-500/30">
      
      {/* --- Header & Stats --- */}
      <header className="space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight flex items-center gap-2">
              {isSolved ? (
                <BookOpen className="text-amber-500 w-6 h-6 md:w-10 md:h-10" />
              ) : (
                <FileText className="text-blue-500 w-6 h-6 md:w-10 md:h-10" />
              )}
              {isSolved ? "Solved Papers" : "Question Bank"}
            </h1>
            <p className="text-[11px] md:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {isSolved ? "Expert solutions & step-by-step breakdowns." : "Official PDFs and digital question sets."}
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
            <StatCard 
              label="Total" 
              value={stats.totalPapers} 
              color={isSolved ? "text-amber-500" : "text-blue-500"}
              bgColor={isSolved ? "bg-amber-500/10" : "bg-blue-500/10"} 
            />
            <StatCard 
              label={isSolved ? "Views" : "Downloads"} 
              value={isSolved ? (stats.totalViews || 0) : (stats.totalDownloads || 0)} 
              color="text-emerald-500"
              bgColor="bg-emerald-500/10" 
            />
          </div>
        </div>

        {/* --- Search Bar --- */}
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code or subject..."
            className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 h-12 transition-all"
          />
          {isSearching && (
            <button 
              type="button" 
              onClick={clearSearch} 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </form>
      </header>

      <main className="space-y-8">
        {isSearching ? (
          /* --- Search Results View --- */
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Search Results</h2>
              <button onClick={clearSearch} className="text-xs font-bold text-blue-500">Back to Archive</button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-2xl" />)}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(paper => <PaperCard key={paper.id} paper={paper} mode={mode} />)}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No results for "{searchQuery}"</p>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* --- Recently Added Section --- */}
            <section className="space-y-4">
              <h2 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-500">
                <Clock className="w-4 h-4 text-amber-500" /> Recently Added
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-3 px-3">
                {recentPapers.map(paper => (
                  <div key={paper.id} className="min-w-[260px] md:min-w-[320px]">
                    <PaperCard paper={paper} mode={mode} />
                  </div>
                ))}
              </div>
            </section>

            {/* --- Year Grid Section --- */}
            <section className="space-y-4">
              <h2 className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-500">
                <Calendar className="w-4 h-4 text-purple-500" /> Browse by Year
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {years.map((item) => (
                  <Link
                    href={`/dashboard/${mode}-papers/${item.year}`}
                    key={item.year}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center active:scale-95 hover:border-blue-500/50 transition-all"
                  >
                    <span className="text-xl md:text-2xl font-black">{item.year}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{item.paperCount} Items</span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

// --- Internal Helper: Stat Card ---
function StatCard({ label, value, color, bgColor }: { label: string, value: number, color: string, bgColor: string }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 min-w-[140px]">
      <div className={`p-2 rounded-lg ${bgColor} ${color}`}>
        <Zap className="w-4 h-4 fill-current" />
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-500 uppercase leading-none mb-1">{label}</p>
        <p className="text-sm font-bold truncate leading-none">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

// --- Internal Helper: Paper Card ---
function PaperCard({ paper, mode }: { paper: PaperItem, mode: 'previous' | 'solved' }) {
  const isSolved = mode === 'solved';
  return (
    <Link 
      href={`/dashboard/${mode}-papers/${paper.year}/${paper.id}`}
      className="block p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500/50 active:scale-[0.98] transition-all h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[8px] font-black rounded text-slate-500 border border-slate-200 dark:border-slate-700 uppercase">
          {paper.code}
        </span>
        <span className="text-[9px] text-slate-400 font-bold">{paper.dateAdded}</span>
      </div>
      
      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1 leading-tight">
        {paper.title || paper.subject}
      </h3>
      
      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
        <span>{paper.year}</span>
        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="truncate">{paper.session}</span>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isSolved ? 'bg-amber-500' : 'bg-blue-500'}`} />
          <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">
            {isSolved ? 'Verified Solution' : 'Question Bank'}
          </span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
      </div>
    </Link>
  );
}