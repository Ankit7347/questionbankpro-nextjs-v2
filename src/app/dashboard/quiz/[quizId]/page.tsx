'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function QuizLobby({ params }: { params: { quizId: string } }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate hardware check
    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto flex flex-col h-screen bg-white">
      <div className="flex-1">
        <Link href="/dashboard/quiz/upcoming" className="text-gray-500 text-sm mb-4 block">← Cancel</Link>
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Quiz Instructions</h1>
        <p className="text-gray-600 mb-8">Please read the rules carefully before starting the exam.</p>
        
        <ul className="space-y-6 text-sm text-gray-700">
          <li className="flex items-start p-3 bg-gray-50 rounded-lg">
            <span className="text-xl mr-3">⏱️</span>
            <div>
              <strong className="block text-gray-900">Time Limit</strong>
              <span>30 Minutes. The timer starts automatically once you enter.</span>
            </div>
          </li>
          <li className="flex items-start p-3 bg-gray-50 rounded-lg">
            <span className="text-xl mr-3">⚠️</span>
            <div>
              <strong className="block text-gray-900">Marking Scheme</strong>
              <span>+1 for correct, -0.25 for incorrect answers.</span>
            </div>
          </li>
          <li className="flex items-start p-3 bg-gray-50 rounded-lg">
            <span className="text-xl mr-3">📝</span>
            <div>
              <strong className="block text-gray-900">Format</strong>
              <span>20 Multiple Choice Questions.</span>
            </div>
          </li>
        </ul>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-3">System Check</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-blue-700">
              <span>Internet Connection</span>
              <span className="flex items-center font-medium text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Stable
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-blue-700">
              <span>Battery Status</span>
              <span className={`flex items-center font-medium ${isReady ? 'text-green-600' : 'text-amber-600'}`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${isReady ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span> 
                {isReady ? 'Good' : 'Checking...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 bg-white">
        <Link href={`/dashboard/quiz/${params.quizId}/attempt`} className={`block w-full text-center py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${isReady ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'}`}>
          Start Quiz
        </Link>
      </div>
    </div>
  );
}