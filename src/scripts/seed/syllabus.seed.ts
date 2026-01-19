// src/scripts/seedSyllabus.ts
import { initSeed, closeSeed } from "./_helpers";
import Course from "../../models/mongoose/Course.schema";
import OfficialSyllabus from "../../models/mongoose/OfficialSyllabus.schema";

async function seedSyllabuses() {
  console.log("📘 Seeding Syllabuses for active courses...");
  await initSeed();

  // 1. Fetch all active and non-deleted courses
  const courses = await Course.find({ 
    isActive: true, 
    isDeleted: false 
  });

  console.log(`🔎 Found ${courses.length} active courses.`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const course of courses) {
    // 2. Check if a syllabus already exists for this course to avoid duplicates
    const existingSyllabus = await OfficialSyllabus.findOne({ 
      courseId: course._id,
      isDeleted: false 
    });

    if (existingSyllabus) {
      skippedCount++;
      continue;
    }

    // 3. Create a default syllabus for the course
    // We use localized names for the syllabus based on the course name
    await OfficialSyllabus.create({
      courseId: course._id,
      name: {
        en: `${course.name.en} Syllabus 2026`,
        hi: `${course.name.hi || course.name.en} पाठ्यक्रम 2026`
      },
      year: 2026,
      version: 1,
      validFrom: 2026,
      validTo: null,
      isActive: true,
      isDeleted: false
    });

    createdCount++;
  }

  await closeSeed();
  console.log(`✅ Syllabus seeding completed.`);
  console.log(`📊 Summary: ${createdCount} created, ${skippedCount} already existed.`);
}

seedSyllabuses().catch((err) => {
  console.error("❌ Syllabus seeding failed", err);
  process.exit(1);
});