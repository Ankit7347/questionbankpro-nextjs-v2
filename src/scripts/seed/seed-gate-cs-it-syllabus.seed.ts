/**
 * src/seed/syllabus/seed-gate-2026-cs-it-syllabus.ts
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
   * 1. COURSE
   * ======================= */
  const course = await Course.findOne({
    slug: "gate-2026-cs-it", // Updated to match your previous course seed
    isDeleted: false,
  });

  if (!course) {
    console.error("❌ Course 'gate-2026-cs-it' not found. Please seed courses first.");
    await closeSeed();
    return;
  }

  /* =======================
   * 2. SYLLABUS
   * ======================= */
  let syllabus = await Syllabus.findOne({ courseId: course._id, year: 2026 });
  if (!syllabus) {
    syllabus = await Syllabus.create({
      courseId: course._id,
      year: 2026,
      validFrom: 2026,
      validTo: null,
      isActive: true,
      name: { en: "GATE 2026 CS Syllabus", hi: "गेट 2026 सीएस सिलेबस" }
    });
    console.log("✅ Syllabus created");
  } else {
    console.log("⏭️ Skipping: Syllabus 2026 already exists");
  }

  /* =======================
   * 3. SUBJECT (CONTENT)
   * ======================= */
  const math = await Subject.findOneAndUpdate(
    { slug: "engineering-mathematics" },
    {
      $setOnInsert: {
        name: { en: "Engineering Mathematics", hi: "इंजीनियरिंग गणित" },
        slug: "engineering-mathematics",
      }
    },
    { upsert: true, new: true }
  );

  /* =======================
   * 4. SUBJECT MAP
   * ======================= */
  let mathMap = await SubjectMap.findOne({ syllabusId: syllabus._id, subjectId: math._id });
  if (!mathMap) {
    mathMap = await SubjectMap.create({
      syllabusId: syllabus._id,
      subjectId: math._id,
      order: 10,
      validFrom: 2026,
      validTo: null,
    });
    console.log("✅ Subject Map (Math) created");
  } else {
    console.log("⏭️ Skipping: Subject Map (Math) already exists");
  }

  /* =======================
   * 5. CHAPTER (CONTENT)
   * ======================= */
  const linearAlgebra = await Chapter.findOneAndUpdate(
    { slug: "linear-algebra" },
    {
      $setOnInsert: {
        name: { en: "Linear Algebra", hi: "रैखिक बीजगणित" },
        slug: "linear-algebra",
      }
    },
    { upsert: true, new: true }
  );

  /* =======================
   * 6. CHAPTER MAP
   * ======================= */
  let linearAlgebraMap = await ChapterMap.findOne({ subjectMapId: mathMap._id, chapterId: linearAlgebra._id });
  if (!linearAlgebraMap) {
    linearAlgebraMap = await ChapterMap.create({
      subjectMapId: mathMap._id,
      chapterId: linearAlgebra._id,
      order: 10,
      validFrom: 2026,
      validTo: null,
    });
    console.log("✅ Chapter Map (Linear Algebra) created");
  } else {
    console.log("⏭️ Skipping: Chapter Map (Linear Algebra) already exists");
  }

  /* =======================
   * 7. TOPICS (CONTENT)
   * ======================= */
  const topicsData = [
    { slug: "matrices", nameEn: "Matrices", nameHi: "आव्यूह", diff: "medium" },
    { slug: "eigenvalues-eigenvectors", nameEn: "Eigenvalues and Eigenvectors", nameHi: "आइगेन मान और आइगेन वेक्टर", diff: "hard" }
  ];

  for (const t of topicsData) {
    const topicDoc = await Topic.findOneAndUpdate(
      { slug: t.slug },
      {
        $setOnInsert: {
          name: { en: t.nameEn, hi: t.nameHi },
          slug: t.slug,
          difficulty: t.diff,
        }
      },
      { upsert: true, new: true }
    );

    /* =======================
     * 8. TOPIC MAP
     * ======================= */
    const existingTopicMap = await TopicMap.findOne({ 
      chapterMapId: linearAlgebraMap._id, 
      topicId: topicDoc._id 
    });

    if (!existingTopicMap) {
      await TopicMap.create({
        chapterMapId: linearAlgebraMap._id,
        topicId: topicDoc._id,
        order: (topicsData.indexOf(t) + 1) * 10,
        validFrom: 2026,
        validTo: null,
      });
      console.log(`✅ Topic Map (${t.slug}) created`);
    } else {
      console.log(`⏭️ Skipping: Topic Map (${t.slug}) already exists`);
    }
  }

  await closeSeed();
  console.log("🏁 GATE 2026 CS syllabus seeding process finished");
}

seedGate2026CsSyllabus().catch(console.error);