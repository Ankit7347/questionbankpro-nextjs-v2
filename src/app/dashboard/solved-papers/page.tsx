// src/app/dashboard/solved-papers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Calendar, Clock, Download, Filter } from 'lucide-react';
import {
  getSolvedPapersStats,
  getRecentSolvedPapers,
  getYearsList,
} from '@/services/client/solvedPaper.client';
import {
  SolvedPapersStatsUIDTO,
  RecentSolvedPaperUIDTO,
  YearDataUIDTO,
} from '@/dto/solvedPaper.ui.dto';

export default function SolvedPapersPage() {
  const [stats, setStats] = useState<SolvedPapersStatsUIDTO | null>(null);
  const [recentPapers, setRecentPapers] = useState<RecentSolvedPaperUIDTO[]>([]);
  const [years, setYears] = useState<YearDataUIDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, recentData, yearsData] = await Promise.all([
          getSolvedPapersStats(),
          getRecentSolvedPapers(4),
          getYearsList(),
        ]);

        setStats(statsData);
        setRecentPapers(recentData);
        setYears(yearsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-foreground p-4 md:p-8 font-sans max-w-7xl mx-auto">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-foreground p-4 md:p-8 font-sans max-w-7xl mx-auto">
        <div className="text-center py-12 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="text-foreground p-4 md:p-8 font-sans max-w-7xl mx-auto">
      {/* --- Header & Stats --- */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-cyan-500" />
              Solved Papers Archive
            </h1>
            <p className="text-slate-400">
              Access step-by-step solutions with detailed explanations for exam papers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <div className="w-full sm:w-auto bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 flex items-center gap-3 min-h-16 shadow-sm hover:shadow-md transition">
              <div className="p-2 bg-cyan-500/10 rounded-md">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Papers</p>
                <p className="text-xl font-bold text-foreground">{stats?.totalPapers || 0}</p>
              </div>
            </div>
            <div className="w-full sm:w-auto bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 flex items-center gap-3 min-h-16 shadow-sm hover:shadow-md transition">
              <div className="p-2 bg-emerald-500/10 rounded-md">
                <Download className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Downloads</p>
                <p className="text-xl font-bold text-foreground">{(stats?.totalDownloads || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative w-full md:max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all h-12"
            placeholder="Search by subject code or keyword..."
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
             <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors h-10 w-10 flex items-center justify-center">
                <Filter className="h-5 w-5 text-slate-500" />
             </button>
          </div>
        </div>
      </header>

      {/* --- Recently Added Section --- */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Recently Added
          </h2>
          <Link href="#" className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors h-12 flex items-center">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {recentPapers.map((paper) => (
            <div
              key={paper.id}
              className="w-full sm:w-72 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-cyan-500 transition-all group cursor-pointer active:scale-95 shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-md font-mono">
                  {paper.code}
                </span>
                <span className="text-xs text-muted-foreground">{paper.dateAdded}</span>
              </div>
              <h3 className="text-gray-900 dark:text-white font-medium mb-1 group-hover:text-cyan-500 transition-colors">
                {paper.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {paper.year} • {paper.session}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Year Selection Grid --- */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          Browse by Year
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {years.map((item) => (
            <Link
              href={`/dashboard/solved-papers/${item.year}`}
              key={item.year}
              className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-cyan-500/30 transition-all active:scale-95 group min-h-28"
            >
              <span className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-cyan-500 mb-2">
                {item.year}
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-200 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                {item.paperCount} Papers
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
