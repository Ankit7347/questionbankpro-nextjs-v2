/**
 * src/seed/exam/seed-gate-cs-exam-course.ts
 */

import { initSeed, closeSeed } from "./_helpers";
import Exam from "../../models/mongoose/Exam.schema";
import Course from "../../models/mongoose/Course.schema";

async function seedGateCsExamAndCourse() {
  console.log("📘 Seeding GATE CS exam & course...");
  await initSeed();

  /* =======================
   * EXAM
   * ======================= */
  const exam = await Exam.findOneAndUpdate(
    { slug: "gate" },
    {
      name: { en: "Graduate Aptitude Test in Engineering" },
      slug: "gate",
    },
    { upsert: true, new: true }
  );

  /* =======================
   * COURSE
   * ======================= */
  await Course.findOneAndUpdate(
    { slug: "gate-2026-cs" },
    {
      examId: exam._id,
      name: { en: "GATE 2026 – Computer Science" },
      slug: "gate-2026-cs",
    },
    { upsert: true, new: true }
  );

  await closeSeed();
  console.log("✅ GATE CS exam & course seeded");
}

seedGateCsExamAndCourse().catch(console.error);
