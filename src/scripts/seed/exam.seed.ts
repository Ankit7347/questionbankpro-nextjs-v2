import { initSeed, closeSeed } from "./_helpers";
import EducationLevel from "../../models/mongoose/EducationLevel.schema";
import Exam from "../../models/mongoose/Exam.schema";

const EXAMS = [
  /* =======================
   * SCHOOL EDUCATION
   * ======================= */
  {
    educationLevel: {
      name: "School Education",
      slug: "school-education",
    },
    exams: [
      {
        name: { en: "CBSE Board", hi: "सीबीएसई बोर्ड" },
        shortName: { en: "CBSE", hi: "सीबीएसई" },
        slug: "cbse-board",
        description: {
          en: "Central Board of Secondary Education curriculum.",
          hi: "केंद्रीय माध्यमिक शिक्षा बोर्ड पाठ्यक्रम।",
        },
        icon: "fa-solid fa-school",
        bannerImage: "sample.png",
        order: 1,
      },
      {
        name: { en: "ICSE Board", hi: "आईसीएसई बोर्ड" },
        shortName: { en: "ICSE", hi: "आईसीएसई" },
        slug: "icse-board",
        description: {
          en: "Indian Certificate of Secondary Education curriculum.",
          hi: "भारतीय माध्यमिक शिक्षा प्रमाणपत्र पाठ्यक्रम।",
        },
        icon: "fa-solid fa-school-flag",
        bannerImage: "sample.png",
        order: 2,
      },
      {
        name: { en: "State Boards", hi: "राज्य बोर्ड" },
        shortName: { en: "State", hi: "राज्य" },
        slug: "state-board",
        description: {
          en: "State-level school education boards.",
          hi: "राज्य स्तरीय विद्यालय शिक्षा बोर्ड।",
        },
        icon: "fa-solid fa-map",
        bannerImage: "sample.png",
        order: 3,
      },
    ],
  },
  {
    educationLevel: {
        name: "College & Higher Education",
        slug: "college-higher-education",
    },
    exams: [
        /* =======================
        * UNDERGRADUATE
        * ======================= */
        {
        name: { en: "Undergraduate Programs", hi: "स्नातक कार्यक्रम" },
        shortName: { en: "UG", hi: "यूजी" },
        slug: "undergraduate-programs",
        description: {
            en: "Bachelor level degree programs.",
            hi: "स्नातक स्तर के डिग्री कार्यक्रम।",
        },
        icon: "fa-solid fa-user-graduate",
        bannerImage: "sample.png",
        order: 1,
        },

        /* =======================
        * POSTGRADUATE
        * ======================= */
        {
        name: { en: "Postgraduate Programs", hi: "स्नातकोत्तर कार्यक्रम" },
        shortName: { en: "PG", hi: "पीजी" },
        slug: "postgraduate-programs",
        description: {
            en: "Master level degree programs.",
            hi: "स्नातकोत्तर स्तर के डिग्री कार्यक्रम।",
        },
        icon: "fa-solid fa-graduation-cap",
        bannerImage: "sample.png",
        order: 2,
        },
    ],
    },
    

  /* =======================
   * COMPETITIVE EXAMS
   * ======================= */
  {
    educationLevel: {
      name: "Competitive Exams",
      slug: "competitive-exams",
    },
    exams: [
      {
        name: { en: "Engineering Entrance", hi: "इंजीनियरिंग प्रवेश" },
        shortName: { en: "Engineering", hi: "इंजीनियरिंग" },
        slug: "engineering-entrance",
        description: {
          en: "Engineering entrance examinations.",
          hi: "इंजीनियरिंग प्रवेश परीक्षाएँ।",
        },
        icon: "fa-solid fa-gears",
        bannerImage: "sample.png",
        order: 1,
      },
      {
        name: { en: "Medical Entrance", hi: "मेडिकल प्रवेश" },
        shortName: { en: "Medical", hi: "मेडिकल" },
        slug: "medical-entrance",
        description: {
          en: "Medical entrance examinations.",
          hi: "मेडिकल प्रवेश परीक्षाएँ।",
        },
        icon: "fa-solid fa-stethoscope",
        bannerImage: "sample.png",
        order: 2,
      },
      {
        name: { en: "Commerce Entrance", hi: "वाणिज्य प्रवेश" },
        shortName: { en: "Commerce", hi: "वाणिज्य" },
        slug: "commerce-entrance",
        description: {
          en: "Commerce and management entrances.",
          hi: "वाणिज्य एवं प्रबंधन प्रवेश परीक्षाएँ।",
        },
        icon: "fa-solid fa-chart-line",
        bannerImage: "sample.png",
        order: 3,
      },
      {
        name: { en: "Olympiads", hi: "ओलंपियाड" },
        shortName: { en: "Olympiad", hi: "ओलंपियाड" },
        slug: "olympiads",
        description: {
          en: "National and international olympiads.",
          hi: "राष्ट्रीय एवं अंतरराष्ट्रीय ओलंपियाड।",
        },
        icon: "fa-solid fa-medal",
        bannerImage: "sample.png",
        order: 4,
      },
      {
        name: { en: "GATE", hi: "गेट (GATE)" },
        shortName: { en: "GATE", hi: "गेट" },
        slug: "gate-exam",
        description: {
          en: "Graduate Aptitude Test in Engineering for PG admissions and PSU recruitment.",
          hi: "पीजी प्रवेश और पीएसयू भर्ती के लिए इंजीनियरिंग में स्नातक योग्यता परीक्षा।",
        },
        icon: "fa-solid fa-microchip", // Appropriate for Engineering/Tech
        bannerImage: "sample.png",
        order: 5, // Continuing from your Olympiads (order: 4)
      },
    ],
  },

  /* =======================
   * GOVERNMENT & PROFESSIONAL
   * ======================= */
  {
    educationLevel: {
      name: "Government & Professional Exams",
      slug: "government-professional",
    },
    exams: [
      {
        name: { en: "Civil Services", hi: "सिविल सेवा" },
        shortName: { en: "UPSC", hi: "यूपीएससी" },
        slug: "civil-services",
        description: {
          en: "Civil services examinations.",
          hi: "सिविल सेवा परीक्षाएँ।",
        },
        icon: "fa-solid fa-landmark",
        bannerImage: "sample.png",
        order: 1,
      },
      {
        name: { en: "Staff Selection", hi: "स्टाफ चयन" },
        shortName: { en: "SSC", hi: "एसएससी" },
        slug: "staff-selection",
        description: {
          en: "Staff Selection Commission exams.",
          hi: "कर्मचारी चयन आयोग परीक्षाएँ।",
        },
        icon: "fa-solid fa-users",
        bannerImage: "sample.png",
        order: 2,
      },
      {
        name: { en: "Banking Exams", hi: "बैंकिंग परीक्षाएँ" },
        shortName: { en: "Banking", hi: "बैंकिंग" },
        slug: "banking-exams",
        description: {
          en: "Banking recruitment examinations.",
          hi: "बैंक भर्ती परीक्षाएँ।",
        },
        icon: "fa-solid fa-building-columns",
        bannerImage: "sample.png",
        order: 3,
      },
      {
        name: { en: "Professional Courses", hi: "पेशेवर पाठ्यक्रम" },
        shortName: { en: "Professional", hi: "पेशेवर" },
        slug: "professional-courses",
        description: {
          en: "Chartered and professional certifications.",
          hi: "चार्टर्ड एवं पेशेवर प्रमाणपत्र।",
        },
        icon: "fa-solid fa-award",
        bannerImage: "sample.png",
        order: 4,
      },
    ],
  },
];

async function seedExams() {
  console.log("📘 Seeding exams...");
  await initSeed();

  for (const block of EXAMS) {
    const level = await EducationLevel.findOne({
      slug: block.educationLevel.slug,
      isDeleted: false,
    });

    if (!level) {
      console.warn(`⚠️ EducationLevel not found: ${block.educationLevel.slug}`);
      continue;
    }

    for (const exam of block.exams) {
      // 1. Check if exam with this slug already exists
      const existingExam = await Exam.findOne({ slug: exam.slug });

      if (existingExam) {
        console.log(`⏭️ Skipping: Exam "${exam.slug}" already exists.`);
        continue;
      }

      // 2. Only create if it doesn't exist
      await Exam.create({
        name: exam.name,
        shortName: exam.shortName,
        slug: exam.slug,
        educationLevelId: level._id,
        description: exam.description,
        icon: exam.icon,
        bannerImage: exam.bannerImage,
        order: exam.order,
        isActive: true,
      });
      console.log(`✅ Created: ${exam.slug}`);
    }
  }

  await closeSeed();
  console.log("🏁 Exam seeding process completed");
}

seedExams().catch((err) => {
  console.error("❌ Exam seeding failed", err);
  process.exit(1);
});
