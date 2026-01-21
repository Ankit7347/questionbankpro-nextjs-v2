// src/components/exams/assessment/Timer.tsx
"use client";
import { useEffect, useRef } from "react";
import { Clock } from "lucide-react";

export const Timer = ({ timeLeft, setTimeLeft, onExpire, storageKey, answers, markedForReview }: any) => {
  const stateRef = useRef({ answers, markedForReview });
  useEffect(() => { stateRef.current = { answers, markedForReview }; }, [answers, markedForReview]);

  useEffect(() => {
    if (timeLeft <= 0) { onExpire(); return; }
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        const newTime = prev - 1;
        localStorage.setItem(storageKey, JSON.stringify({ answers: stateRef.current.answers, review: stateRef.current.markedForReview, timeLeft: newTime }));
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onExpire, storageKey, setTimeLeft]);

  const isUrgent = timeLeft < 300;
  return (
    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-lg border transition-all ${isUrgent ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'}`}>
      <Clock className="w-5 h-5" /> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
    </div>
  );
};