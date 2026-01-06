import { initSeed, closeSeed } from "./_helpers";
import Exam from "../../models/mongoose/Exam.schema";
import Course from "../../models/mongoose/Course.schema";
interface ICourseSeed {
  name: string;
  slug: string;
  order: number;
  classRange?: string;
  durationYears?: number;
  totalSemesters?: number;
  stream?: string;
}

const COURSES = [
  {
    examSlug: "cbse-board",
    courses: [
      { name: "Class 6", slug: "class-6", order: 1, classRange: "6" },
      { name: "Class 7", slug: "class-7", order: 2, classRange: "7" },
      { name: "Class 8", slug: "class-8", order: 3, classRange: "8" },
      { name: "Class 9", slug: "class-9", order: 4, classRange: "9" },
      { name: "Class 10", slug: "class-10", order: 5, classRange: "10" },
      { name: "Class 11", slug: "class-11", order: 6, classRange: "11" },
      { name: "Class 12", slug: "class-12", order: 7, classRange: "12" },
    ],
  },
    /* =======================
    * UNDERGRADUATE COURSES
    * ======================= */
    {
    examSlug: "undergraduate-programs",
    courses: [
        { name: "BA", slug: "ba", order: 1, durationYears: 3, stream: "Arts" },
        { name: "BSc", slug: "bsc", order: 2, durationYears: 3, stream: "Science" },
        { name: "BCom", slug: "bcom", order: 3, durationYears: 3, stream: "Commerce" },
        { name: "BTech", slug: "btech", order: 4, durationYears: 4, stream: "Engineering" },
        { name: "MBBS", slug: "mbbs", order: 5, durationYears: 5, stream: "Medical" },
        { name: "LLB", slug: "llb", order: 6, durationYears: 3, stream: "Law" },
    ],
    },

    /* =======================
    * POSTGRADUATE COURSES
    * ======================= */
    {
    examSlug: "postgraduate-programs",
    courses: [
        { name: "MA", slug: "ma", order: 1, durationYears: 2, stream: "Arts" },
        { name: "MSc", slug: "msc", order: 2, durationYears: 2, stream: "Science" },
        { name: "MCom", slug: "mcom", order: 3, durationYears: 2, stream: "Commerce" },
        { name: "MBA", slug: "mba", order: 4, durationYears: 2, stream: "Management" },
        { name: "MTech", slug: "mtech", order: 5, durationYears: 2, stream: "Engineering" },
        { name: "LLM", slug: "llm", order: 6, durationYears: 2, stream: "Law" },
    ],
    },

  {
    examSlug: "engineering-entrance",
    courses: [
      { name: "JEE Main", slug: "jee-main", order: 1 },
      { name: "JEE Advanced", slug: "jee-advanced", order: 2 },
      { name: "BITSAT", slug: "bitsat", order: 3 },
    ],
  },
  {
    examSlug: "medical-entrance",
    courses: [
      { name: "NEET UG", slug: "neet-ug", order: 1 },
      { name: "AIIMS", slug: "aiims", order: 2 },
    ],
  },
  {
    examSlug: "banking-exams",
    courses: [
      { name: "IBPS PO", slug: "ibps-po", order: 1 },
      { name: "SBI PO", slug: "sbi-po", order: 2 },
    ],
  },
];

async function seedCourses() {
  console.log("📗 Seeding courses...");
  await initSeed();

  for (const block of COURSES) {
    const exam = await Exam.findOne({
      slug: block.examSlug,
      isDeleted: false,
    });

    if (!exam) {
      console.warn(`⚠️ Exam not found: ${block.examSlug}`);
      continue;
    }

    for (const course of block.courses as ICourseSeed[])  {
      await Course.create({
        name: { en: course.name },
        slug: course.slug,
        examId: exam._id,

        description: {
          en: "Course with structured syllabus and practice material.",
          hi: "संरचित पाठ्यक्रम और अभ्यास सामग्री के साथ कोर्स।",
        },

        // Dynamics fields: Use data from the object or default to null/General
        durationYears: course?.durationYears ?? null,
        totalSemesters: course?.totalSemesters ?? null,
        classRange: course?.classRange ?? null,
        stream: course?.stream ?? "General",

        icon: "fa-solid fa-book-open",

        badge: {
          en: "Popular",
          hi: "लोकप्रिय",
        },

        order: course.order,
        isVisibleOnCard: true,
        isActive: true,
      });
    }
  }

  await closeSeed();
  console.log("✅ Course seeding completed");
}

seedCourses().catch((err) => {
  console.error("❌ Course seeding failed", err);
  process.exit(1);
});
