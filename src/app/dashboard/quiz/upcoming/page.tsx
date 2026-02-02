'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function UpcomingQuizzes() {
  const [quizzes] = useState([
    { id: '1', title: 'Physics Mid-Term', time: '02:00:00', registered: true },
    { id: '2', title: 'Calculus I', time: '14:30:00', registered: false },
    { id: '3', title: 'Organic Chemistry', time: '1 Day', registered: false },
  ]);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <Link href="/dashboard/quiz" className="mr-4 text-gray-600">← Back</Link>
        <h1 className="text-xl font-bold">Upcoming Quizzes</h1>
      </div>
      
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="bg-white border rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${quiz.registered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {quiz.registered ? 'Registered' : 'Open for All'}
          </div>
          <h3 className="font-semibold text-lg mt-2">{quiz.title}</h3>
          <div className="text-sm text-gray-500 mb-4 mt-1">Starts in: <span className="font-mono text-black font-medium">{quiz.time}</span></div>
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <button className="text-blue-600 text-sm font-medium hover:underline">View Topics</button>
            <div className="flex items-center space-x-3">
              <label className="text-xs text-gray-500 flex items-center cursor-pointer">
                <input type="checkbox" className="mr-1.5 accent-indigo-600" /> Remind me
              </label>
              <Link href={`/dashboard/quiz/${quiz.id}`} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                Enter
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}