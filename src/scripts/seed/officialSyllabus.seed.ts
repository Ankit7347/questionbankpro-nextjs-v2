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

    // 3. Create default official syllabus (type-aware)
    const syllabusPayload: any = {
      subExamId: subExam._id,
      version: 1,
      isActive: true,
      isDeleted: false,
    };

    if (subExam.type === "competitive") {
      syllabusPayload.year = subExam.year;
      syllabusPayload.validFrom = subExam.year;
      syllabusPayload.validTo = null;
    } else {
      // school + program
      syllabusPayload.year = 2026;        // semantic placeholder
      syllabusPayload.validFrom = 2026;   // means "always valid"
      syllabusPayload.validTo = null;
    }

    await OfficialSyllabus.create(syllabusPayload);


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
