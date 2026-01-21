// src/components/exams/assessment/QuestionCard.tsx
"use client";
import { ChevronLeft, ChevronRight, Trash2, Flag } from "lucide-react";

export const QuestionCard = ({ question, language, userAnswer, onSelect, onClear, onNext, isLast, currentQuestionIdx, setQuestionIdx, isMarked, onToggleMark }: any) => {
  const options = language === "en" ? question.options_en : question.options_hi;
  const text = language === "en" ? question.q_en : question.q_hi;

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-8 md:p-12 min-h-[400px]">
        <div className="flex justify-between items-center mb-8">
          <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase">Question {currentQuestionIdx + 1}</span>
          <button type="button" onClick={onToggleMark} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${isMarked ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200" : "bg-white dark:bg-slate-800 border-slate-200 text-slate-400"}`}>
            <Flag className={`w-3.5 h-3.5 ${isMarked ? "fill-white" : ""}`} /> {isMarked ? "MARKED" : "MARK FOR REVIEW"}
          </button>
        </div>
        <h2 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 mb-10 font-bold leading-tight">{text}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt: string, idx: number) => (
            <button key={idx} onClick={() => onSelect(idx)} className={`text-left p-6 rounded-3xl border-2 transition-all flex items-center group ${userAnswer === idx ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-300"}`}>
              <div className={`w-10 h-10 mr-4 shrink-0 flex items-center justify-center rounded-xl font-black ${userAnswer === idx ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-700 text-slate-400"}`}>{String.fromCharCode(65 + idx)}</div>
              <span className={`font-bold ${userAnswer === idx ? "text-indigo-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>{opt}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <button disabled={currentQuestionIdx === 0} onClick={() => setQuestionIdx((p:any)=>p-1)} className="flex items-center gap-2 font-black text-slate-400 disabled:opacity-20"><ChevronLeft className="w-5 h-5" /> Previous</button>
        <div className="flex items-center gap-3">
          <button onClick={onClear} className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"><Trash2 className="w-5 h-5" /></button>
          <button onClick={onNext} className={`px-10 py-4 rounded-2xl font-black text-white shadow-xl flex items-center gap-2 ${isLast ? 'bg-purple-600 shadow-purple-200' : 'bg-slate-900 dark:bg-indigo-600'}`}>
            {isLast ? "Review Marked Items" : "Save & Next"} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};