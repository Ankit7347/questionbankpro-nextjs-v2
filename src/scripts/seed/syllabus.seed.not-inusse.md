// src/scripts/seed/syllabus.seed.ts

import { initSeed, closeSeed } from "./_helpers";

import { ExamModel } from "../../models/mongoose/Exam.schema";
import { CourseModel } from "../../models/mongoose/Course.schema";
import Syllabus from "../../models/mongoose/Syllabus.schema";
import { Subject } from "../../models/mongoose/Subject.schema";
import Chapter from "../../models/mongoose/Chapter.schema";
import Topic from "../../models/mongoose/Topic.schema";

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
    (await Syllabus.findOne({
      examId: exam._id,
      courseId: course._id,
      isDeleted: false,
    })) ||
    (await Syllabus.create({
      examId: exam._id,
      courseId: course._id,
      academicYear: "2024-25",
    }));

  const physics =
    (await Subject.findOne({
      name: "Physics",
      syllabusId: syllabus._id,
      isDeleted: false,
    })) ||
    (await Subject.create({
      name: "Physics",
      syllabusId: syllabus._id,
      order: 1,
    }));

  const chapter =
    (await Chapter.findOne({
      name: "Light – Reflection and Refraction",
      subjectId: physics._id,
      isDeleted: false,
    })) ||
    (await Chapter.create({
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
    const exists = await Topic.findOne({
      name,
      chapterId: chapter._id,
      isDeleted: false,
    });

    if (!exists) {
      await Topic.create({
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
