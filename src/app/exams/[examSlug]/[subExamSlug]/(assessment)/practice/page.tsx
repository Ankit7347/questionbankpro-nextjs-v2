// File Path: src/app/exams/[examSlug]/[subExamSlug]/(assessment)/practice/page.tsx
"use client";

import React, { useState, useEffect, use } from "react";

const EXAM_DATA = {
  totalTimeMinutes: 45,
  sessions: [
    {
      id: "s1",
      name: "Session 1: Reasoning",
      subjects: [
        {
          name: "General Intelligence",
          questions: [
            { id: 1, q_en: "A is 1, FAT is 27, FAITH is?", q_hi: "A=1, FAT=27, FAITH=?", options_en: ["44", "45", "46", "47"], options_hi: ["44", "45", "46", "47"], correct: 0 },
            { id: 2, q_en: "Find the odd one out.", q_hi: "विषम चुनें।", options_en: ["Copper", "Iron", "Iodine", "Tin"], options_hi: ["तांबा", "लोहा", "आयोडीन", "टिन"], correct: 2 },
          ],
        },
      ],
    },
    {
      id: "s2",
      name: "Session 2: Quant",
      subjects: [
        {
          name: "Mathematics",
          questions: [
            { id: 3, q_en: "Sum of 15 and 10?", q_hi: "15 और 10 का योग?", options_en: ["20", "25", "30", "35"], options_hi: ["20", "25", "30", "35"], correct: 1 },
          ],
        },
      ],
    },
  ],
};

export default function PracticePage({ params }: { params: Promise<{ examSlug: string; subExamSlug: string }> }) {
  const resolvedParams = use(params);
  const storageKey = `practice_${resolvedParams.subExamSlug}`;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_DATA.totalTimeMinutes * 60);
  const [currentSessionIdx, setCurrentSessionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  
  // Data States
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const { answers: savedAns, timeLeft: savedTime, review: savedReview } = JSON.parse(saved);
      setAnswers(savedAns || {});
      setTimeLeft(savedTime || EXAM_DATA.totalTimeMinutes * 60);
      setMarkedForReview(savedReview || {});
    }
  }, [storageKey]);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        localStorage.setItem(storageKey, JSON.stringify({ answers, timeLeft: newTime, review: markedForReview }));
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isSubmitted, answers, markedForReview, storageKey]);

  const session = EXAM_DATA.sessions[currentSessionIdx];
  const subject = session.subjects[0];
  const question = subject.questions[currentQuestionIdx];
  const qKey = `${session.id}-${question.id}`;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleFinish = () => {
    setIsSubmitted(true);
    localStorage.removeItem(storageKey);
  };

  // --- RESULT VIEW ---
  if (isSubmitted) {
    const allQs = EXAM_DATA.sessions.flatMap(s => s.subjects.flatMap(sub => sub.questions));
    
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
            <h2 className="text-3xl font-black text-slate-800">Exam Summary</h2>
            <p className="text-slate-500 mb-6">Performance for {resolvedParams.subExamSlug}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="p-4 bg-indigo-50 rounded-2xl">
                 <p className="text-xs font-bold text-indigo-600 uppercase">Attempted</p>
                 <p className="text-2xl font-black">{Object.keys(answers).length} / {allQs.length}</p>
               </div>
               <div className="p-4 bg-purple-50 rounded-2xl">
                 <p className="text-xs font-bold text-purple-600 uppercase">Review Left</p>
                 <p className="text-2xl font-black">{Object.keys(markedForReview).filter(k => markedForReview[k]).length}</p>
               </div>
               {/* Simplified accuracy logic for display */}
               <div className="p-4 bg-emerald-50 rounded-2xl col-span-2">
                 <p className="text-xs font-bold text-emerald-600 uppercase">Status</p>
                 <p className="text-2xl font-black">Submitted Successfully</p>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <h3 className="font-bold mb-4">Question Analysis</h3>
            <div className="space-y-3">
              {allQs.map((q, i) => {
                const sIdx = EXAM_DATA.sessions.findIndex(s => s.subjects[0].questions.includes(q));
                const key = `${EXAM_DATA.sessions[sIdx].id}-${q.id}`;
                const answered = answers[key] !== undefined;
                return (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-600">Q{i+1}.</span>
                    <span className="flex-1 px-4 text-sm truncate">{q.q_en}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${answered ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                      {answered ? "Attempted" : "Skipped"}
                    </span>
                  </div>
                );
              })}
            </div>
            <button onClick={() => window.location.reload()} className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">Retake Test</button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{resolvedParams.subExamSlug}</h1>
          <div className={`mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${timeLeft < 300 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-indigo-600 border border-slate-200'}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex gap-2">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold shadow-sm outline-none"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
          <select 
            value={currentSessionIdx} 
            onChange={(e) => { setCurrentSessionIdx(Number(e.target.value)); setCurrentQuestionIdx(0); }}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold shadow-sm outline-none"
          >
            {EXAM_DATA.sessions.map((s, idx) => <option key={s.id} value={idx}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
              <span className="font-bold text-indigo-600">{subject.name}</span>
              <button 
                onClick={() => setMarkedForReview(prev => ({ ...prev, [qKey]: !prev[qKey] }))}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all border ${markedForReview[qKey] ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
              >
                {markedForReview[qKey] ? "★ MARKED" : "☆ MARK FOR REVIEW"}
              </button>
            </div>

            <div className="p-8 md:p-12">
              <p className="text-2xl text-slate-800 mb-10 font-medium leading-relaxed">
                {language === "en" ? question.q_en : question.q_hi}
              </p>

              <div className="grid gap-4">
                {(language === "en" ? question.options_en : question.options_hi).map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAnswers({ ...answers, [qKey]: idx })}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center ${
                      answers[qKey] === idx
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-8 h-8 mr-4 flex items-center justify-center rounded-full text-xs font-black ${answers[qKey] === idx ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t flex justify-between items-center">
              <button disabled={currentQuestionIdx === 0} onClick={() => setCurrentQuestionIdx(p => p - 1)} className="font-bold text-slate-400 disabled:opacity-30">← Back</button>
              <div className="flex gap-4">
                <button onClick={() => setAnswers(prev => { const n = {...prev}; delete n[qKey]; return n; })} className="text-xs font-bold text-red-400">Clear</button>
                <button 
                  onClick={() => currentQuestionIdx < subject.questions.length - 1 && setCurrentQuestionIdx(p => p + 1)} 
                  className="px-10 py-3 bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-200"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-400 mb-4 uppercase text-[10px] tracking-[0.2em]">Question Palette</h3>
            <div className="grid grid-cols-5 gap-3">
              {subject.questions.map((q, idx) => {
                const key = `${session.id}-${q.id}`;
                const isAns = answers[key] !== undefined;
                const isReview = markedForReview[key];

                let color = "bg-slate-100 text-slate-400";
                if (isReview) color = "bg-purple-600 text-white";
                else if (isAns) color = "bg-emerald-500 text-white";
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${color} ${currentQuestionIdx === idx ? 'ring-4 ring-indigo-100 scale-110 shadow-sm' : ''}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-y-2 text-[10px] font-bold text-slate-400">
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> ANSWERED</div>
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-600"></span> REVIEW</div>
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-100"></span> NOT VISITED</div>
            </div>
          </div>

          <button onClick={handleFinish} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all">
            SUBMIT ASSESSMENT
          </button>
        </div>
      </div>
    </div>
  );
}
