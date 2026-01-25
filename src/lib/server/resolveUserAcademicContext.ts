// src/lib/server/resolveUserAcademicContext.ts
import dbConnect from "@/lib/mongodb";
import { auth } from "@/lib/auth";

import User from "@/models/mongoose/User.schema";
import SubExam from "@/models/mongoose/SubExam.schema";
import Exam from "@/models/mongoose/Exam.schema";

import { BadRequest, NotFound } from "@/lib/apiError";

export interface UserAcademicContext {
  userId: string; // UUID

  exam: {
    id: string;
    slug: string;
  };

  subExam: {
    id: string;
    slug: string;
  };
}

export async function resolveUserAcademicContext(): Promise<UserAcademicContext> {
  await dbConnect();

  /* --------------------------------
     1. Resolve session (NextAuth)
  --------------------------------- */
  const session = await auth();

  if (!session?.user?.id) {
    throw BadRequest("Unauthenticated");
  }

  const userUuid = session.user.id;

  /* --------------------------------
     2. Resolve User by UUID
  --------------------------------- */
  const user = await User.findOne({
    uuid: userUuid,
    isDeleted: false,
  }).lean();

  if (!user) {
    throw NotFound("User not found");
  }

  /* --------------------------------
     3. Resolve active SubExam
  --------------------------------- */
  if (!user.activeSubExamId) {
    throw BadRequest("No active subExam selected");
  }

  const subExam = await SubExam.findOne({
    _id: user.activeSubExamId,
    isDeleted: false,
  }).lean();

  if (!subExam) {
    throw NotFound("SubExam not found");
  }

  /* --------------------------------
     4. Resolve Exam
  --------------------------------- */
  const exam = await Exam.findOne({
    _id: subExam.examId,
    isDeleted: false,
  })
    .select("slug")
    .lean();

  if (!exam) {
    throw NotFound("Exam not found");
  }

  /* --------------------------------
     5. Return canonical context
  --------------------------------- */
  return {
    userId: user.uuid, // UUID, not Mongo _id

    exam: {
      id: exam._id.toString(),
      slug: exam.slug,
    },

    subExam: {
      id: subExam._id.toString(),
      slug: subExam.slug,
    },
  };
}
