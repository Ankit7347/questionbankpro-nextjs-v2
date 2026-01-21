// File Path: src/components/exams/assessment/ResultView.tsx
"use client";

import React, { useState } from "react";
import { 
  Check, X, RotateCcw, Target, ListFilter, 
  Trophy, AlertCircle, HelpCircle, ChevronRight 
} from "lucide-react";

interface ResultViewProps {
  allQs: any[];
  answers: { [key: string]: number };
  examName?: string;
}

export const ResultView = ({ allQs, answers, examName }: ResultViewProps) => {
  const [filter, setFilter] = useState<"all" | "correct" | "wrong" | "skipped">("all");

  // --- Logic Calculations ---
  const totalQs = allQs.length;
  const attemptedCount = Object.keys(answers).length;
  const skippedCount = totalQs - attemptedCount;
  
  const correctCount = allQs.filter(q => answers[`${q.sessionId}-${q.id}`] === q.correct).length;
  const wrongCount = attemptedCount - correctCount;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
  const totalScorePercentage = Math.round((correctCount / totalQs) * 100);

  // --- Filter Logic ---
  const filteredQs = allQs.filter(q => {
    const uAns = answers[`${q.sessionId}-${q.id}`];
    if (filter === "correct") return uAns === q.correct;
    if (filter === "wrong") return uAns !== undefined && uAns !== q.correct;
    if (filter === "skipped") return uAns === undefined;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-700">
      
      {/* 1. HERO SCORE SECTION */}
      
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row items-center gap-12">
        
        {/* Radial Progress */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
              strokeDasharray={553} 
              strokeDashoffset={553 - (553 * totalScorePercentage) / 100} 
              className="text-indigo-600 transition-all duration-1000 ease-out" 
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black dark:text-white">{correctCount}</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Out of {totalQs}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
            <Trophy className="w-5 h-5 text-indigo-600 mb-2" />
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Accuracy</p>
            <p className="text-2xl font-black dark:text-white">{accuracy}%</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
            <Check className="w-5 h-5 text-emerald-600 mb-2" />
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Correct</p>
            <p className="text-2xl font-black dark:text-white">{correctCount}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-3xl border border-red-100 dark:border-red-800/50">
            <X className="w-5 h-5 text-red-600 mb-2" />
            <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Wrong</p>
            <p className="text-2xl font-black dark:text-white">{wrongCount}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700">
            <HelpCircle className="w-5 h-5 text-slate-500 mb-2" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Skipped</p>
            <p className="text-2xl font-black dark:text-white">{skippedCount}</p>
          </div>
        </div>
      </div>

      {/* 2. FILTER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
          <Target className="text-indigo-600" /> Performance Analysis
        </h3>
        
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          {[
            { id: "all", label: "All Qs", icon: ListFilter },
            { id: "correct", label: "Correct", icon: Check },
            { id: "wrong", label: "Wrong", icon: X },
            { id: "skipped", label: "Skipped", icon: AlertCircle },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                filter === t.id 
                  ? "bg-slate-900 text-white dark:bg-indigo-600" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. QUESTION BREAKDOWN LIST */}
      <div className="space-y-4">
        {filteredQs.map((q, i) => {
          const uAns = answers[`${q.sessionId}-${q.id}`];
          const isCorrect = uAns === q.correct;
          const isSkipped = uAns === undefined;

          return (
            <div 
              key={i} 
              className={`group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border transition-all hover:shadow-lg ${
                isSkipped 
                  ? 'border-slate-200 dark:border-slate-800 opacity-80' 
                  : isCorrect 
                    ? 'border-emerald-100 dark:border-emerald-900/30' 
                    : 'border-red-100 dark:border-red-900/30'
              }`}
            >
              <div className="flex items-start gap-6">
                {/* Status Icon */}
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black ${
                  isSkipped 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' 
                    : isCorrect 
                      ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600' 
                      : 'bg-red-100 dark:bg-red-900/20 text-red-600'
                }`}>
                  {isCorrect ? <Check /> : isSkipped ? <HelpCircle /> : <X />}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {i + 1} • {q.sessionId}</p>
                    {isSkipped && <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-400">SKIPPED</span>}
                  </div>
                  
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">
                    {q.q_en}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Correct Answer</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{q.options_en[q.correct]}</p>
                    </div>
                    
                    {!isSkipped && !isCorrect && (
                      <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                        <p className="text-[10px] font-black text-red-600 uppercase mb-1">Your Choice</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{q.options_en[uAns]}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="hidden md:flex flex-col items-end gap-2">
                   <ChevronRight className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}

        {filteredQs.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No questions found in this category</p>
          </div>
        )}
      </div>

      {/* 4. RE-TRY ACTION */}
      <div className="pt-10">
        <button 
          onClick={() => window.location.reload()} 
          className="w-full py-6 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white rounded-[2.5rem] font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-slate-200 dark:shadow-none"
        >
          <RotateCcw className="w-6 h-6" />
          RETAKE THIS ASSESSMENT
        </button>
      </div>
    </div>
  );
};