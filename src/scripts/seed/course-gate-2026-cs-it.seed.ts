// src/seed/course.seed.ts

import { initSeed, closeSeed } from "./_helpers";
import SubExam from "../../models/mongoose/SubExam.schema";
import Course from "../../models/mongoose/Course.schema";

async function seedCourses() {
  console.log("📘 Seeding Courses for SubExam: gate-2026-cs-it");
  await initSeed();

  // 1. Fetch SubExam
  const subExam = await SubExam.findOne({
    slug: "gate-2026-cs-it",
    isActive: true,
    isDeleted: false,
  });

  if (!subExam) {
    throw new Error("❌ SubExam 'gate-2026-cs-it' not found or inactive.");
  }

  let createdCount = 0;
  let skippedCount = 0;

  const courses = [
    {
      subExamId: subExam._id,
      type: "FULL",
      name: {
        en: "GATE 2026 CS/IT Full Course",
        hi: "GATE 2026 CS/IT फुल कोर्स",
      },
      slug: "gate-2026-cs-it-full",
      basePrice: 19999,
      salePrice: 14999,
      isActive: true,
      visibility: "PUBLIC",
      validFrom: new Date("2025-06-01"),
      validTo: new Date("2026-03-31"),
      description: {
        en: "Complete GATE 2026 CS/IT syllabus coverage.",
        hi: "GATE 2026 CS/IT पूरे सिलेबस की तैयारी।",
      },
    },
    {
      subExamId: subExam._id,
      type: "CRASH",
      name: {
        en: "GATE 2026 CS/IT Crash Course",
        hi: "GATE 2026 CS/IT क्रैश कोर्स",
      },
      slug: "gate-2026-cs-it-crash",
      basePrice: 9999,
      salePrice: 6999,
      isActive: true,
      visibility: "PUBLIC",
      validFrom: new Date("2025-12-01"),
      validTo: new Date("2026-02-15"),
      description: {
        en: "Fast-track revision for GATE 2026 CS/IT.",
        hi: "GATE 2026 CS/IT के लिए तेज़ रिविज़न।",
      },
    },
    {
      subExamId: subExam._id,
      type: "TEST_SERIES",
      name: {
        en: "GATE 2026 CS/IT Test Series",
        hi: "GATE 2026 CS/IT टेस्ट सीरीज़",
      },
      slug: "gate-2026-cs-it-test-series",
      basePrice: 4999,
      salePrice: 3999,
      isActive: true,
      visibility: "PUBLIC",
      validFrom: new Date("2025-10-01"),
      validTo: new Date("2026-03-10"),
      description: {
        en: "Full-length and sectional mock tests.",
        hi: "पूर्ण और सेक्शनल मॉक टेस्ट।",
      },
    },
  ];

  for (const course of courses) {
    const existing = await Course.findOne({
      subExamId: course.subExamId,
      slug: course.slug,
      isDeleted: false,
    });

    if (existing) {
      skippedCount++;
      continue;
    }

    await Course.create(course);
    createdCount++;
  }

  await closeSeed();

  console.log("✅ Course seeding completed.");
  console.log(
    `📊 Summary: ${createdCount} created, ${skippedCount} already existed.`
  );
}

seedCourses().catch((err) => {
  console.error("❌ Course seeding failed", err);
  process.exit(1);
});
