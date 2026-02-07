/**
 * Seed syllabus structure for:
 * /exams/gate-exam/gate-2026-cs-it
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

  const subExam = await SubExam.findOne({
    slug: "gate-2026-cs-it",
    isActive: true,
    isDeleted: false,
  });

  if (!subExam) throw new Error("SubExam not found");

  const syllabus = await OfficialSyllabus.findOne({
    subExamId: subExam._id,
    isActive: true,
    isDeleted: false,
  });

  if (!syllabus) throw new Error("Official syllabus not found");

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

  let subjectOrder = 1;

  for (const s of syllabusTree) {
    const subject = await Subject.findOneAndUpdate(
      { slug: s.subject.slug },
      {
        name: { en: s.subject.name },
        slug: s.subject.slug,
        isDeleted: false,
      },
      { upsert: true, new: true }
    );

    const subjectMap = await SubjectMap.findOneAndUpdate(
      {
        syllabusId: syllabus._id,
        subjectId: subject._id,
      },
      {
        syllabusId: syllabus._id,
        subjectId: subject._id,
        order: subjectOrder++,
        isDeleted: false,
        validFrom: SYLLABUS_YEAR,
      },
      { upsert: true, new: true }
    );

    let chapterOrder = 1;

    for (const c of s.chapters) {
      const chapter = await Chapter.findOneAndUpdate(
        { slug: c.slug },
        {
          name: { en: c.name },
          slug: c.slug,
          isDeleted: false,
        },
        { upsert: true, new: true }
      );

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
          isDeleted: false,
          validFrom: SYLLABUS_YEAR,
        },
        { upsert: true, new: true }
      );

      let topicOrder = 1;

      for (const topicName of c.topics) {
        const slug = topicName.toLowerCase().replace(/\s+/g, "-");

        const topic = await Topic.findOneAndUpdate(
          { slug },
          {
            name: { en: topicName },
            slug,
            isDeleted: false,
          },
          { upsert: true, new: true }
        );

        await TopicMap.findOneAndUpdate(
          {
            chapterMapId: chapterMap._id,
            topicId: topic._id,
          },
          {
            chapterMapId: chapterMap._id,
            topicId: topic._id,
            order: topicOrder++,
            isDeleted: false,
            validFrom: SYLLABUS_YEAR,
          },
          { upsert: true }
        );
      }
    }
  }

  await closeSeed();
  console.log("🏁 Syllabus seed completed");
}

seedGate2026CSITSyllabus().catch(err => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
