// src/services/server/examLanding.server.ts

import dbConnect from "@/lib/mongodb";
import Exam from "@/models/mongoose/Exam.schema";
import Course from "@/models/mongoose/Course.schema";
import { mapExamLandingDTO } from "@/models/dto/exam.mapper";


// export async function getExamLanding(
//   examSlug: string,
//   lang: "en" | "hi"
// ) {
//   await dbConnect();

//   const exam = await Exam.findOne({
//     slug: examSlug,
//     isDeleted: false,
//   }).lean();

//   if (!exam) return null;

//   const courses = await Course.find({
//     examId: exam._id,
//     isActive: true,
//     isDeleted: false,
//   })
//     .sort({ order: 1 })
//     .lean();

//   return mapExamLandingDTO(exam, courses, lang);
// }
export async function getExamLandingList(lang: "en" | "hi") {
  await dbConnect();

  const exams = await Exam.find({
    isActive: true,
    isDeleted: false,
  })
    .sort({ order: 1 })
    .lean();

  const courses = await Course.find({
    isActive: true,
    isDeleted: false,
    isVisibleOnCard: true,
    examId: { $exists: true },
  })
    .sort({ order: 1 })
    .lean();

  return exams.map((exam) => {
    const examCourses = courses.filter(
      (c) => c.examId?.toString() === exam._id.toString()
    );

    return mapExamLandingDTO(exam, examCourses, lang);
  });
}
