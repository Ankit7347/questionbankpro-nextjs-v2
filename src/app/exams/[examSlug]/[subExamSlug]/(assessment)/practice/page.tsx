// src/app/exams/[examSlug]/[subExamSlug]/(assessment)/practice/page.tsx
"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import { EXAM_DATA } from "@/data/exam-data";
import { Timer } from "@/components/exams/assessment/Timer";
import { Sidebar } from "@/components/exams/assessment/Sidebar";
import { QuestionCard } from "@/components/exams/assessment/QuestionCard";
import { ResultView } from "@/components/exams/assessment/ResultView";

export default function PracticePage({ params }: { params: Promise<{ examSlug: string; subExamSlug: string }> }) {
  const resolvedParams = use(params);
  const storageKey = `practice_${resolvedParams.subExamSlug}`;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_DATA.totalTimeMinutes * 60);
  const [currentSessionIdx, setCurrentSessionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [key: string]: boolean }>({});

  const session = EXAM_DATA.sessions[currentSessionIdx];
  const question = session.subjects[0].questions[currentQuestionIdx];
  const qKey = `${session.id}-${question.id}`;

  const allQs = useMemo(() => EXAM_DATA.sessions.flatMap(s => 
    s.subjects.flatMap(sub => sub.questions.map(q => ({ ...q, sessionId: s.id })))
  ), []);

  const markedKeys = useMemo(() => 
    Object.keys(markedForReview).filter(key => markedForReview[key]), 
  [markedForReview]);

  const isLastQuestion = currentSessionIdx === EXAM_DATA.sessions.length - 1 && 
                         currentQuestionIdx === session.subjects[0].questions.length - 1;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      setAnswers(data.answers || {});
      setMarkedForReview(data.review || {});
      if (data.timeLeft > 0) setTimeLeft(data.timeLeft);
    }
  }, [storageKey]);

  const handleFinishAttempt = () => {
    if (markedKeys.length > 0) {
      setIsReviewing(true);
      const [sessId, qId] = markedKeys[0].split("-");
      const sIdx = EXAM_DATA.sessions.findIndex(s => s.id === sessId);
      const qIdx = EXAM_DATA.sessions[sIdx].subjects[0].questions.findIndex(q => q.id === Number(qId));
      setCurrentSessionIdx(sIdx);
      setCurrentQuestionIdx(qIdx);
    } else {
      submitFinal();
    }
  };

  const submitFinal = () => {
    setIsSubmitted(true);
    localStorage.removeItem(storageKey);
  };

  if (isSubmitted) return <ResultView allQs={allQs} answers={answers} examName={resolvedParams.subExamSlug} />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors">
      {isReviewing && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-purple-600 text-white rounded-2xl flex justify-between items-center shadow-lg">
          <span className="font-black text-xs uppercase tracking-widest">Review Mode: Checking Marked Items ({markedKeys.length} left)</span>
          <button onClick={submitFinal} className="bg-white text-purple-600 px-4 py-2 rounded-xl font-black text-xs hover:bg-purple-50 transition-all">Submit Final</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <h1 className="text-sm font-black dark:text-white uppercase tracking-tighter">{resolvedParams.subExamSlug}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onExpire={submitFinal} storageKey={storageKey} answers={answers} markedForReview={markedForReview} />
              <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                {(['en', 'hi'] as const).map((l) => (
                  <button key={l} onClick={() => setLanguage(l)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${language === l ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <QuestionCard 
            question={question} language={language} userAnswer={answers[qKey]}
            onSelect={(idx: number) => setAnswers(prev => ({ ...prev, [qKey]: idx }))}
            onClear={() => setAnswers(prev => { const n = { ...prev }; delete n[qKey]; return n; })}
            isMarked={!!markedForReview[qKey]}
            onToggleMark={() => setMarkedForReview(prev => ({ ...prev, [qKey]: !prev[qKey] }))}
            onNext={isLastQuestion ? handleFinishAttempt : () => {
              if (currentQuestionIdx < session.subjects[0].questions.length - 1) setCurrentQuestionIdx(p => p + 1);
              else { setCurrentSessionIdx(p => p + 1); setCurrentQuestionIdx(0); }
            }}
            isLast={isLastQuestion}
            setQuestionIdx={setCurrentQuestionIdx}
          />
        </div>

        <Sidebar 
          sessions={EXAM_DATA.sessions} currentSessionIdx={currentSessionIdx} setCurrentSessionIdx={setCurrentSessionIdx}
          currentQuestionIdx={currentQuestionIdx} setCurrentQuestionIdx={setCurrentQuestionIdx}
          answers={answers} markedForReview={markedForReview} onFinish={handleFinishAttempt}
        />
      </div>
    </div>
  );
}