// src/app/api/dashboard/quiz/submission/[submissionId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSubmission } from "@/services/server/quizSubmission.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await params;
    const submission = await getSubmission(submissionId);

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json(submission, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
