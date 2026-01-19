import dbConnect from "@/lib/mongodb";
import Exam from "@/models/mongoose/Exam.schema";
import SubExam from "@/models/mongoose/SubExam.schema";
import Subject from "@/models/mongoose/Subject.schema";
import OfficialSyllabus from "@/models/mongoose/OfficialSyllabus.schema";
import SubjectMap from "@/models/mongoose/SubjectMap.schema";
import { mapExamCourseOverviewDTO } from "@/models/dto/examCourse.mapper";
import { getCurrentLang } from "@/lib/i18n";

export async function getExamSubExamOverview(
  examSlug: string,
  subExamSlug: string
) {
  await dbConnect();
  const lang = getCurrentLang();

  /* -----------------------------
     1. Exam
  ------------------------------ */
  const exam = await Exam.findOne({
    slug: examSlug,
    isDeleted: false,
  }).lean();
  if (!exam) return null;

  /* -----------------------------
     2. SubExam (REPLACED Course)
  ------------------------------ */
  const subExam = await SubExam.findOne({
    slug: subExamSlug,
    examId: exam._id,
    isActive: true,
    isDeleted: false,
  }).lean();
  if (!subExam) return null;

  /* -----------------------------
     3. OfficialSyllabus (linked via subExamId)
  ------------------------------ */
  const syllabus = await OfficialSyllabus.findOne({
    subExamId: subExam._id, // ✅ CHANGED
    isActive: true,
    isDeleted: false,
  }).lean();

  if (!syllabus) {
    return mapExamCourseOverviewDTO(exam, subExam, [], lang);
  }

  /* -----------------------------
     4. Subject Mapping
  ------------------------------ */
  const subjectMaps = await SubjectMap.find({
    syllabusId: syllabus._id,
    isRemoved: false,
    isDeleted: false,
  })
    .sort({ order: 1 })
    .lean();

  if (!subjectMaps.length) {
    return mapExamCourseOverviewDTO(exam, subExam, [], lang);
  }

  /* -----------------------------
     5. Subjects lookup
  ------------------------------ */
  const subjectIds = subjectMaps.map((sm) => sm.subjectId);
  const subjects = await Subject.find({
    _id: { $in: subjectIds },
    isDeleted: false,
  }).lean();

  const subjectLookup = new Map(
    subjects.map((s) => [s._id.toString(), s])
  );

  /* -----------------------------
     6. Ordered Subjects (by map)
  ------------------------------ */
  const sortedSubjects = subjectMaps
    .map((sm) => {
      const subjectDoc = subjectLookup.get(sm.subjectId.toString());
      if (!subjectDoc) return null;

      return {
        ...subjectDoc,
        order: sm.order, // mapping-table order wins
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  /* -----------------------------
     7. DTO
  ------------------------------ */
  return mapExamCourseOverviewDTO(
    exam,
    subExam,        // ✅ was course
    sortedSubjects,
    lang
  );
}
