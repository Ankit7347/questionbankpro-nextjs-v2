"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

export default function QuizAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params.submissionId as string;

  const [submission, setSubmission] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load submission and quiz details
  useEffect(() => {
    const loadData = async () => {
      try {
        const subRes = await fetch(`/api/dashboard/quiz/submission/${submissionId}`);
        const subData = await subRes.json();
        setSubmission(subData);

        // Mock: fetch quiz with questions (ideally via submission.quizId)
        // For now show placeholder questions
        setQuestions([
          {
            id: "q1",
            questionId: "q1",
            content: { en: "What is the SI unit of force?" },
            type: "MCQ",
            options: [
              { id: "opt1", text: { en: "Newton" }, isCorrect: true },
              { id: "opt2", text: { en: "Joule" } },
              { id: "opt3", text: { en: "Pascal" } },
              { id: "opt4", text: { en: "Hertz" } },
            ],
          },
          {
            id: "q2",
            questionId: "q2",
            content: { en: "Define velocity." },
            type: "MCQ",
            options: [
              { id: "opt1", text: { en: "Rate of change of distance" } },
              { id: "opt2", text: { en: "Rate of change of displacement" }, isCorrect: true },
              { id: "opt3", text: { en: "Distance covered per unit time" } },
              { id: "opt4", text: { en: "Final velocity minus initial velocity" } },
            ],
          },
        ]);

        setQuiz({ totalMarks: 10, durationMinutes: 15 });
        setTimeLeft(15 * 60); // 15 minutes in seconds
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [submissionId]);

  // Timer countdown
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => (t ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto submit when time ends
  useEffect(() => {
    if (timeLeft === 0 && !submitting) {
      handleSubmit();
    }
  }, [timeLeft, submitting]);

  const handleSelectAnswer = (qId: string, optId: string) => {
    setAnswers((prev: any) => ({ ...prev, [qId]: optId }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answerPayload = questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] || null,
      }));

      const res = await fetch(`/api/dashboard/quiz/submission/${submissionId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answerPayload }),
      });

      if (!res.ok) throw new Error("Submit failed");
      router.push(`/dashboard/quiz/submission/${submissionId}/result`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const q = questions[currentQ];
  const selectedOpt = answers[q?.id];

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Header with timer */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQ + 1} of {questions.length}
          </div>
        </div>
        <div className={`text-lg font-bold ${timeLeft && timeLeft <= 60 ? "text-red-600 dark:text-red-400" : "text-green-600"}`}>
          {timeLeft ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}` : "Time's up!"}
        </div>
      </div>

      {/* Question */}
      {q && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{q.content.en}</h2>

            {/* Options */}
            <div className="space-y-2">
              {q.options?.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer(q.id, opt.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedOpt === opt.id
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400"
                      : "border-gray-200 dark:border-slate-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedOpt === opt.id
                          ? "border-indigo-600 bg-indigo-600 dark:border-indigo-400 dark:bg-indigo-400"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedOpt === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-gray-900 dark:text-white">{opt.text.en}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation & Submit */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-4 flex justify-between items-center gap-4">
        <button
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg disabled:opacity-50 text-gray-900 dark:text-white"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentQ + 1} / {questions.length}
        </div>

        {currentQ === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg"
          >
            <Send className="w-4 h-4" /> {submitting ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
