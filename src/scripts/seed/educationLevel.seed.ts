import { initSeed, closeSeed } from "./_helpers";
import EducationLevel from "../../models/mongoose/EducationLevel.schema";

const EDUCATION_LEVELS = [
  {
    name: { en: "School Education", hi: "विद्यालय शिक्षा" },
    slug: "school-education",
    description: {
      en: "Primary to senior secondary education.",
      hi: "प्राथमिक से उच्च माध्यमिक शिक्षा।",
    },
    icon: "fa-solid fa-school",
    order: 1,
  },
  {
    name: { en: "Competitive Exams", hi: "प्रतियोगी परीक्षाएँ" },
    slug: "competitive-exams",
    description: {
      en: "National level competitive examinations.",
      hi: "राष्ट्रीय स्तर की प्रतियोगी परीक्षाएँ।",
    },
    icon: "fa-solid fa-trophy",
    order: 2,
  },
  {
    name: { en: "Government & Professional Exams", hi: "सरकारी एवं पेशेवर परीक्षाएँ" },
    slug: "government-professional",
    description: {
      en: "Government recruitment and professional certifications.",
      hi: "सरकारी भर्ती और पेशेवर प्रमाणन।",
    },
    icon: "fa-solid fa-landmark",
    order: 3,
  },
  {
    name: { en: "College & Higher Education", hi: "कॉलेज एवं उच्च शिक्षा" },
    slug: "college-higher-education",
    description: {
      en: "Undergraduate and postgraduate degree programs.",
      hi: "स्नातक और स्नातकोत्तर डिग्री कार्यक्रम।",
    },
    icon: "fa-solid fa-university",
    order: 4,
  },
];

async function seedEducationLevels() {
  console.log("🎓 Seeding education levels...");
  await initSeed();

  for (const level of EDUCATION_LEVELS) {
    const exists = await EducationLevel.findOne({
      slug: level.slug,
      isDeleted: false,
    });

    if (exists) {
      console.log(`⏭️  Skipped: ${level.slug}`);
      continue;
    }

    await EducationLevel.create({
      name: level.name,
      slug: level.slug,
      description: level.description,
      icon: level.icon,
      order: level.order,
      isActive: true,
    });

    console.log(`✅ Added: ${level.slug}`);
  }

  await closeSeed();
  console.log("🎉 EducationLevel seeding completed");
}

seedEducationLevels().catch((err) => {
  console.error("❌ EducationLevel seeding failed", err);
  process.exit(1);
});
