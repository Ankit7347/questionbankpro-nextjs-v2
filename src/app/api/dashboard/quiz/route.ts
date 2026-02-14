import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/mongoose/User.schema";
import { getQuizzesBySubExam } from "@/services/server/quiz.service";
import { getUserSubmissions } from "@/services/server/quizSubmission.service";

async function resolveUser(req?: Request) {
  await dbConnect();
  const session = await auth();
  const headerUuid = req?.headers.get("x-user-id") || undefined;
  const userUuid = session?.user?.id || headerUuid;
  if (!userUuid) return null;
  const user = await User.findOne({ uuid: userUuid, isDeleted: false }).lean();
  return user || null;
}

export async function GET(req: NextRequest) {
  try {
    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const quizzes = await getQuizzesBySubExam(user.subExamId?.toString() || "");
    const submissions = await getUserSubmissions(user.uuid);

    const evaluatedSubmissions = submissions.filter((s: any) => s.status === "evaluated");
    const avgScore =
      evaluatedSubmissions.length > 0
        ? evaluatedSubmissions.reduce((sum: number, s: any) => sum + (s.percentageScore || 0), 0) / evaluatedSubmissions.length
        : 0;

    return NextResponse.json(
      {
        quizzes,
        submissions,
        stats: {
          totalQuizzes: quizzes.length,
          totalAttempts: submissions.length,
          averageScore: Math.round(avgScore * 100) / 100,
          lastAttempt: submissions[0]?.submittedAt,
          totalEvaluated: evaluatedSubmissions.length,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
