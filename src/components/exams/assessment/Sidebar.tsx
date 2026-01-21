// src/components/exams/assessment/Sidebar.tsx
"use client";
import React from "react";
import { CheckCircle2 } from "lucide-react";

export const Sidebar = ({ sessions, currentSessionIdx, setCurrentSessionIdx, currentQuestionIdx, setCurrentQuestionIdx, answers, markedForReview, onFinish }: any) => {
  const currentSession = sessions[currentSessionIdx];
  return (
    <div className="w-full lg:w-80 flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-2 shadow-sm">
        {sessions.map((s: any, idx: number) => (
          <button key={s.id} onClick={() => { setCurrentSessionIdx(idx); setCurrentQuestionIdx(0); }}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${currentSessionIdx === idx ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            {s.name}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Question Palette</h3>
        <div className="grid grid-cols-4 gap-3">
          {currentSession.subjects[0].questions.map((q: any, idx: number) => {
            const key = `${currentSession.id}-${q.id}`;
            const isAns = answers[key] !== undefined;
            const isRev = markedForReview[key] === true;
            let bgColor = "bg-slate-100 dark:bg-slate-800 text-slate-400";
            if (isRev) bgColor = "bg-purple-600 text-white shadow-lg shadow-purple-200";
            else if (isAns) bgColor = "bg-emerald-500 text-white shadow-lg shadow-emerald-200";

            return (
              <button key={q.id} onClick={() => setCurrentQuestionIdx(idx)}
                className={`h-11 w-11 rounded-xl text-xs font-black transition-all transform active:scale-95 ${bgColor} ${currentQuestionIdx === idx ? 'ring-4 ring-indigo-500/20 border-2 border-indigo-500 scale-105' : 'border-2 border-transparent'}`}>
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={onFinish} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 dark:shadow-none flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
        <CheckCircle2 className="w-4 h-4" /> Finish Test
      </button>
    </div>
  );
};