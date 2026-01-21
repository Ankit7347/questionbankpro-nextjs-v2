// src/components/exams/assessment/QuestionCard.tsx
"use client";
import { ChevronLeft, ChevronRight, Trash2, Flag, CheckCircle2 } from "lucide-react";

export const QuestionCard = ({ 
  question, 
  language, 
  userAnswer, 
  onSelect, 
  onClear, 
  onNext, 
  onPrev,
  isLast, 
  isReviewing, 
  currentQuestionIdx, 
  currentSessionIdx,
  isMarked, 
  onToggleMark 
}: any) => {
  const options = language === "en" ? question.options_en : question.options_hi;
  const text = language === "en" ? question.q_en : question.q_hi;

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Container padding adjusted for mobile */}
      <div className="p-5 md:p-12 min-h-[350px] md:min-h-[400px]">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <span className="px-3 py-1 md:px-4 md:py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            Q {currentQuestionIdx + 1}
          </span>
          
          <button 
            type="button" 
            onClick={onToggleMark} 
            className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] font-black border transition-all ${
              isMarked 
                ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200" 
                : "bg-white dark:bg-slate-800 border-slate-200 text-slate-400"
            }`}
          >
            <Flag className={`w-3 h-3 md:w-3.5 md:h-3.5 ${isMarked ? "fill-white" : ""}`} /> 
            {/* Adaptive text for mobile screen space */}
            <span>{isMarked ? "MARKED" : language === "hi" ? "रिव्यू" : "MARK REVIEW"}</span>
          </button>
        </div>

        <h2 className="text-xl md:text-3xl text-slate-800 dark:text-slate-100 mb-8 md:mb-10 font-bold leading-tight">
          {text}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {options.map((opt: string, idx: number) => (
            <button 
              key={idx} 
              onClick={() => onSelect(idx)} 
              className={`text-left p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all flex items-center group active:scale-[0.98] ${
                userAnswer === idx 
                  ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" 
                  : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-300"
              }`}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 mr-3 md:mr-4 shrink-0 flex items-center justify-center rounded-lg md:rounded-xl font-black ${
                userAnswer === idx ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-700 text-slate-400"
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className={`text-sm md:text-base font-bold ${userAnswer === idx ? "text-indigo-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                {opt}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Optimized Footer for Mobile */}
      <div className="px-4 py-4 md:px-8 md:py-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <button 
          type="button"
          disabled={currentQuestionIdx === 0 && currentSessionIdx === 0} 
          onClick={onPrev} 
          className="flex items-center gap-1 font-black text-xs text-slate-400 disabled:opacity-20 p-2 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> 
          <span className="hidden sm:inline">Back</span>
        </button>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            type="button"
            onClick={onClear} 
            className="p-2.5 md:p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            title="Clear"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <button 
            type="button"
            onClick={onNext} 
            className={`
              px-5 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-black text-white shadow-xl flex items-center gap-2 text-[11px] md:text-sm transition-all active:scale-95
              ${isReviewing 
                ? 'bg-emerald-600 shadow-emerald-200 dark:shadow-none' 
                : isLast 
                  ? 'bg-purple-600 shadow-purple-200 dark:shadow-none' 
                  : 'bg-indigo-600 shadow-indigo-200 dark:shadow-none'
              }
            `}
          >
            <span className="uppercase tracking-tight md:tracking-widest">
              {isReviewing ? "Final Submit" : isLast ? "Review Items" : "Save & Next"}
            </span>
            {isReviewing ? (
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};