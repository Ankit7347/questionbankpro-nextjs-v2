// src/app/exams/[examSlug]/[subExamSlug]/(assessment)/practice/page.tsx

"use client";

import React, { useState, use } from "react";

/**
 * MOCK DATA STRUCTURE
 * Representing a multi-session exam like SSC
 */
const EXAM_DATA = {
  sessions: [
    {
      id: "s1",
      name: "Session 1 (Morning)",
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
              correct: 0,
            },
            {
              id: 2,
              q_en: "Find the odd one out.",
              q_hi: "विषम चुनें।",
              options_en: ["Copper", "Iron", "Iodine", "Tin"],
              options_hi: ["तांबा", "लोहा", "आयोडीन", "टिन"],
              correct: 2,
            },
          ],
        },
      ],
    },
    {
      id: "s2",
      name: "Session 2 (Afternoon)",
      subjects: [
        {
          name: "Quantitative Aptitude",
          questions: [
            {
              id: 3,
              q_en: "The sum of two numbers is 25.",
              q_hi: "दो संख्याओं का योग 25 है।",
              options_en: ["10,15", "12,13", "5,20", "None"],
              options_hi: ["10,15", "12,13", "5,20", "कोई नहीं"],
              correct: 1,
            },
          ],
        },
      ],
    },
  ],
};

export default function PracticePage({ params }: { params: Promise<{ examSlug: string; subExamSlug: string }> }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);

  // States
  const [currentSessionIdx, setCurrentSessionIdx] = useState(0);
  const [currentSubjectIdx, setCurrentSubjectIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});

  const session = EXAM_DATA.sessions[currentSessionIdx];
  const subject = session.subjects[currentSubjectIdx];
  const question = subject.questions[currentQuestionIdx];

  const handleAnswer = (optionIdx: number) => {
    setAnswers({ ...answers, [`${session.id}-${question.id}`]: optionIdx });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 md:p-8">
      {/* Header Info */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase">
            {resolvedParams.subExamSlug.replace("-", " ")} Practice
          </h1>
          <p className="text-slate-500 text-sm">Exam Mode: Multi-session Interactive</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Language Toggle */}
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>

          {/* Session Selector */}
          <select 
            value={currentSessionIdx} 
            onChange={(e) => {
              setCurrentSessionIdx(Number(e.target.value));
              setCurrentSubjectIdx(0);
              setCurrentQuestionIdx(0);
            }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none"
          >
            {EXAM_DATA.sessions.map((s, idx) => (
              <option key={s.id} value={idx}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Question Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Subject Header */}
            <div className="bg-slate-100 dark:bg-slate-800 px-6 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{subject.name}</span>
              <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">Q: {currentQuestionIdx + 1}/{subject.questions.length}</span>
            </div>

            {/* Question Body */}
            <div className="p-6">
              <p className="text-lg text-slate-800 dark:text-slate-200 mb-8 font-medium">
                {language === "en" ? question.q_en : question.q_hi}
              </p>

              <div className="grid gap-3">
                {(language === "en" ? question.options_en : question.options_hi).map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      answers[`${session.id}-${question.id}`] === idx
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                    }`}
                  >
                    <span className="inline-block w-8 h-8 mr-3 text-center leading-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-between">
              <button 
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                className="px-6 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                disabled={currentQuestionIdx === subject.questions.length - 1}
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/30 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette & Navigation */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
              Question Palette
            </h3>
            
            <div className="grid grid-cols-5 gap-2">
              {subject.questions.map((q, idx) => {
                const isAnswered = answers[`${session.id}-${q.id}`] !== undefined;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-10 w-10 rounded-lg text-sm font-bold transition-colors ${
                      currentQuestionIdx === idx
                        ? "bg-indigo-600 text-white"
                        : isAnswered
                        ? "bg-green-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
               <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span> Answered
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-indigo-600 rounded-full"></span> Current
               </div>
            </div>
          </div>

          <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-transform active:scale-95 shadow-xl shadow-emerald-500/20">
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
                  }
