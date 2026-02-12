'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function QuizResult({ params }: { params: { quizId: string } }) {
  const result = {
    score: 85,
    correct: 17,
    incorrect: 3,
    skipped: 0,
    questions: [
      { id: 1, text: "What is the speed of light in a vacuum?", userAnswer: "3x10^8 m/s", correctAnswer: "3x10^8 m/s", explanation: "Light travels at approximately 299,792,458 meters per second in a vacuum, often approximated as 3x10^8 m/s." },
      { id: 2, text: "Newton's First Law is also known as?", userAnswer: "Law of Force", correctAnswer: "Law of Inertia", explanation: "Newton's First Law states that an object will remain at rest or in uniform motion unless acted upon by an external force, which defines Inertia." },
    ]
  };

  return (
    <div className="p-4 mx-auto space-y-6 pb-10">
      <div className="text-center mt-6">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Complete!</h1>
        <p className="text-gray-500">Here is how you performed</p>
      </div>

      {/* Radial Progress Gauge Placeholder */}
      <div className="flex justify-center py-4">
        <div className="w-48 h-48 rounded-full border-[12px] border-indigo-100 flex items-center justify-center relative shadow-inner bg-white">
          <div className="absolute inset-0 rounded-full border-[12px] border-indigo-600 border-t-transparent border-l-transparent rotate-45"></div>
          <div className="text-center z-10">
            <div className="text-5xl font-bold text-indigo-600">{result.score}%</div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-wide mt-1">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Accuracy Breakdown */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <div className="text-2xl font-bold text-green-700">{result.correct}</div>
          <div className="text-xs text-green-600 font-medium uppercase">Correct</div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <div className="text-2xl font-bold text-red-700">{result.incorrect}</div>
          <div className="text-xs text-red-600 font-medium uppercase">Incorrect</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="text-2xl font-bold text-gray-700">{result.skipped}</div>
          <div className="text-xs text-gray-600 font-medium uppercase">Skipped</div>
        </div>
      </div>

      {/* Detailed Review */}
      <div className="space-y-4 pt-4">
        <h3 className="font-bold text-lg text-gray-900">Detailed Review</h3>
        {result.questions.map((q, idx) => (
          <div key={idx} className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="font-medium mb-3 text-gray-800"><span className="text-gray-400 mr-2">{idx + 1}.</span>{q.text}</p>
            <div className="text-sm space-y-2 mb-3">
              <div className={`flex items-center p-2 rounded ${q.userAnswer === q.correctAnswer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <span className="w-24 font-semibold opacity-70">Your Answer:</span> {q.userAnswer}
              </div>
              {q.userAnswer !== q.correctAnswer && (
                <div className="flex items-center p-2 rounded bg-green-50 text-green-800">
                  <span className="w-24 font-semibold opacity-70">Correct:</span> {q.correctAnswer}
                </div>
              )}
            </div>
            <details className="group">
              <summary className="cursor-pointer text-indigo-600 text-sm font-medium flex items-center">
                <span className="group-open:rotate-90 transition-transform mr-1">▶</span> Explanation
              </summary>
              <p className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 leading-relaxed border border-gray-100">{q.explanation}</p>
            </details>
          </div>
        ))}
      </div>

      <div className="flex space-x-3 pb-6 pt-4">
        <button className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition">Share Score</button>
        <Link href="/dashboard/quiz" className="flex-1 bg-gray-100 text-gray-800 py-3.5 rounded-xl font-bold text-center hover:bg-gray-200 transition">Back to Home</Link>
      </div>
    </div>
  );
}