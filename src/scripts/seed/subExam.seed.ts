// src/seed/subExam.seed.ts

import { initSeed, closeSeed } from "./_helpers";
import Exam from "../../models/mongoose/Exam.schema";
import SubExam from "../../models/mongoose/SubExam.schema";

interface ISubExamSeed {
  name: string;
  slug: string;
  order: number;
  stream?: string;
}

const SUB_EXAMS = [
  {
    examSlug: "cbse-board",
    year: 2026,
    items: [
      { name: "Class 6", slug: "class-6", order: 1, stream: "6" },
      { name: "Class 7", slug: "class-7", order: 2, stream: "7" },
      { name: "Class 8", slug: "class-8", order: 3, stream: "8" },
      { name: "Class 9", slug: "class-9", order: 4, stream: "9" },
      { name: "Class 10", slug: "class-10", order: 5, stream: "10" },
      { name: "Class 11", slug: "class-11", order: 6, stream: "11" },
      { name: "Class 12", slug: "class-12", order: 7, stream: "12" },
    ],
  },

  {
    examSlug: "undergraduate-programs",
    year: 2026,
    items: [
      { name: "BA", slug: "ba", order: 1, stream: "Arts" },
      { name: "BSc", slug: "bsc", order: 2, stream: "Science" },
      { name: "BCom", slug: "bcom", order: 3, stream: "Commerce" },
      { name: "BTech", slug: "btech", order: 4, stream: "Engineering" },
      { name: "MBBS", slug: "mbbs", order: 5, stream: "Medical" },
      { name: "LLB", slug: "llb", order: 6, stream: "Law" },
    ],
  },

  {
    examSlug: "postgraduate-programs",
    year: 2026,
    items: [
      { name: "MA", slug: "ma", order: 1, stream: "Arts" },
      { name: "MSc", slug: "msc", order: 2, stream: "Science" },
      { name: "MCom", slug: "mcom", order: 3, stream: "Commerce" },
      { name: "MBA", slug: "mba", order: 4, stream: "Management" },
      { name: "MTech", slug: "mtech", order: 5, stream: "Engineering" },
      { name: "LLM", slug: "llm", order: 6, stream: "Law" },
      { name: "PGDM", slug: "pgdm", order: 7, stream: "Management" },
    ],
  },

  {
    examSlug: "engineering-entrance",
    year: 2026,
    items: [
      { name: "JEE Main", slug: "jee-main", order: 1, stream: "Engineering" },
      { name: "JEE Advanced", slug: "jee-advanced", order: 2, stream: "Engineering" },
      { name: "BITSAT", slug: "bitsat", order: 3, stream: "Engineering" },
    ],
  },

  {
    examSlug: "medical-entrance",
    year: 2026,
    items: [
      { name: "NEET UG", slug: "neet-ug", order: 1, stream: "Medical" },
      { name: "AIIMS", slug: "aiims", order: 2, stream: "Medical" },
    ],
  },

  {
    examSlug: "banking-exams",
    year: 2026,
    items: [
      { name: "IBPS PO", slug: "ibps-po", order: 1, stream: "Banking" },
      { name: "SBI PO", slug: "sbi-po", order: 2, stream: "Banking" },
    ],
  },

  {
    examSlug: "gate-exam",
    year: 2026,
    items: [
      {
        name: "GATE 2026 Computer Science & Information Technology",
        slug: "gate-2026-cs-it",
        order: 1,
        stream: "CS-IT",
      },
      {
        name: "GATE 2026 Mechanical Engineering",
        slug: "gate-2026-me",
        order: 2,
        stream: "ME",
      },
    ],
  },
];

async function seedSubExams() {
  console.log("📘 Seeding SubExams...");
  await initSeed();

  for (const block of SUB_EXAMS) {
    const exam = await Exam.findOne({
      slug: block.examSlug,
      isDeleted: false,
    });

    if (!exam) {
      console.warn(`⚠️ Exam not found: ${block.examSlug}`);
      continue;
    }

    for (const item of block.items as ISubExamSeed[]) {
      const exists = await SubExam.findOne({ slug: item.slug });
      if (exists) {
        console.log(`⏭️ Skipping: ${item.slug}`);
        continue;
      }

      await SubExam.create({
        examId: exam._id,
        name: { en: item.name },
        slug: item.slug,
        year: block.year,
        stream: item.stream ?? "General",
        order: item.order,
        isActive: true,
        isVisibleOnCard: true
      });

      console.log(`✅ Created SubExam: ${item.slug}`);
    }
  }

  await closeSeed();
  console.log("🏁 SubExam seeding completed");
}

seedSubExams().catch((err) => {
  console.error("❌ SubExam seeding failed", err);
  process.exit(1);
});
