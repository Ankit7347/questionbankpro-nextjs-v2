// src/services/server/exam.server.ts
import dbConnect from "@/lib/mongodb";
import EducationLevel from "@/models/mongoose/EducationLevel.schema";
import Exam from "@/models/mongoose/Exam.schema";
import Course from "@/models/mongoose/Course.schema";
import { mapExamCardDTO } from "@/models/dto/exam.mapper";

export async function getExamCatalog(lang: "en" | "hi") {
  await dbConnect();

  /* -----------------------------
     1. Education Levels
  ------------------------------ */
  const levels = await EducationLevel.find({
    isActive: true,
    isDeleted: false,
  })
    .sort({ order: 1 })
    .lean();

  /* -----------------------------
     2. Exams
  ------------------------------ */
  const exams = await Exam.find({
    isActive: true,
    isDeleted: false,
    educationLevelId: { $exists: true, $ne: null },
  })
    .sort({ order: 1 })
    .lean();

  /* -----------------------------
     3. Courses (IMPORTANT FIX)
     ✔ isActive
     ✔ isDeleted
     ✔ isVisibleOnCard
  ------------------------------ */
  const courses = await Course.find({
    isActive: true,
    isDeleted: false,
    isVisibleOnCard: true,
    examId: { $exists: true, $ne: null },
  })
    .sort({ order: 1 })
    .lean();

  /* -----------------------------
     4. Build catalog
  ------------------------------ */
  return levels.map((level) => {
    const levelId = level._id.toString();

    const levelExams = exams.filter(
      (exam) =>
        exam.educationLevelId?.toString() === levelId
    );

    return {
      educationLevelId: levelId,
      educationLevelName:
        level.name?.[lang] ?? level.name.en,

      // ✅ NEW (schema already supports this)
      educationLevelIcon: level.icon,
      educationLevelDescription:
        level.description?.[lang],

      exams: levelExams.map((exam) => {
        const examCourses = courses.filter(
          (course) =>
            course.examId?.toString() ===
            exam._id.toString()
        );

        return mapExamCardDTO(
          exam,
          examCourses,
          lang
        );
      }),
    };
  });
}
