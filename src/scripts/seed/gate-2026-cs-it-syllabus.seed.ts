/**
 * Seed syllabus structure for:
 * /exams/gate-exam/gate-2026-cs-it
 *
 * Model chain:
 * SubExam → OfficialSyllabus → SubjectMap → ChapterMap → TopicMap
 */

import { initSeed, closeSeed } from "./_helpers";

import SubExam from "../../models/mongoose/SubExam.schema";
import OfficialSyllabus from "../../models/mongoose/OfficialSyllabus.schema";

import Subject from "../../models/mongoose/Subject.schema";
import Chapter from "../../models/mongoose/Chapter.schema";
import Topic from "../../models/mongoose/Topic.schema";

import SubjectMap from "../../models/mongoose/SubjectMap.schema";
import ChapterMap from "../../models/mongoose/ChapterMap.schema";
import TopicMap from "../../models/mongoose/TopicMap.schema";

const SYLLABUS_YEAR = 2026;

export async function seedGate2026CSITSyllabus() {
  console.log("🚀 Seeding syllabus: GATE 2026 CS & IT");

  await initSeed();
  console.log("🔌 DB connected");

  /* -------------------------------------------------
   * 1. SubExam
   * ------------------------------------------------- */
  const subExam = await SubExam.findOne({
    slug: "gate-2026-cs-it",
    isActive: true,
  });

  if (!subExam) {
    throw new Error("SubExam gate-2026-cs-it not found");
  }

  console.log("✅ SubExam found");

  /* -------------------------------------------------
   * 2. Official Syllabus
   * ------------------------------------------------- */
  const syllabus = await OfficialSyllabus.findOne({
    subExamId: subExam._id,
    isActive: true,
  });

  if (!syllabus) {
    throw new Error("Official syllabus not found");
  }

  console.log("✅ Official syllabus found");

  /* -------------------------------------------------
   * 3. Syllabus Tree
   * ------------------------------------------------- */
  const syllabusTree = [
    {
      subject: { name: "Operating Systems", slug: "operating-systems" },
      chapters: [
        {
          name: "Processes",
          slug: "processes",
          topics: [
            "Process States",
            "Process Control Block",
            "Context Switching",
          ],
        },
        {
          name: "CPU Scheduling",
          slug: "cpu-scheduling",
          topics: ["FCFS", "SJF", "Round Robin"],
        },
      ],
    },
    {
      subject: { name: "DBMS", slug: "dbms" },
      chapters: [
        {
          name: "Relational Model",
          slug: "relational-model",
          topics: ["Keys", "Integrity Constraints"],
        },
        {
          name: "Normalization",
          slug: "normalization",
          topics: ["1NF", "2NF", "3NF", "BCNF"],
        },
      ],
    },
  ];

  /* -------------------------------------------------
   * 4. Insert & Map
   * ------------------------------------------------- */
  for (const s of syllabusTree) {
    console.log(`📘 Subject: ${s.subject.name}`);

    /* ---------- Subject ---------- */
    const subject = await Subject.findOneAndUpdate(
      { slug: s.subject.slug },
      {
        name: { en: s.subject.name },
        slug: s.subject.slug,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    /* ---------- SubjectMap ---------- */
    const subjectMap = await SubjectMap.findOneAndUpdate(
      {
        syllabusId: syllabus._id,
        subjectId: subject._id,
      },
      {
        syllabusId: syllabus._id,
        subjectId: subject._id,
        validFrom: SYLLABUS_YEAR,
      },
      { upsert: true, new: true }
    );

    let chapterOrder = 1;

    for (const c of s.chapters) {
      console.log(`  📗 Chapter: ${c.name}`);

      /* ---------- Chapter ---------- */
      const chapter = await Chapter.findOneAndUpdate(
        { slug: c.slug },
        {
          name: { en: c.name },
          slug: c.slug,
          isActive: true,
        },
        { upsert: true, new: true }
      );

      /* ---------- ChapterMap ---------- */
      const chapterMap = await ChapterMap.findOneAndUpdate(
        {
          subjectMapId: subjectMap._id,
          chapterId: chapter._id,
        },
        {
          subjectMapId: subjectMap._id,
          chapterId: chapter._id,
          order: chapterOrder++,
          isOptional: false,
          isRemoved: false,
          validFrom: SYLLABUS_YEAR,
        },
        { upsert: true, new: true }
      );

      let topicOrder = 1;

      for (const topicName of c.topics) {
        const slug = topicName.toLowerCase().replace(/\s+/g, "-");

        /* ---------- Topic ---------- */
        const topic = await Topic.findOneAndUpdate(
          { slug },
          {
            name: { en: topicName },
            slug,
            isActive: true,
          },
          { upsert: true, new: true }
        );

        /* ---------- TopicMap ---------- */
        await TopicMap.findOneAndUpdate(
          {
            chapterMapId: chapterMap._id,
            topicId: topic._id,
          },
          {
            chapterMapId: chapterMap._id,
            topicId: topic._id,
            order: topicOrder++,
            validFrom: SYLLABUS_YEAR,
          },
          { upsert: true }
        );

        console.log(`    • Topic: ${topicName}`);
      }
    }
  }

  await closeSeed();
  console.log("🏁 Syllabus seed completed successfully");
}

/* -------------------------------------------------
 * Execute
 * ------------------------------------------------- */
seedGate2026CSITSyllabus().catch((err) => {
  console.error("❌ seedGate2026CSITSyllabus failed", err);
  process.exit(1);
});
