"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Play, Clock, CheckCircle } from "lucide-react";

export default function QuizDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/quiz");
        const data = await res.json();
        setStats(data.stats);
        setQuizzes(data.quizzes || []);
        setSubmissions(data.submissions || []);
      } catch (err) {
        console.error("Failed to fetch quiz data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Performance Analytics Card */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Performance</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats?.averageScore?.toFixed(1) || "0"}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Avg. Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats?.totalAttempts || 0}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats?.totalQuizzes || 0}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Available</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("available")}
          className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "available"
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Available Quizzes
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "history"
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          History
        </button>
      </div>

      {/* Available Quizzes */}
      {activeTab === "available" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Take a Quiz</h3>
          {quizzes.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">No quizzes available</div>
          ) : (
            quizzes.map((quiz: any) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{quiz.title?.en || "Untitled"}</h4>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {quiz.durationMinutes} min
                    </span>
                    <span>{quiz.totalQuestions} questions</span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-xs font-medium">
                      {quiz.quizType}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/dashboard/quiz/${quiz.id}/start`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition flex items-center justify-center"
                >
                  <Play className="w-4 h-4" />
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* History */}
      {activeTab === "history" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Submissions</h3>
          {submissions.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">No submissions yet</div>
          ) : (
            submissions.map((sub: any) => (
              <div
                key={sub.id}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 flex justify-between items-center"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Quiz #{sub.attemptNumber}</h4>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>
                      {new Date(sub.submittedAt || sub.startedAt).toLocaleDateString()}
                    </span>
                    <span className={sub.status === "evaluated" ? "text-green-600 dark:text-green-400 font-semibold" : "text-yellow-600"}>
                      {sub.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {sub.status === "evaluated" && (
                    <>
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {sub.percentageScore?.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {sub.correctAnswersCount}/{sub.totalQuestions || sub.answers?.length}
                      </div>
                    </>
                  )}
                  {sub.status === "in_progress" && (
                    <Link
                      href={`/dashboard/quiz/submission/${sub.id}/attempt`}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                    >
                      Resume
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
