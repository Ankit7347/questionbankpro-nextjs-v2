// src/seed/subExam.seed.ts

import { initSeed, closeSeed } from "./_helpers";
import Exam from "../../models/mongoose/Exam.schema";
import SubExam from "../../models/mongoose/SubExam.schema";

interface ISchoolItem {
  name: string;
  slug: string;
  order: number;
  class: number;
}

interface ICompetitiveItem {
  name: string;
  slug: string;
  order: number;
  stream: string;
}

type SubExamBlock =
  | {
    examSlug: string;
    type: "school";
    items: ISchoolItem[];
  }
  | {
    examSlug: string;
    type: "competitive";
    year: number;
    items: ICompetitiveItem[];
  }
  | {
    examSlug: string;
    type: "program";
    items: ICompetitiveItem[];
  }
  ;
const SUB_EXAMS: SubExamBlock[] = [
  /* ------------------------------------------------------------------ */
  /* SCHOOL BOARDS                                                       */
  /* ------------------------------------------------------------------ */
  {
    examSlug: "cbse-board",
    type: "school",
    items: [
      { name: "Class 6", slug: "cbse-class-6", order: 1, class: 6 },
      { name: "Class 7", slug: "cbse-class-7", order: 2, class: 7 },
      { name: "Class 8", slug: "cbse-class-8", order: 3, class: 8 },
      { name: "Class 9", slug: "cbse-class-9", order: 4, class: 9 },
      { name: "Class 10", slug: "cbse-class-10", order: 5, class: 10 },
      { name: "Class 11", slug: "cbse-class-11", order: 6, class: 11 },
      { name: "Class 12", slug: "cbse-class-12", order: 7, class: 12 },
    ],
  },
  {
    examSlug: "icse-board",
    type: "school",
    items: [
      { name: "Class 6", slug: "icse-class-6", order: 1, class: 6 },
      { name: "Class 7", slug: "icse-class-7", order: 2, class: 7 },
      { name: "Class 8", slug: "icse-class-8", order: 3, class: 8 },
      { name: "Class 9", slug: "icse-class-9", order: 4, class: 9 },
      { name: "Class 10", slug: "icse-class-10", order: 5, class: 10 },
    ],
  },
  {
    examSlug: "isc-board",
    type: "school",
    items: [
      { name: "Class 11", slug: "isc-class-11", order: 1, class: 11 },
      { name: "Class 12", slug: "isc-class-12", order: 2, class: 12 },
    ],
  },
  {
    examSlug: "state-board",
    type: "school",
    items: [
      { name: "Class 6", slug: "state-board-class-6", order: 1, class: 6 },
      { name: "Class 7", slug: "state-board-class-7", order: 2, class: 7 },
      { name: "Class 8", slug: "state-board-class-8", order: 3, class: 8 },
      { name: "Class 9", slug: "state-board-class-9", order: 4, class: 9 },
      { name: "Class 10", slug: "state-board-class-10", order: 5, class: 10 },
      { name: "Class 11", slug: "state-board-class-11", order: 6, class: 11 },
      { name: "Class 12", slug: "state-board-class-12", order: 7, class: 12 },
    ],
  },
  {
    examSlug: "up-board",
    type: "school",
    items: [
      { name: "Class 6", slug: "up-board-class-6", order: 1, class: 6 },
      { name: "Class 7", slug: "up-board-class-7", order: 2, class: 7 },
      { name: "Class 8", slug: "up-board-class-8", order: 3, class: 8 },
      { name: "Class 9", slug: "up-board-class-9", order: 4, class: 9 },
      { name: "Class 10", slug: "up-board-class-10", order: 5, class: 10 },
      { name: "Class 11", slug: "up-board-class-11", order: 6, class: 11 },
      { name: "Class 12", slug: "up-board-class-12", order: 7, class: 12 },
    ],
  },

  {
    "examSlug": "undergraduate-programs",
    type: "program",
    "items": [
      { "name": "B.Tech Computer Science", "slug": "btech-cs", "order": 1, "stream": "Engineering" },
      { "name": "B.Tech Mechanical", "slug": "btech-me", "order": 2, "stream": "Engineering" },
      { "name": "B.Tech Civil", "slug": "btech-ce", "order": 3, "stream": "Engineering" },
      { "name": "B.Tech Electronics & Comm.", "slug": "btech-ece", "order": 4, "stream": "Engineering" },
      { "name": "B.Tech Electrical", "slug": "btech-ee", "order": 5, "stream": "Engineering" },
      { "name": "B.Tech Information Technology", "slug": "btech-it", "order": 6, "stream": "Engineering" },
      { "name": "MBBS", "slug": "mbbs", "order": 7, "stream": "Medical" },
      { "name": "BDS (Dentistry)", "slug": "bds", "order": 8, "stream": "Medical" },
      { "name": "B.Sc (Hons) Physics", "slug": "bsc-physics", "order": 9, "stream": "Science" },
      { "name": "B.Sc (Hons) Mathematics", "slug": "bsc-maths", "order": 10, "stream": "Science" },
      { "name": "B.Com (Hons)", "slug": "bcom-hons", "order": 11, "stream": "Commerce" },
      { "name": "BA (Hons) Economics", "slug": "ba-economics", "order": 12, "stream": "Arts" },
      { "name": "BA (Hons) English", "slug": "ba-english", "order": 13, "stream": "Arts" },
      { "name": "BA LLB (Integrated)", "slug": "ba-llb", "order": 14, "stream": "Law" }
    ]
  },
  {
    "examSlug": "postgraduate-programs",
    type: "program",
    "items": [
      { "name": "M.Tech Computer Science", "slug": "mtech-cs", "order": 1, "stream": "Engineering" },
      { "name": "M.Tech Structural Engg.", "slug": "mtech-structural", "order": 2, "stream": "Engineering" },
      { "name": "M.Tech VLSI Design", "slug": "mtech-vlsi", "order": 3, "stream": "Engineering" },
      { "name": "MBA Finance", "slug": "mba-finance", "order": 4, "stream": "Management" },
      { "name": "MBA Marketing", "slug": "mba-marketing", "order": 5, "stream": "Management" },
      { "name": "MBA Human Resource", "slug": "mba-hr", "order": 6, "stream": "Management" },
      { "name": "PGDM Business Analytics", "slug": "pgdm-analytics", "order": 7, "stream": "Management" },
      { "name": "M.Sc Data Science", "slug": "msc-data-science", "order": 8, "stream": "Science" },
      { "name": "M.Sc Physics", "slug": "msc-physics", "order": 9, "stream": "Science" },
      { "name": "M.Com", "slug": "mcom", "order": 10, "stream": "Commerce" },
      { "name": "MA Political Science", "slug": "ma-pol-science", "order": 11, "stream": "Arts" },
      { "name": "MD General Medicine", "slug": "md-medicine", "order": 12, "stream": "Medical" },
      { "name": "MS General Surgery", "slug": "ms-surgery", "order": 13, "stream": "Medical" },
      { "name": "LLM Corporate Law", "slug": "llm-corporate", "order": 14, "stream": "Law" }
    ]
  },

  {
    examSlug: "engineering-entrance",
    type: "competitive",
    year:2026,
    items: [
      { name: "JEE Main", slug: "jee-main", order: 1, stream: "Engineering" },
      { name: "JEE Advanced", slug: "jee-advanced", order: 2, stream: "Engineering" },
      { name: "BITSAT", slug: "bitsat", order: 3, stream: "Engineering" },
    ],
  },

  {
    examSlug: "medical-entrance",
    type: "competitive",
    year:2026,
    items: [
      { name: "NEET UG", slug: "neet-ug", order: 1, stream: "Medical" },
      { name: "AIIMS", slug: "aiims", order: 2, stream: "Medical" },
    ],
  },

  {
    examSlug: "banking-exams",
    type: "competitive",
    year:2026,
    items: [
      { name: "IBPS PO", slug: "ibps-po", order: 1, stream: "Banking" },
      { name: "SBI PO", slug: "sbi-po", order: 2, stream: "Banking" },
    ],
  },

  {
    examSlug: "gate-exam",
    type: "competitive",
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
    const exam = await Exam.findOne({ slug: block.examSlug, isDeleted: false });
    if (!exam) {
      console.warn(`⚠️ Exam not found: ${block.examSlug}`);
      continue;
    }

    // SCHOOL
    if (block.type === "school") {
      for (const item of block.items) {
        const exists = await SubExam.findOne({ slug: item.slug });
        if (exists) continue;

        await SubExam.create({
          examId: exam._id,
          type: "school",
          class: item.class,
          name: { en: item.name },
          slug: item.slug,
          order: item.order,
          isActive: true,
          isVisibleOnCard: true,
        });

        console.log(`✅ Created SubExam: ${item.slug}`);
      }
    }

    // COMPETITIVE (GATE / JEE / NEET / BANKING)
    if (block.type === "competitive") {
      for (const item of block.items) {
        const exists = await SubExam.findOne({ slug: item.slug });
        if (exists) continue;

        await SubExam.create({
          examId: exam._id,
          type: "competitive",
          year: block.year,
          stream: item.stream,
          name: { en: item.name },
          slug: item.slug,
          order: item.order,
          isActive: true,
          isVisibleOnCard: true,
        });

        console.log(`✅ Created SubExam: ${item.slug}`);
      }
    }

    // PROGRAM (UG / PG)
    if (block.type === "program") {
      for (const item of block.items) {
        const exists = await SubExam.findOne({ slug: item.slug });
        if (exists) continue;

        await SubExam.create({
          examId: exam._id,
          type: "program",
          stream: item.stream,
          name: { en: item.name },
          slug: item.slug,
          order: item.order,
          isActive: true,
          isVisibleOnCard: true,
        });

        console.log(`✅ Created SubExam: ${item.slug}`);
      }
    }
  }

  await closeSeed();
  console.log("🏁 SubExam seeding completed");
}


seedSubExams().catch((err) => {
  console.error("❌ SubExam seeding failed", err);
  process.exit(1);
});
