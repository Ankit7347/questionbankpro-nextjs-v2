// src/seed/officialSyllabus.seed.ts

import { initSeed, closeSeed } from "./_helpers";
import SubExam from "../../models/mongoose/SubExam.schema";
import OfficialSyllabus from "../../models/mongoose/OfficialSyllabus.schema";

async function seedOfficialSyllabuses() {
  console.log("📘 Seeding OfficialSyllabus for SubExams...");
  await initSeed();

  // 1. Fetch all active and non-deleted SubExams
  const subExams = await SubExam.find({
    isActive: true,
    isDeleted: false,
  });

  console.log(`🔎 Found ${subExams.length} active SubExams.`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const subExam of subExams) {
    // 2. Avoid duplicate syllabus for same SubExam
    const existing = await OfficialSyllabus.findOne({
      subExamId: subExam._id,
      isDeleted: false,
    });

    if (existing) {
      skippedCount++;
      continue;
    }

    // 3. Create default official syllabus
    await OfficialSyllabus.create({
      subExamId: subExam._id,
      year: subExam.year,
      version: 1,
      validFrom: subExam.year,
      validTo: null,
      isActive: true,
      isDeleted: false,
    });

    createdCount++;
  }

  await closeSeed();

  console.log("✅ OfficialSyllabus seeding completed.");
  console.log(
    `📊 Summary: ${createdCount} created, ${skippedCount} already existed.`
  );
}

seedOfficialSyllabuses().catch((err) => {
  console.error("❌ OfficialSyllabus seeding failed", err);
  process.exit(1);
});
