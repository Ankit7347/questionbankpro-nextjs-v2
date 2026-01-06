// src/scripts/seed/syllabus.seed.ts

import { initSeed, closeSeed } from "./_helpers";

import { ExamModel } from "../../models/mongoose/Exam.schema";
import { CourseModel } from "../../models/mongoose/Course.schema";
import { SyllabusModel } from "../../models/mongoose/Syllabus.schema";
import { SubjectModel } from "../../models/mongoose/Subject.schema";
import { ChapterModel } from "../../models/mongoose/Chapter.schema";
import { TopicModel } from "../../models/mongoose/Topic.schema";

async function seedSyllabus() {
  console.log("📘 Seeding syllabus...");
  await initSeed();

  const exam =
    (await ExamModel.findOne({ name: "CBSE" })) ||
    (await ExamModel.create({
      name: "CBSE",
      examType: "board",
    }));

  const course = await CourseModel.findOne({
    name: "Class 10",
    isDeleted: false,
  });

  if (!course) {
    throw new Error("Class 10 not found. Run education seed first.");
  }

  const syllabus =
    (await SyllabusModel.findOne({
      examId: exam._id,
      courseId: course._id,
      isDeleted: false,
    })) ||
    (await SyllabusModel.create({
      examId: exam._id,
      courseId: course._id,
      academicYear: "2024-25",
    }));

  const physics =
    (await SubjectModel.findOne({
      name: "Physics",
      syllabusId: syllabus._id,
      isDeleted: false,
    })) ||
    (await SubjectModel.create({
      name: "Physics",
      syllabusId: syllabus._id,
      order: 1,
    }));

  const chapter =
    (await ChapterModel.findOne({
      name: "Light – Reflection and Refraction",
      subjectId: physics._id,
      isDeleted: false,
    })) ||
    (await ChapterModel.create({
      subjectId: physics._id,
      chapterNumber: 10,
      name: "Light – Reflection and Refraction",
      order: 10,
    }));

  const topics = [
    "Reflection of Light",
    "Refraction of Light",
    "Mirror Formula",
    "Lens Formula",
  ];

  for (const name of topics) {
    const exists = await TopicModel.findOne({
      name,
      chapterId: chapter._id,
      isDeleted: false,
    });

    if (!exists) {
      await TopicModel.create({
        name,
        chapterId: chapter._id,
      });
      console.log(`  ➕ Topic added: ${name}`);
    }
  }

  await closeSeed();
  console.log("🎉 Syllabus seeding done");
}

seedSyllabus();
