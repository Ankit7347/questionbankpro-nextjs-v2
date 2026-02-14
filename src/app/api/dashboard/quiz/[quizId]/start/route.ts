// src/app/api/dashboard/quiz/[quizId]/start/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/mongoose/User.schema";
import { getQuizById } from "@/services/server/quiz.service";
import { startQuizAttempt } from "@/services/server/quizSubmission.service";

async function resolveUser(req?: Request) {
  await dbConnect();
  const session = await auth();
  const headerUuid = req?.headers.get("x-user-id") || undefined;
  const userUuid = session?.user?.id || headerUuid;
  if (!userUuid) return null;
  return userUuid;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const userUuid = await resolveUser(req);
    if (!userUuid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { quizId } = await params;
    const quiz = await getQuizById(quizId);
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    const submission = await startQuizAttempt(userUuid, quizId, quiz.totalMarks || 0);
    return NextResponse.json(submission, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
