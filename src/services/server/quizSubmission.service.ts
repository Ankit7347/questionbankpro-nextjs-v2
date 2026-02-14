// src/services/server/quizSubmission.service.ts
import { isValidObjectId } from "mongoose";
import QuizSubmission from "@/models/mongoose/QuizSubmission.schema";
import { mapQuizSubmission } from "@/models/dto/quizSubmission.mapper";
import { notDeleted, toObjectId } from "./helpers";
import dbConnect from "@/lib/mongodb";

/** Start a new quiz attempt */
export async function startQuizAttempt(userId: string, quizId: string, totalMarks: number) {
  await dbConnect();
  // count previous attempts for this user+quiz
  const prevCount = await QuizSubmission.countDocuments({
    userId,
    quizId,
    ...notDeleted,
  });

  const doc = await QuizSubmission.create({
    userId,
    quizId,
    attemptNumber: prevCount + 1,
    totalMarksMaximum: totalMarks,
    status: "in_progress",
  });

  return mapQuizSubmission(doc);
}

/** Submit answers for a quiz */
export async function submitQuizAnswers(submissionId: string, answers: any[]) {
  await dbConnect();

  const formattedAnswers = answers.map((ans) => ({
    ...ans,
    questionId: ans.questionId && isValidObjectId(ans.questionId) ? toObjectId(ans.questionId) : undefined,
    selectedOptionId: ans.selectedOptionId && isValidObjectId(ans.selectedOptionId) ? toObjectId(ans.selectedOptionId) : undefined,
  }));

  const doc = await QuizSubmission.findByIdAndUpdate(
    toObjectId(submissionId),
    {
      $set: {
        answers: formattedAnswers,
        submittedAt: new Date(),
        status: "submitted",
      },
    },
    { new: true }
  ).lean();

  return doc ? mapQuizSubmission(doc) : null;
}

/** Evaluate submission and calculate score */
export async function evaluateSubmission(submissionId: string) {
  await dbConnect();
  const submission = await QuizSubmission.findById(submissionId).populate("answers.questionId").lean();
  if (!submission) return null;

  let totalMarks = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  const evaluatedAnswers = (submission.answers || []).map((ans: any) => {
    const question = ans.questionId;
    if (!ans.selectedOptionId && !ans.answerText) {
      unattemptedCount++;
      return { ...ans, isCorrect: false, marksAwarded: 0 };
    }

    // For MCQ check if selected option is correct
    const isCorrect =
      !question || question.options?.some((opt: any) => opt._id?.toString() === ans.selectedOptionId && opt.isCorrect);

    if (isCorrect) {
      correctCount++;
      totalMarks += question?.marks || 1;
      return { ...ans, isCorrect: true, marksAwarded: question?.marks || 1 };
    } else {
      wrongCount++;
      return { ...ans, isCorrect: false, marksAwarded: 0 };
    }
  });

  const timeSpent = submission.submittedAt
    ? Math.floor((new Date(submission.submittedAt).getTime() - new Date(submission.startedAt).getTime()) / 1000)
    : 0;

  const updatedDoc = await QuizSubmission.findByIdAndUpdate(
    submissionId,
    {
      $set: {
        answers: evaluatedAnswers,
        totalMarksObtained: totalMarks,
        correctAnswersCount: correctCount,
        wrongAnswersCount: wrongCount,
        unattemptedCount,
        percentageScore: submission.totalMarksMaximum ? (totalMarks / submission.totalMarksMaximum) * 100 : 0,
        timeSpentSeconds: timeSpent,
        status: "evaluated",
      },
    },
    { new: true }
  ).lean();

  return updatedDoc ? mapQuizSubmission(updatedDoc) : null;
}

/** Get all submissions for a user */
export async function getUserSubmissions(userId: string) {
  await dbConnect();
  const docs = await QuizSubmission.find({
    userId,
    ...notDeleted,
  })
    .sort({ submittedAt: -1 })
    .lean();
  return docs.map(mapQuizSubmission);
}

/** Get submissions for a specific quiz */
export async function getQuizSubmissions(quizId: string) {
  await dbConnect();
  const docs = await QuizSubmission.find({
    quizId,
    status: "evaluated",
    ...notDeleted,
  })
    .sort({ submittedAt: -1 })
    .lean();
  return docs.map(mapQuizSubmission);
}

/** Get a specific submission */
export async function getSubmission(submissionId: string) {
  await dbConnect();
  const doc = await QuizSubmission.findOne({
    _id: submissionId,
    ...notDeleted,
  }).lean();
  return doc ? mapQuizSubmission(doc) : null;
}
