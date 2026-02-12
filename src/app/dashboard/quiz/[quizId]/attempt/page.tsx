'use client';

import { useState, useEffect,use } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizAttempt({ params }: { params: Promise<{ quizId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const quizId = resolvedParams.quizId;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins in seconds

  const questions = [
    { id: 1, text: "What is the speed of light in a vacuum?", options: ["3x10^8 m/s", "3x10^6 m/s", "300 km/h", "Infinite"] },
    { id: 2, text: "Newton's First Law is also known as?", options: ["Law of Inertia", "Law of Force", "Law of Action-Reaction", "Law of Gravity"] },
    { id: 3, text: "Which particle has a negative charge?", options: ["Proton", "Neutron", "Electron", "Photon"] },
    { id: 4, text: "The unit of Force is?", options: ["Joule", "Newton", "Watt", "Pascal"] },
    // Mocking more questions for the grid
    ...Array.from({ length: 16 }).map((_, i) => ({ id: i + 5, text: `Mock Question ${i + 5}`, options: ["Option A", "Option B", "Option C", "Option D"] }))
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const toggleReview = () => {
    const newSet = new Set(markedForReview);
    if (newSet.has(currentQuestion)) newSet.delete(currentQuestion);
    else newSet.add(currentQuestion);
    setMarkedForReview(newSet);
  };

  const submitQuiz = () => {
    // In a real app, POST to API here
    router.push(`/dashboard/quiz/${quizId}/result`);
  };

  return (
    <div className="flex flex-col bg-gray-50 overflow-hidden">
      {/* Sticky Header */}
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className={`font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
          {formatTime(timeLeft)}
        </div>
        <button onClick={submitQuiz} className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition">
          Finish
        </button>
      </header>

      {/* Question Area */}
      <main className="flex-1 p-6 overflow-y-auto pb-24">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Question {currentQuestion + 1} / {questions.length}</span>
            <button onClick={toggleReview} className={`text-sm font-medium flex items-center ${markedForReview.has(currentQuestion) ? 'text-orange-500' : 'text-gray-400'}`}>
              <span className="text-lg mr-1">{markedForReview.has(currentQuestion) ? '★' : '☆'}</span>
              {markedForReview.has(currentQuestion) ? 'Marked' : 'Mark for Review'}
            </button>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">{questions[currentQuestion].text}</h2>
        </div>

        <div className="space-y-3">
          {questions[currentQuestion].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(opt)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center ${
                answers[currentQuestion] === opt 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${answers[currentQuestion] === opt ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}>
                {answers[currentQuestion] === opt && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              {opt}
            </button>
          ))}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t p-4 flex justify-between items-center fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(c => c - 1)}
          className="px-4 py-2 text-gray-600 font-medium disabled:opacity-30 hover:bg-gray-50 rounded-lg transition"
        >
          Previous
        </button>
        
        <button onClick={() => setIsNavigatorOpen(!isNavigatorOpen)} className="flex flex-col items-center text-indigo-600">
          <span className="text-xs font-bold uppercase tracking-wider">Navigator</span>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mt-1"></div>
        </button>

        <button 
          disabled={currentQuestion === questions.length - 1}
          onClick={() => setCurrentQuestion(c => c + 1)}
          className="px-6 py-2 bg-black text-white rounded-lg font-medium disabled:opacity-50 hover:bg-gray-800 transition"
        >
          Next
        </button>
      </footer>

      {/* Question Navigator Sheet */}
      {isNavigatorOpen && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-end backdrop-blur-sm" onClick={() => setIsNavigatorOpen(false)}>
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Question Navigator</h3>
              <button onClick={() => setIsNavigatorOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="grid grid-cols-5 gap-3 mb-6">
              {questions.map((q, idx) => {
                let statusClass = "bg-gray-100 text-gray-600 border-transparent"; // Unvisited
                if (idx === currentQuestion) statusClass = "bg-white text-indigo-600 border-indigo-600 ring-2 ring-indigo-100"; // Current
                else if (markedForReview.has(idx)) statusClass = "bg-amber-100 text-amber-700 border-amber-300"; // Marked
                else if (answers[idx]) statusClass = "bg-green-100 text-green-700 border-green-300"; // Answered

                return (
                  <button 
                    key={idx} 
                    onClick={() => { setCurrentQuestion(idx); setIsNavigatorOpen(false); }}
                    className={`h-12 w-12 rounded-xl border flex items-center justify-center text-sm font-bold transition-all ${statusClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div className="flex items-center"><span className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></span> Answered</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-amber-100 border border-amber-300 rounded mr-2"></span> Marked for Review</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-gray-100 rounded mr-2"></span> Not Visited</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-white border border-indigo-600 rounded mr-2"></span> Current</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}