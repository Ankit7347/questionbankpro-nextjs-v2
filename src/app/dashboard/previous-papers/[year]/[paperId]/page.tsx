// /home/ankit/Desktop/September/new-questionbank/questionbankpro-dev/src/app/dashboard/previous-papers/[year]/[paperId]/page.tsx

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Download, Printer, Bookmark, FileText, Eye, CheckCircle } from 'lucide-react';

// --- Interfaces ---

interface PageProps {
  params: {
    year: string;
    paperId: string;
  };
}

// --- Mock Data ---

const paperDetails = {
  title: 'Advanced Mathematics - Final Exam',
  subjectCode: 'MAT401',
  duration: '3 Hours',
  totalMarks: 100,
  difficulty: 'Hard',
  pages: 4,
  hasSolution: true,
};

export default function PaperDetailPage({ params }: PageProps) {
  const { year, paperId } = params;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      {/* --- Top Bar --- */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href={`/dashboard/previous-papers/${year}`}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">{paperDetails.title}</h1>
            <p className="text-xs text-slate-400 font-mono">{paperDetails.subjectCode} • {year}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all active:scale-95 shadow-lg shadow-blue-900/20">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* --- Main Content (PDF Viewer Placeholder) --- */}
        <main className="flex-1 bg-slate-950 p-4 lg:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          <div className="max-w-4xl mx-auto bg-white min-h-[800px] rounded shadow-2xl flex items-center justify-center relative group">
            <div className="text-center p-8">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">PDF Preview Placeholder</p>
              <p className="text-sm text-slate-300 mt-2">Paper ID: {paperId}</p>
            </div>
            
            {/* Overlay for interaction */}
            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                <Eye className="w-5 h-5" />
                View Full Screen
              </button>
            </div>
          </div>
        </main>

        {/* --- Sidebar (Metadata) --- */}
        <aside className="w-full lg:w-80 bg-slate-900/40 border-l border-slate-800 p-6 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Paper Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-slate-800/50">
                <span className="text-slate-400">Duration</span>
                <span className="text-white font-medium">{paperDetails.duration}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/50">
                <span className="text-slate-400">Total Marks</span>
                <span className="text-white font-medium">{paperDetails.totalMarks}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/50">
                <span className="text-slate-400">Pages</span>
                <span className="text-white font-medium">{paperDetails.pages}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/50">
                <span className="text-slate-400">Difficulty</span>
                <span className={`font-medium px-2 py-0.5 rounded text-xs ${
                  paperDetails.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                }`}>
                  {paperDetails.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50">
                <span className="flex items-center gap-2 text-slate-300">
                  <Bookmark className="w-4 h-4" />
                  Bookmark
                </span>
              </button>
              {paperDetails.hasSolution && (
                <button className="w-full flex items-center justify-between p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20 group">
                  <span className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    View Solution
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Available</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Related Papers</h2>
            <div className="space-y-3">
              {[2023, 2022].map(y => (
                <Link 
                  key={y}
                  href={`/dashboard/previous-papers/${y}/${paperId}`}
                  className="block p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-medium">{paperDetails.subjectCode}</span>
                    <span className="text-xs text-slate-500">{y}</span>
                  </div>
                  <p className="text-xs text-slate-400">Summer Session</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}