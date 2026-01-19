// src/services/server/exam.server.ts

import dbConnect from "@/lib/mongodb";
import EducationLevel from "@/models/mongoose/EducationLevel.schema";
import Exam from "@/models/mongoose/Exam.schema";
import { mapExamDTO } from "@/models/dto/exam.mapper";
import { getCurrentLang } from "@/lib/i18n";
/* =========================================================
   EXAM CATALOG (Grouped by Education Level)
   Used for /exams page
========================================================= */
export async function getExamCatalog() {
  const lang = getCurrentLang();
  await dbConnect();

  /* --------------------------------
     1. Fetch Education Levels
  --------------------------------- */
  const levels = await EducationLevel.find({
    isActive: true,
    isDeleted: false,
  })
    .sort({ order: 1 })
    .lean();

  /* --------------------------------
     2. Fetch Exams + SubExams
  --------------------------------- */
  const examsWithSubExams = await Exam.aggregate([
    {
      $match: {
        isActive: true,
        isDeleted: false,
        educationLevelId: { $exists: true, $ne: null },
      },
    },
    { $sort: { order: 1 } },

    {
      $lookup: {
        from: "subexams",
        localField: "_id",
        foreignField: "examId",
        as: "subExams",
        pipeline: [
          {
            $match: {
              isActive: true,
              isDeleted: false,
              isVisibleOnCard: true,
            },
          },
          { $sort: { order: 1 } },
        ],
      },
    },
  ]);

  /* --------------------------------
     3. Group Exams by Education Level
  --------------------------------- */
  return levels.map((level) => {
    const levelId = level._id.toString();

    const levelExams = examsWithSubExams.filter(
      (exam) => exam.educationLevelId?.toString() === levelId
    );

    return {
      educationLevelId: levelId,
      educationLevelName: level.name?.[lang] ?? level.name.en,
      educationLevelIcon: level.icon,
      educationLevelDescription: level.description?.[lang],

      exams: levelExams.map((exam) =>
        mapExamDTO(exam, exam.subExams ?? [], lang)
      ),
    };
  });
}

/* =========================================================
   EXAM LANDING LIST (Flat list)
   Used for Home Page
========================================================= */
export async function getExamLandingList() {
  const lang = getCurrentLang();

  await dbConnect();

  const examsWithSubExams = await Exam.aggregate([
    {
      $match: {
        isActive: true,
        isDeleted: false,
      },
    },
    { $sort: { order: 1 } },

    {
      $lookup: {
        from: "subexams",
        localField: "_id",
        foreignField: "examId",
        as: "subExams",
        pipeline: [
          {
            $match: {
              // isActive: true,
              isDeleted: false,
              isVisibleOnCard: true,
            },
          },
          { $sort: { order: 1 } },
        ],
      },
    },
  ]);
  return examsWithSubExams.map((exam) =>
    mapExamDTO(exam, exam.subExams ?? [], lang)
  );
}

/* =========================================================
   GET EXAM BY SLUG (Lightweight lookup)
========================================================= */
export async function getExamBySlug(examSlug: string) {
  await dbConnect();

  const exam = await Exam.findOne({
    slug: examSlug,
    isDeleted: false,
  })
    .select("_id name slug")
    .lean();

  if (!exam) {
    return {
      success: false,
      message: "Exam not found",
      data: null,
    };
  }

  return {
    success: true,
    message: "Exam found",
    data: exam,
  };
}
