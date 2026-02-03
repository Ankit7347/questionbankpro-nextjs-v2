// /home/ankit/Desktop/September/new-questionbank/questionbankpro-dev/src/app/dashboard/previous-papers/page.tsx

import React from 'react';
import Link from 'next/link';
import { Search, FileText, Calendar, Clock, Download, Filter } from 'lucide-react';

// --- Interfaces ---

interface YearData {
  year: string;
  paperCount: number;
  isActive: boolean;
}

interface RecentPaper {
  id: string;
  subject: string;
  code: string;
  year: string;
  session: string;
  dateAdded: string;
}

// --- Mock Data (Replace with API fetch in production) ---

const stats = {
  totalPapers: 1250,
  totalDownloads: 45000,
  activeYears: 12,
};

const years: YearData[] = [
  { year: '2024', paperCount: 45, isActive: true },
  { year: '2023', paperCount: 120, isActive: true },
  { year: '2022', paperCount: 115, isActive: true },
  { year: '2021', paperCount: 98, isActive: true },
  { year: '2020', paperCount: 85, isActive: true },
  { year: '2019', paperCount: 90, isActive: true },
];

const recentPapers: RecentPaper[] = [
  { id: 'p1', subject: 'Advanced Mathematics', code: 'MAT401', year: '2024', session: 'Summer', dateAdded: '2 days ago' },
  { id: 'p2', subject: 'Data Structures', code: 'CS302', year: '2024', session: 'Summer', dateAdded: '3 days ago' },
  { id: 'p3', subject: 'Digital Logic', code: 'EE205', year: '2023', session: 'Winter', dateAdded: '5 days ago' },
  { id: 'p4', subject: 'Physics II', code: 'PHY102', year: '2023', session: 'Winter', dateAdded: '1 week ago' },
];

export default function PreviousPapersPage() {
  return (
    <div className="bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      {/* --- Header & Stats --- */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-500" />
              Previous Papers Archive
            </h1>
            <p className="text-slate-400">
              Access past examination papers, marking schemes, and resources.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center gap-3 min-h-[80px]">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Total Papers</p>
                <p className="text-xl font-bold text-white">{stats.totalPapers}</p>
              </div>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center gap-3 min-h-[80px]">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Download className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Downloads</p>
                <p className="text-xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-3 border border-slate-800 rounded-xl leading-5 bg-slate-900/60 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all h-12"
            placeholder="Search by subject code (e.g., CS101) or keyword..."
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
             <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
                <Filter className="h-5 w-5 text-slate-500" />
             </button>
          </div>
        </div>
      </header>

      {/* --- Recently Added Section --- */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Recently Added
          </h2>
          <Link href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors min-h-[48px] flex items-center">
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {recentPapers.map((paper) => (
            <div
              key={paper.id}
              className="min-w-[280px] bg-slate-900/40 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all group cursor-pointer active:scale-95"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md font-mono">
                  {paper.code}
                </span>
                <span className="text-xs text-slate-500">{paper.dateAdded}</span>
              </div>
              <h3 className="text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">
                {paper.subject}
              </h3>
              <p className="text-sm text-slate-400">
                {paper.year} • {paper.session}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Year Selection Grid --- */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          Browse by Year
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {years.map((item) => (
            <Link
              href={`/dashboard/previous-papers/${item.year}`}
              key={item.year}
              className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-slate-800/50 hover:border-blue-500/30 transition-all active:scale-95 group min-h-[140px]"
            >
              <span className="text-3xl font-bold text-slate-200 group-hover:text-white mb-2">
                {item.year}
              </span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
                {item.paperCount} Papers
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}