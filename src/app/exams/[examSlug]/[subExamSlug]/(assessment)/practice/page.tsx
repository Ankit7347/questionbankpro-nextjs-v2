// src/app/exams/[examSlug]/[subExamSlug]/(assessment)/practice/page.tsx
"use client";

import React, { useState, useEffect, use } from "react";

// --- MOCK DATA ---
const EXAM_DATA = {
  totalTimeMinutes: 60,
  sessions: [
    {
      id: "s1",
      name: "Session 1",
      subjects: [
        {
          name: "General Intelligence",
          questions: [
            {
              id: 1,
              q_en: "If A = 1 and FAT = 27, then FAITH = ?",
              q_hi: "यदि A = 1 और FAT = 27 है, तो FAITH = ?",
              options_en: ["44", "45", "46", "47"],
              options_hi: ["44", "45", "46", "47"],
              correct: 1, // 45
              solution: "Sum of alphabetic positions: F(6)+A(1)+I(9)+T(20)+H(8) = 44. Wait, FAT is 6+1+20=27. So FAITH is 44."
            },
            {
              id: 2,
              q_en: "Find the odd one out.",
              q_hi: "विषम चुनें।",
              options_en: ["Copper", "Iron", "Iodine", "Tin"],
              options_hi: ["तांबा", "लोहा", "आयोडीन", "टिन"],
              correct: 2, // Iodine
              solution: "Iodine is a non-metal, others are metals."
            },
          ],
        },
      ],
    },
  ],
};

export default function PracticePage({ params }: { params: Promise<{ examSlug: string; subExamSlug: string }> }) {
  const resolvedParams = use(params);

  // States
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_DATA.totalTimeMinutes * 60);
  const [currentSessionIdx, setCurrentSessionIdx] = useState(0);
  const [currentSubjectIdx, setCurrentSubjectIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  
  // Data States
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [key: string]: boolean }>({});

  // 1. Persistence & Timer Logic
  useEffect(() => {
    const saved = localStorage.getItem(`quiz_${resolvedParams.subExamSlug}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers || {});
      setTimeLeft(parsed.timeLeft || EXAM_DATA.totalTimeMinutes * 60);
    }
  }, [resolvedParams.subExamSlug]);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        localStorage.setItem(`quiz_${resolvedParams.subExamSlug}`, JSON.stringify({ answers, timeLeft: next }));
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, answers, resolvedParams.subExamSlug]);

  // Derived Data
  const session = EXAM_DATA.sessions[currentSessionIdx];
  const subject = session.subjects[currentSubjectIdx];
  const question = subject.questions[currentQuestionIdx];
  const qKey = `${session.id}-${question.id}`;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleFinish = () => {
    setIsSubmitted(true);
    localStorage.removeItem(`quiz_${resolvedParams.subExamSlug}`);
  };

  // --- RESULT VIEW ---
  if (isSubmitted) {
    const totalQ = EXAM_DATA.sessions.flatMap(s => s.subjects.flatMap(sub => sub.questions)).length;
    const correctCount = EXAM_DATA.sessions.flatMap(s => s.subjects.flatMap(sub => sub.questions))
      .filter(q => answers[`s1-${q.id}`] === q.correct).length;

    return (
      <div className="max-w-4xl mx-auto p-6 animate-in fade-in zoom-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
          <p className="text-slate-500 mb-8">Here is your performance breakdown for {resolvedParams.subExamSlug}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <p className="text-sm text-slate-500">Score</p>
              <p className="text-3xl font-black text-indigo-600">{(correctCount * 2).toFixed(1)}</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <p className="text-sm text-slate-500">Accuracy</p>
              <p className="text-3xl font-black text-emerald-600">{((correctCount / totalQ) * 100).toFixed(0)}%</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <p className="text-sm text-slate-500">Questions</p>
              <p className="text-3xl font-black text-slate-700 dark:text-slate-300">{correctCount}/{totalQ}</p>
            </div>
          </div>
          
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">Try Again</button>
        </div>
      </div>
    );
  }

  // --- QUIZ VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <h1 className="font-bold text-slate-800 dark:text-white uppercase tracking-tight">
                {resolvedParams.subExamSlug.replace("-", " ")}
              </h1>
            </div>
            <div className={`px-4 py-1.5 rounded-full font-mono font-bold flex items-center gap-2 ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-indigo-600'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
              className="bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-lg px-2 py-1.5 outline-none border border-slate-200 dark:border-slate-700"
            >
              <option value="en">ENGLISH</option>
              <option value="hi">हिन्दी</option>
            </select>
            <button onClick={handleFinish} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-red-500/20">
              FINISH
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Subject Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {session.subjects.map((sub, idx) => (
              <button
                key={sub.name}
                onClick={() => { setCurrentSubjectIdx(idx); setCurrentQuestionIdx(0); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  currentSubjectIdx === idx 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black tracking-widest text-indigo-500 uppercase">Question {currentQuestionIdx + 1}</span>
                <button 
                  onClick={() => setMarkedForReview(prev => ({ ...prev, [qKey]: !prev[qKey] }))}
                  className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${markedForReview[qKey] ? "bg-purple-100 border-purple-300 text-purple-600" : "border-slate-200 dark:border-slate-700 text-slate-500"}`}
                >
                  {markedForReview[qKey] ? "★ Marked" : "☆ Mark for Review"}
                </button>
              </div>

              <p className="text-xl md:text-2xl text-slate-800 dark:text-slate-100 leading-relaxed mb-8">
                {language === "en" ? question.q_en : question.q_hi}
              </p>

              <div className="grid gap-4">
                {(language === "en" ? question.options_en : question.options_hi).map((opt, idx) => (
                  <label
                    key={idx}
                    className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all group ${
                      answers[qKey] === idx
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="quiz-opt" 
                      className="hidden" 
                      checked={answers[qKey] === idx}
                      onChange={() => setAnswers({...answers, [qKey]: idx})} 
                    />
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${answers[qKey] === idx ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}`}>
                      {answers[qKey] === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button 
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(p => p - 1)}
                className="p-3 text-slate-400 hover:text-indigo-600 disabled:opacity-30"
              >
                ← Previous
              </button>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setAnswers(prev => { const n = {...prev}; delete n[qKey]; return n; })}
                  className="px-4 py-2 text-xs font-bold text-slate-500"
                >
                  Clear Response
                </button>
                <button 
                  onClick={() => currentQuestionIdx < subject.questions.length - 1 && setCurrentQuestionIdx(p => p + 1)}
                  className="px-8 py-3 bg-slate-800 dark:bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Palette */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Question Palette</h3>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
              {subject.questions.map((q, idx) => {
                const key = `${session.id}-${q.id}`;
                const isAns = answers[key] !== undefined;
                const isMarked = markedForReview[key];

                let statusClass = "bg-slate-100 dark:bg-slate-800 text-slate-400";
                if (isMarked) statusClass = "bg-purple-600 text-white";
                else if (isAns) statusClass = "bg-emerald-500 text-white";
                if (currentQuestionIdx === idx) statusClass += " ring-4 ring-indigo-500/20 scale-110";

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-11 w-11 rounded-xl text-xs font-black transition-all ${statusClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
