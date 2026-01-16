import dbConnect from "@/lib/mongodb";
import Exam from "@/models/mongoose/Exam.schema";
import Course from "@/models/mongoose/Course.schema";
import Subject from "@/models/mongoose/Subject.schema";
import Syllabus from "@/models/mongoose/Syllabus.schema";
import SubjectMap from "@/models/mongoose/SubjectMap.schema";
import { mapExamCourseOverviewDTO } from "@/models/dto/examCourse.mapper";
import { getCurrentLang } from "@/lib/i18n";

export async function getExamCourseOverview(
  examSlug: string,
  courseSlug: string
) {
  await dbConnect();
  const lang = getCurrentLang();
  const exam = await Exam.findOne({ slug: examSlug, isDeleted: false }).lean();
  if (!exam) return null;

  const course = await Course.findOne({
    slug: courseSlug,
    examId: exam._id,
    isActive: true,
    isDeleted: false,
  }).lean();
  if (!course) return null;

  const syllabus = await Syllabus.findOne({
    courseId: course._id,
    isActive: true,
    isDeleted: false,
  }).lean();

  if (!syllabus) {
    return mapExamCourseOverviewDTO(exam, course, [], lang);
  }

  // 1. Get the mapping structure
  const subjectMaps = await SubjectMap.find({
    syllabusId: syllabus._id,
    isRemoved: false,
    isDeleted: false,
  })
    .sort({ order: 1 })
    .lean();

  if (!subjectMaps.length) {
    return mapExamCourseOverviewDTO(exam, course, [], lang);
  }

  // 2. Fetch Subjects and create a lookup Map for speed
  const subjectIds = subjectMaps.map((sm) => sm.subjectId);
  const subjects = await Subject.find({
    _id: { $in: subjectIds },
    isDeleted: false,
  }).lean();
  const subjectLookup = new Map(
    subjects.map((s) => [s._id.toString(), s])
  );

  // 3. Construct the list following the Mapper's requirements
  const sortedSubjects = subjectMaps
    .map((sm) => {
      const subjectDoc = subjectLookup.get(sm.subjectId.toString());
      if (!subjectDoc) return null;

      // We transform the Mongoose doc to match the Mapper's expected 'subjects' array
      return {
        ...subjectDoc,
        order: sm.order,               // Use the order from the mapping table
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);
  return mapExamCourseOverviewDTO(
    exam,
    course,
    sortedSubjects, // TypeScript is now happy because 'id' exists
    lang
  );
}