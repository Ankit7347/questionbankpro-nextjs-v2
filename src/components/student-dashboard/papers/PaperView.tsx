// src/components/student-dashboard/papers/PaperView.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, Download, Printer, Bookmark, FileText, 
  Eye, CheckCircle, Play, Lock, Info, Star, Share2 
} from 'lucide-react';

interface PaperViewProps {
  paper: any; // Use your Mongoose types here
  solution?: any;
  mode: 'previous' | 'solved';
  year: string;
}

export default function PaperView({ paper, solution, mode, year }: PaperViewProps) {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  
  const isSolved = mode === 'solved';
  const displayTitle = paper.title[lang] || paper.title['en'];

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen flex flex-col font-sans">
      {/* --- Header Bar --- */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href={`/dashboard/previous-papers/${year}`}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm md:text-lg font-bold text-white leading-tight">
              {isSolved ? `Solution: ${displayTitle}` : displayTitle}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              {paper.paperCode} • {year} • {paper.session || 'Annual'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex bg-slate-800 rounded-lg p-1 mr-2">
            <button 
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >EN</button>
            <button 
              onClick={() => setLang('hi')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${lang === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >HI</button>
          </div>
          
          <button className="hidden sm:flex p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          
          {paper.paperUrl && (
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-900/20">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* --- Main Content Area --- */}
        <main className="flex-1 bg-slate-950 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* 1. PDF Section (If ContentType is PDF or BOTH) */}
            {(paper.contentType === 'PDF' || paper.contentType === 'BOTH') && paper.paperUrl && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-3 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Original Paper PDF</span>
                  <Link href={paper.paperUrl} target="_blank" className="text-blue-400 text-xs hover:underline flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Full Screen
                  </Link>
                </div>
                <div className="aspect-[3/4] bg-slate-800 flex items-center justify-center">
                  <iframe src={`${paper.paperUrl}#toolbar=0`} className="w-full h-full" />
                </div>
              </div>
            )}

            {/* 2. Digital Questions Section (If ContentType is DIGITAL or BOTH) */}
            {(paper.contentType === 'DIGITAL' || paper.contentType === 'BOTH') && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" /> Digital Question Bank
                </h3>
                {paper.questions?.map((q: any, idx: number) => (
                  <div key={q._id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                    <div className="flex justify-between mb-3">
                      <span className="text-blue-500 font-bold">Q{idx + 1}</span>
                      <span className="text-xs text-slate-500">{q.marks} Marks</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed mb-4">{q.content[lang] || q.content['en']}</p>
                    
                    {/* If Solution is present, show small toggle or link */}
                    {isSolved && solution && (
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <span className="text-xs font-bold text-emerald-500 uppercase">Expert Explanation</span>
                        <p className="mt-2 text-slate-400 text-sm italic">
                          {q.explanation?.[lang] || "Check full solution below."}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 3. Expert Solution Section (Only in Solved Mode) */}
            {isSolved && solution && (
              <div className="mt-10 space-y-6 border-t border-slate-800 pt-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-500" /> Comprehensive Solution
                  </h2>
                  {solution.videoSolutionUrl && (
                    <Link 
                      href={solution.videoSolutionUrl} 
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-full text-white font-bold"
                    >
                      <Play className="w-4 h-4 fill-current" /> Watch Video Solution
                    </Link>
                  )}
                </div>

                <div className="bg-slate-900 border-2 border-emerald-500/20 rounded-2xl p-6 md:p-10 prose prose-invert max-w-none">
                  {solution.isPremium && !paper.isUserPremium ? (
                    <div className="text-center py-10">
                      <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold">Premium Content</h3>
                      <p className="text-slate-400 mt-2">Upgrade your plan to unlock full step-by-step solutions.</p>
                      <button className="mt-6 bg-amber-500 text-black px-8 py-3 rounded-xl font-black">Unlock Now</button>
                    </div>
                  ) : (
                    <div className="text-slate-200 text-lg leading-loose">
                       {solution.fullExplanation?.[lang] || solution.fullExplanation?.['en']}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* --- Sidebar --- */}
        <aside className="w-full lg:w-80 bg-slate-900/40 border-l border-slate-800 p-6 space-y-8">
          <div>
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Exam Info</h2>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
               <InfoCard label="Difficulty" value={paper.difficulty} color={paper.difficulty === 'Hard' ? 'text-red-400' : 'text-emerald-400'} />
               <InfoCard label="Quality" value={isSolved ? solution.solutionQuality : (paper.isVerified ? 'Verified' : 'Unverified')} />
               <InfoCard label="Year" value={year} />
            </div>
          </div>

          {!isSolved && paper.hasSolution && (
            <Link 
              href={`/dashboard/solved-papers/${year}/${paper._id}`}
              className="block w-full text-center p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-all"
            >
              View Solved Version
            </Link>
          )}

          <div>
             <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Paper Analytics</h2>
             <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Total Views</span><span className="text-white">{paper.views}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Downloads</span><span className="text-white">{paper.downloads}</span></div>
                {isSolved && (
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Solution Likes</span><span className="text-emerald-400 font-bold">{solution.totalLikes} ❤️</span></div>
                )}
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoCard({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) {
  return (
    <div className="bg-slate-800/30 border border-slate-800 p-3 rounded-lg">
      <p className="text-[10px] uppercase font-bold text-slate-500">{label}</p>
      <p className={`text-sm font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}