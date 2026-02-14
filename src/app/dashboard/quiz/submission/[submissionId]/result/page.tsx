"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.submissionId as string;

  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        const res = await fetch(`/api/dashboard/quiz/submission/${submissionId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setSubmission(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSubmission();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">Result not found</p>
        <Link href="/dashboard/quiz" className="text-indigo-600 hover:underline mt-4 inline-block">
          Back to Quizzes
        </Link>
      </div>
    );
  }

  const isPassed = submission.percentageScore >= 50;

  return (
    <div className="p-4 pb-20 space-y-6">
      <Link href="/dashboard/quiz" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Quizzes
      </Link>

      {/* Score Card */}
      <div className={`rounded-2xl p-8 text-center space-y-6 ${isPassed ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" : "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20"}`}>
        <div>
          {isPassed ? (
            <CheckCircle className="w-24 h-24 text-green-600 dark:text-green-400 mx-auto mb-4" />
          ) : (
            <XCircle className="w-24 h-24 text-red-600 dark:text-red-400 mx-auto mb-4" />
          )}
          <h1 className={`text-3xl font-bold ${isPassed ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
            {isPassed ? "Great Job!" : "Try Again"}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {submission.percentageScore?.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Score</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {submission.totalMarksObtained}/{submission.totalMarksMaximum}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Marks</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-green-700 dark:text-green-300">{submission.correctAnswersCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Correct</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
          <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-red-700 dark:text-red-300">{submission.wrongAnswersCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Wrong</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
          <HelpCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{submission.unattemptedCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Skipped</div>
        </div>
      </div>

      {/* Time Spent */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Time Spent</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {Math.floor(submission.timeSpentSeconds / 60)}m {submission.timeSpentSeconds % 60}s
          </span>
        </div>
      </div>

      {/* Answer Breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Answer Review</h3>
        <div className="space-y-2">
          {(submission.answers || []).map((ans: any, idx: number) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 ${
                ans.isCorrect
                  ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                  : "bg-red-50 dark:bg-red-900/20 border-red-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Question {idx + 1}</div>
                  <div className={`text-xs font-semibold mt-1 ${ans.isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                    {ans.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{ans.marksAwarded}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/dashboard/quiz"
          className="block bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-lg text-center transition"
        >
          Back to Quizzes
        </Link>
        <button
          onClick={() => router.push(`/dashboard/quiz`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Try Another Quiz
        </button>
      </div>
    </div>
  );
}
