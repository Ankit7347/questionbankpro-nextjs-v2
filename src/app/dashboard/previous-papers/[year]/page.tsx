// /home/ankit/Desktop/September/new-questionbank/questionbankpro-dev/src/app/dashboard/previous-papers/[year]/page.tsx

import React from 'react';
import Link from 'next/link';
import { Search, Download, BookOpen, ChevronLeft, Filter, Calendar } from 'lucide-react';

// --- Interfaces ---

interface SubjectPaper {
  id: string;
  subjectName: string;
  subjectCode: string;
  session: 'Summer' | 'Winter';
  type: 'Mid-term' | 'Finals';
  downloadCount: number;
}

interface PageProps {
  params: {
    year: string;
  };
}

// --- Mock Data (Replace with API fetch) ---

const mockPapers: SubjectPaper[] = [
  { id: 'p1', subjectName: 'Advanced Mathematics', subjectCode: 'MAT401', session: 'Summer', type: 'Finals', downloadCount: 120 },
  { id: 'p2', subjectName: 'Data Structures', subjectCode: 'CS302', session: 'Summer', type: 'Finals', downloadCount: 340 },
  { id: 'p3', subjectName: 'Digital Logic', subjectCode: 'EE205', session: 'Winter', type: 'Finals', downloadCount: 89 },
  { id: 'p4', subjectName: 'Physics II', subjectCode: 'PHY102', session: 'Winter', type: 'Mid-term', downloadCount: 56 },
  { id: 'p5', subjectName: 'Software Engineering', subjectCode: 'CS405', session: 'Summer', type: 'Mid-term', downloadCount: 210 },
];

export default function YearSelectionPage({ params }: PageProps) {
  const { year } = params;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      {/* --- Header & Navigation --- */}
      <header className="mb-8">
        <Link 
          href="/dashboard/previous-papers" 
          className="inline-flex items-center text-slate-400 hover:text-blue-400 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Archives
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              Academic Year {year}
            </h1>
            <p className="text-slate-400">
              Browse examination papers and resources for the {year} sessions.
            </p>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20">
            <Download className="w-5 h-5" />
            Download Year Bundle
          </button>
        </div>
      </header>

      {/* --- Filters & Search --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search subjects (e.g., Data Structures)..." 
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['All Sessions', 'Summer', 'Winter'].map((tab, idx) => (
            <button 
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                idx === 0 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                  : 'bg-slate-900/40 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- Subject List --- */}
      <div className="grid gap-4">
        {mockPapers.map((paper) => (
          <Link 
            href={`/dashboard/previous-papers/${year}/${paper.id}`}
            key={paper.id}
            className="group bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 hover:bg-slate-900/60 transition-all active:scale-[0.99]"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {paper.subjectName}
                  </h3>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700 font-mono">
                    {paper.subjectCode}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${paper.session === 'Summer' ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
                    {paper.session}
                  </span>
                  <span>•</span>
                  <span>{paper.type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 pl-14 md:pl-0">
              <div className="text-right hidden md:block">
                <p className="text-xs text-slate-500 uppercase font-semibold">Downloads</p>
                <p className="text-white font-medium">{paper.downloadCount}</p>
              </div>
              <div className="p-2 rounded-full bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Download className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}