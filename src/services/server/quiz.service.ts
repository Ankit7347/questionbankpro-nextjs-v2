// src/services/quiz.service.ts

import Quiz from "@/models/mongoose/Quiz.schema";
import "@/models/mongoose/Question.schema"; // Ensure Question model is registered
import { mapQuiz } from "@/models/dto/quiz.mapper";
import { notDeleted } from "./helpers";
import dbConnect from "@/lib/mongodb";

/** Get all published quizzes for a subexam */
export async function getQuizzesBySubExam(subExamId: string) {
  await dbConnect();
  const docs = await Quiz.find({
    subExamId,
    isPublished: true,
    ...notDeleted,
  })
    .sort({ displayOrder: 1 })
    .lean();
  return docs.map(mapQuiz);
}

/** Get quizzes at specific level (topic/chapter/subject/full_syllabus) */
export async function getQuizzesByType(
  subExamId: string,
  quizType: string,
  filterIds?: Partial<{ subjectId: string; chapterId: string; topicId: string }>
) {
  const filter: any = {
    subExamId,
    quizType,
    isPublished: true,
    ...notDeleted,
  };

  if (filterIds?.subjectId) filter.subjectId = filterIds.subjectId;
  if (filterIds?.chapterId) filter.chapterId = filterIds.chapterId;
  if (filterIds?.topicId) filter.topicId = filterIds.topicId;
  await dbConnect();
  const docs = await Quiz.find(filter)
    .sort({ displayOrder: 1 })
    .lean();
  return docs.map(mapQuiz);
}

/** Get a single quiz by ID */
export async function getQuizById(quizId: string) {
  try {
    await dbConnect();
    const doc = await Quiz.findOne({
      _id: quizId,
      isPublished: true,
      ...notDeleted,
    })
      .populate("questionIds");
    
    return doc ? mapQuiz(doc.toObject ? doc.toObject() : doc) : null;
  } catch (err) {
    console.error("Error fetching quiz by ID:", err);
    return null;
  }
}

/** Create a new quiz (admin) */
export async function createQuiz(payload: any) {
  await dbConnect();
  const doc = await Quiz.create(payload);
  return mapQuiz(doc);
}

/** Update quiz (admin) */
export async function updateQuiz(quizId: string, updates: any) {
  await dbConnect();
  const doc = await Quiz.findByIdAndUpdate(quizId, { $set: updates }, { new: true }).lean();
  return doc ? mapQuiz(doc) : null;
}
