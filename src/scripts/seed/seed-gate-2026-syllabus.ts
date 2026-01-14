// src/seed/syllabus/seed-gate-2026-syllabus.ts

import { initSeed, closeSeed } from "./_helpers";
import Course from "../../models/mongoose/Course.schema";
import Syllabus from "../../models/mongoose/Syllabus.schema";
import Subject from "../../models/mongoose/Subject.schema";
import Chapter from "../../models/mongoose/Chapter.schema";
import Topic from "../../models/mongoose/Topic.schema";

async function seedGate2026Syllabus() {
  console.log("📘 Seeding GATE 2026 syllabus...");
  await initSeed();

  /* =======================
   * COURSE
   * ======================= */
  const course = await Course.findOne({
    slug: "gate-2026",
    isDeleted: false,
  });

  if (!course) {
    throw new Error("Course 'gate-2026' not found");
  }

  /* =======================
   * SYLLABUS (2026)
   * ======================= */
  const syllabus = await Syllabus.create({
    courseId: course._id,
    validFrom: 2026,
    validTo: null,
  });

  /* =======================
   * SUBJECT: Engineering Mathematics
   * ======================= */
  const mathSubject = await Subject.create({
    syllabusId: syllabus._id,
    name: "Engineering Mathematics",
    slug: "engineering-mathematics",
    order: 1,
    validFrom: 2026,
    validTo: null,
  });

  /* =======================
   * CHAPTER: Linear Algebra
   * ======================= */
  const linearAlgebra = await Chapter.create({
    subjectId: mathSubject._id,
    name: "Linear Algebra",
    slug: "linear-algebra",
    order: 1,
    validFrom: 2026,
    validTo: null,
  });

  /* =======================
   * TOPICS
   * ======================= */
  await Topic.insertMany([
    {
      chapterId: linearAlgebra._id,
      name: "Matrices",
      slug: "matrices",
      order: 1,
      difficulty: "medium",
      isCoreTopic: true,
      validFrom: 2026,
      validTo: null,
    },
    {
      chapterId: linearAlgebra._id,
      name: "Eigenvalues and Eigenvectors",
      slug: "eigenvalues-eigenvectors",
      order: 2,
      difficulty: "hard",
      isCoreTopic: true,
      validFrom: 2026,
      validTo: null,
    },
  ]);

  /* =======================
   * SUBJECT: General Aptitude
   * ======================= */
  const aptitudeSubject = await Subject.create({
    syllabusId: syllabus._id,
    name: "General Aptitude",
    slug: "general-aptitude",
    order: 2,
    validFrom: 2026,
    validTo: null,
  });

  /* =======================
   * CHAPTER: Verbal Ability
   * ======================= */
  const verbalChapter = await Chapter.create({
    subjectId: aptitudeSubject._id,
    name: "Verbal Ability",
    slug: "verbal-ability",
    order: 1,
    validFrom: 2026,
    validTo: null,
  });

  await Topic.insertMany([
    {
      chapterId: verbalChapter._id,
      name: "Reading Comprehension",
      slug: "reading-comprehension",
      order: 1,
      difficulty: "easy",
      isCoreTopic: true,
      validFrom: 2026,
      validTo: null,
    },
    {
      chapterId: verbalChapter._id,
      name: "Sentence Completion",
      slug: "sentence-completion",
      order: 2,
      difficulty: "easy",
      isCoreTopic: false,
      validFrom: 2026,
      validTo: null,
    },
  ]);

  await closeSeed();
  console.log("🎉 GATE 2026 syllabus seeding completed");
}

seedGate2026Syllabus().catch((err) => {
  console.error("❌ GATE 2026 syllabus seeding failed", err);
  process.exit(1);
});
