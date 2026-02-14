"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function QuizStartPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/dashboard/quiz/${quizId}`);
        if (!res.ok) throw new Error("Quiz not found");
        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await fetch(`/api/dashboard/quiz/${quizId}/start`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to start");
      const submission = await res.json();
      router.push(`/dashboard/quiz/submission/${submission.id}/attempt`);
    } catch (err) {
      console.error(err);
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      <Link href="/dashboard/quiz" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Quizzes
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{quiz?.title?.en || "Quiz"}</h1>
          <p className="text-gray-600 dark:text-gray-400">{quiz?.description?.en || "Take this quiz to test your knowledge."}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{quiz?.totalQuestions}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Questions</div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{quiz?.durationMinutes}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Minutes</div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{quiz?.totalMarks}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Marks</div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{quiz?.marksPerQuestion}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Per Question</div>
          </div>
        </div>

        {quiz?.negativeMarking?.enabled && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Negative marking enabled: -{quiz?.negativeMarking?.marksPerWrongAnswer} marks for wrong answers
            </p>
          </div>
        )}

        {!quiz?.allowMultipleAttempts && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              ⚠️ You can only attempt this quiz once
            </p>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={starting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
        >
          {starting ? "Starting..." : "Start Quiz"}
        </button>
      </div>
    </div>
  );
}
