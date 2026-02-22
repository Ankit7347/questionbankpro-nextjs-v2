import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BestBook from "@/models/mongoose/BestBook.schema";
import Exam from "@/models/mongoose/Exam.schema";
import SubExam from "@/models/mongoose/SubExam.schema";
import Subject from "@/models/mongoose/Subject.schema"; // Assuming Subject model exists
import { auth } from "@/lib/auth";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const recommended = searchParams.get("recommended") === "true";

    // ---------------------------------------------------------
    // ACTION: METADATA (For Filters)
    // ---------------------------------------------------------
    if (action === "metadata") {
      const [exams, subExams, subjects] = await Promise.all([
        Exam.find({ isActive: true }).select("name slug -_id").lean(),
        SubExam.find({ isActive: true })
          .select("name slug examId -_id")
          .populate({ path: "examId", select: "slug -_id" })
          .lean(),
        Subject.find({ isActive: true })
          .select("name slug subExamId -_id")
          .populate({ path: "subExamId", select: "slug -_id" })
          .lean(),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          exams,
          subExams: subExams.map((s: any) => ({
            name: s.name,
            slug: s.slug,
            examSlug: s.examId?.slug,
          })),
          subjects: subjects.map((s: any) => ({
            name: s.name,
            slug: s.slug,
            subExamSlug: s.subExamId?.slug,
          })),
        },
      });
    }

    // ---------------------------------------------------------
    // ACTION: LIST BOOKS
    // ---------------------------------------------------------
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const examSlug = searchParams.get("examSlug");
    const subExamSlug = searchParams.get("subExamSlug");
    const subjectSlug = searchParams.get("subjectSlug");
    const tags = searchParams.get("tags");

    const query: any = {
      isActive: true,
    };

    // ---------------------------------------------------------
    // FILTER LOGIC
    // ---------------------------------------------------------
    if (recommended) {
      const session = await auth();
      if (session?.user?.subExamId && Types.ObjectId.isValid(session.user.subExamId)) {
        query.subExamId = new Types.ObjectId(session.user.subExamId);
      }
    } else {
      if (examSlug) {
        const exam = await Exam.findOne({ slug: examSlug }).select("_id");
        if (exam) query.examId = exam._id;
      }
      if (subExamSlug) {
        const subExam = await SubExam.findOne({ slug: subExamSlug }).select("_id");
        if (subExam) query.subExamId = subExam._id;
      }
      if (subjectSlug) {
        const subject = await Subject.findOne({ slug: subjectSlug }).select("_id");
        if (subject) query.subjectId = subject._id;
      }
    }

    // Search (Title or Author)
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
      ];
    }

    // Tags
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      if (tagList.length > 0) {
        query.tags = { $in: tagList };
      }
    }

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      BestBook.find(query)
        .populate("examId", "name slug")
        .populate("subExamId", "name slug")
        .populate("subjectId", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BestBook.countDocuments(query),
    ]);

    // Map to clean DTO
    const data = books.map((book: any) => ({
      id: book._id,
      title: book.title,
      author: book.author,
      imageUrl: book.imageUrl,
      description: book.description,
      tags: book.tags,
      exam: book.examId?.name?.en || book.examId?.name,
      subExam: book.subExamId?.name?.en || book.subExamId?.name,
      subject: book.subjectId?.name?.en || book.subjectId?.name,
      examSlug: book.examId?.slug,
      subExamSlug: book.subExamId?.slug,
      subjectSlug: book.subjectId?.slug,
    }));

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("BestBook API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
