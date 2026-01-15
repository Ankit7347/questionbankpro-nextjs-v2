/**
 * src/seed/syllabus/seed-gate-2026-cs-syllabus.ts
 */

import { initSeed, closeSeed } from "./_helpers";

import Course from "../../models/mongoose/Course.schema";
import Syllabus from "../../models/mongoose/Syllabus.schema";

import Subject from "../../models/mongoose/Subject.schema";
import Chapter from "../../models/mongoose/Chapter.schema";
import Topic from "../../models/mongoose/Topic.schema";

import SubjectMap from "../../models/mongoose/SubjectMap.schema";
import ChapterMap from "../../models/mongoose/ChapterMap.schema";
import TopicMap from "../../models/mongoose/TopicMap.schema";

async function seedGate2026CsSyllabus() {
  console.log("📘 Seeding GATE 2026 CS syllabus...");
  await initSeed();

  /* =======================
   * COURSE
   * ======================= */
  const course = await Course.findOne({
    slug: "gate-2026-cs",
    isDeleted: false,
  });

  if (!course) throw new Error("Course not found");

  /* =======================
   * SYLLABUS
   * ======================= */
  const syllabus = await Syllabus.create({
    courseId: course._id,
    year:2026,
    validFrom: 2026,
    validTo: null,
    isActive: true,
  });

  /* =======================
   * SUBJECT (CONTENT)
   * ======================= */
  const math = await Subject.findOneAndUpdate(
    { slug: "engineering-mathematics" },
    {
      name: "Engineering Mathematics",
      slug: "engineering-mathematics",
    },
    { upsert: true, new: true }
  );

  /* =======================
   * SUBJECT MAP
   * ======================= */
  const mathMap = await SubjectMap.create({
    syllabusId: syllabus._id,
    subjectId: math._id,
    order: 10,
    validFrom: 2026,
    validTo: null,
  });

  /* =======================
   * CHAPTER (CONTENT)
   * ======================= */
  const linearAlgebra = await Chapter.findOneAndUpdate(
    { slug: "linear-algebra" },
    {
      name: "Linear Algebra",
      slug: "linear-algebra",
    },
    { upsert: true, new: true }
  );

  /* =======================
   * CHAPTER MAP
   * ======================= */
  const linearAlgebraMap = await ChapterMap.create({
    subjectMapId: mathMap._id,
    chapterId: linearAlgebra._id,
    order: 10,
    validFrom: 2026,
    validTo: null,
  });

  /* =======================
   * TOPICS (CONTENT)
   * ======================= */
  const matrices = await Topic.findOneAndUpdate(
    { slug: "matrices" },
    {
      name: "Matrices",
      slug: "matrices",
      difficulty: "medium",
    },
    { upsert: true, new: true }
  );

  const eigen = await Topic.findOneAndUpdate(
    { slug: "eigenvalues-eigenvectors" },
    {
      name: "Eigenvalues and Eigenvectors",
      slug: "eigenvalues-eigenvectors",
      difficulty: "hard",
    },
    { upsert: true, new: true }
  );

  /* =======================
   * TOPIC MAP
   * ======================= */
  await TopicMap.insertMany([
    {
      chapterMapId: linearAlgebraMap._id,
      topicId: matrices._id,
      order: 10,
      validFrom: 2026,
      validTo: null,
    },
    {
      chapterMapId: linearAlgebraMap._id,
      topicId: eigen._id,
      order: 20,
      validFrom: 2026,
      validTo: null,
    },
  ]);

  await closeSeed();
  console.log("🎉 GATE 2026 CS syllabus seeded correctly");
}

seedGate2026CsSyllabus().catch(console.error);
