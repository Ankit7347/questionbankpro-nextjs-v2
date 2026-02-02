'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function QuizDashboard() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-20">
      {/* Performance Analytics Card */}
      <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg text-white bg-gradient-to-br from-indigo-500 to-purple-600">
        <h2 className="text-lg font-semibold mb-4">Your Performance</h2>
        <div className="flex justify-between text-center">
          <div>
            <div className="text-2xl font-bold">78%</div>
            <div className="text-xs opacity-80">Avg. Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs opacity-80">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold">#42</div>
            <div className="text-xs opacity-80">Global Rank</div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/quiz/upcoming" className="bg-blue-600 text-white p-4 rounded-xl text-center font-bold shadow-md hover:bg-blue-700 transition flex flex-col justify-center items-center h-24">
          <span>Take a New Quiz</span>
        </Link>
        <button className="bg-orange-500 text-white p-4 rounded-xl text-center font-bold shadow-md hover:bg-orange-600 transition flex flex-col justify-center items-center h-24">
          <span>Daily Challenge</span>
        </button>
      </div>

      {/* Module Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-lg">
        <Link href="/dashboard/quiz/upcoming" className="flex-1 text-center py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all">
          Upcoming
        </Link>
        <Link href="/dashboard/quiz/history" className="flex-1 text-center py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all">
          History
        </Link>
      </div>

      {/* Category Filter */}
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-2">
          {['All', 'Physics', 'Math', 'Chemistry', 'Biology', 'English'].map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}