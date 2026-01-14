// src/seed/exams/seed-gate-2026.ts

import { initSeed, closeSeed } from "./_helpers";
import EducationLevel from "../../models/mongoose/EducationLevel.schema";
import Exam from "../../models/mongoose/Exam.schema";
import Course from "../../models/mongoose/Course.schema";

async function seedGate2026() {
  console.log("🎯 Seeding GATE 2026...");
  await initSeed();

  /* =======================
   * EDUCATION LEVEL
   * ======================= */
  const educationLevel = await EducationLevel.findOne({
    slug: "competitive-exams",
    isDeleted: false,
  });

  if (!educationLevel) {
    throw new Error("EducationLevel 'competitive-exams' not found");
  }

  /* =======================
   * EXAM (IDENTITY)
   * ======================= */
  let gateExam = await Exam.findOne({
    slug: "gate",
    isDeleted: false,
  });

  if (!gateExam) {
    gateExam = await Exam.create({
      name: {
        en: "Graduate Aptitude Test in Engineering",
        hi: "ग्रेजुएट एप्टीट्यूड टेस्ट इन इंजीनियरिंग",
      },
      shortName: { en: "GATE", hi: "गेट" },
      slug: "gate",
      educationLevelId: educationLevel._id,
      description: {
        en: "National level engineering examination for postgraduate admissions and PSU recruitment.",
        hi: "स्नातकोत्तर प्रवेश और पीएसयू भर्ती हेतु राष्ट्रीय स्तर की इंजीनियरिंग परीक्षा।",
      },
      icon: "fa-solid fa-microchip",
      bannerImage: "gate.png",
      order: 1,
      isActive: true,
    });

    console.log("✅ Exam created: GATE");
  } else {
    console.log("⏭️ Exam exists: GATE");
  }

  /* =======================
   * COURSE (YEAR-SPECIFIC)
   * ======================= */
  const existingCourse = await Course.findOne({
    slug: "gate-2026",
    examId: gateExam._id,
    isDeleted: false,
  });

  if (!existingCourse) {
    await Course.create({
      name: { en: "GATE 2026", hi: "गेट 2026" },
      slug: "gate-2026",
      examId: gateExam._id,

      description: {
        en: "GATE 2026 preparation course with syllabus, practice questions, and mock tests.",
        hi: "पाठ्यक्रम, अभ्यास प्रश्न और मॉक टेस्ट के साथ गेट 2026 तैयारी कोर्स।",
      },

      durationYears: null,
      totalSemesters: null,
      classRange: null,
      stream: "Engineering",

      icon: "fa-solid fa-gears",

      badge: {
        en: "Latest",
        hi: "नवीनतम",
      },

      order: 1,
      isVisibleOnCard: true,
      isActive: true,
    });

    console.log("✅ Course created: GATE 2026");
  } else {
    console.log("⏭️ Course exists: GATE 2026");
  }

  await closeSeed();
  console.log("🎉 GATE 2026 seeding completed");
}

seedGate2026().catch((err) => {
  console.error("❌ GATE 2026 seeding failed", err);
  process.exit(1);
});
