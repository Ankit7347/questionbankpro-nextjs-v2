// src/app/api/dashboard/quiz/submission/[submissionId]/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { submitQuizAnswers, evaluateSubmission } from "@/services/server/quizSubmission.service";

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
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const userUuid = await resolveUser(req);
    if (!userUuid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { submissionId } = await params;
    const body = await req.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
    }

    // submit answers
    await submitQuizAnswers(submissionId, answers);

    // auto-evaluate
    const evaluated = await evaluateSubmission(submissionId);

    return NextResponse.json(evaluated, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
