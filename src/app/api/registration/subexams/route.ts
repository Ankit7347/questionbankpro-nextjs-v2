import { NextResponse } from "next/server";
import Exam from "@/models/mongoose/Exam.schema";
import SubExam from "@/models/mongoose/SubExam.schema";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();

    const subExams = await SubExam.find({ isActive: true })
      .populate({
        path: "examId",
        model: Exam,
        // 🔥 Added shortName to the selection so we can verify UG/PG accurately
        select: "name slug shortName",
      })
      .lean();

    const data = subExams.map((se) => {
      const exam = se.examId as any;
      if (!exam) return null; // Safety check if exam is missing

      let label = se.name?.en || exam.name?.en;

      // 1. Determine Level (UG/PG) based on Exam shortName
      let level = null;
      if (se.type === "program") {
        const examShort = exam.shortName?.en?.toUpperCase() || "";
        if (examShort === "UG") {
          level = "ug";
        } else if (examShort === "PG") {
          level = "pg";
        }
      }

      // 2. Format Label for SCHOOL
      if (se.type === "school" && se.class) {
        label = `${exam.name?.en} - Class ${se.class}`;
      }

      // 3. Format Label for COMPETITIVE
      if (se.type === "competitive") {
        const parts = [se.name?.en];
        if (se.year) parts.push(String(se.year));
        if (se.stream) parts.push(se.stream);
        label = parts.filter(Boolean).join(" ");
      }

      return {
        _id: se._id.toString(),
        type: se.type,
        label,
        board: se.type === "school" ? exam.slug : null,
        class: se.type === "school" ? se.class : null,
        level, // Returns "ug", "pg", or null
        subExamSlug:se.slug
      };
    }).filter(Boolean); // Filter out any null entries from safety check

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("[REG_SUBEXAMS]", e);
    return NextResponse.json(
      { success: false, message: "Failed" },
      { status: 500 }
    );
  }
}