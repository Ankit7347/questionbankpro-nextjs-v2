import { initSeed, closeSeed } from "./_helpers";
import PreviousPaper from "../../models/mongoose/PreviousPaper.schema";
import SolvedPaper from "../../models/mongoose/SolvedPaper.schema";
import Question from "../../models/mongoose/Question.schema";
import Exam from "../../models/mongoose/Exam.schema";
import SubExam from "../../models/mongoose/SubExam.schema";
import Subject from "../../models/mongoose/Subject.schema";

/* ======================================================
   🔹 QUESTIONS JSON
====================================================== */

const QUESTIONS_JSON = [
  {
    content: {
      en: "What is the time complexity of binary search?",
      hi: "बाइनरी सर्च की समय जटिलता क्या है?"
    },
    type: "MCQ",
    options: [
      { text: { en: "O(n)" }, isCorrect: false },
      { text: { en: "O(log n)" }, isCorrect: true },
      { text: { en: "O(n log n)" }, isCorrect: false },
    ],
    explanation: {
      en: "Binary search reduces the search space by half each step.",
      hi: "बाइनरी सर्च हर चरण में खोज क्षेत्र को आधा करता है।"
    },
    marks: 2,
    difficulty: "Medium"
  }
];

/* ======================================================
   🔹 PAPERS JSON
====================================================== */

const PAPERS_JSON = [
  {
    type: "PDF",
    title: "GATE 2026 CS Official Paper",
    paperCode: "GATE-CS-2026-PDF",
    year: 2026,
    session: "Feb",
    paperUrl: "/pdf/dummy.pdf"
  },
  {
    type: "DIGITAL",
    title: "GATE 2025 CS Practice Digital Set",
    paperCode: "GATE-CS-2025-DIG",
    year: 2025,
    session: "Feb"
  },
  {
    type: "BOTH",
    title: "GATE 2024 CS Full Paper",
    paperCode: "GATE-CS-2024-BOTH",
    year: 2024,
    session: "Feb",
    paperUrl: "/pdf/dummy.pdf"
  }
];

/* ======================================================
   🔹 SEED FUNCTION
====================================================== */

async function seedPreviousPapers() {
  console.log("📚 Seeding Previous Papers...");
  await initSeed();

  try {
    const exam = await Exam.findOne({ slug: "gate-exam", isDeleted: false });
    if (!exam) throw new Error("Exam not found");

    const subExam = await SubExam.findOne({
      slug: "gate-2026-cs-it",
      isDeleted: false,
    });
    if (!subExam) throw new Error("SubExam not found");

    const subjectOptions = [
      { slug: { $regex: /cs.*it|it.*cs/i } },
      { slug: "computer-science" },
      { slug: { $regex: /computer-science/i } },
      { slug: { $regex: /information-technology/i } },
      { "name.en": { $regex: /computer.*science|cs|it/i } },
      { slug: "operating-systems" },
      { slug: "dbms" },
    ];

    let subject: any = null;

    for (const query of subjectOptions) {
      subject = await Subject.findOne({
        ...query,
        isDeleted: false,
      } as any);

      if (subject) break;
    }

    if (!subject) {
      const allSubjects = await Subject.find({}, { slug: 1, name: 1 });
      console.log("Available subjects:");
      console.log(allSubjects.map(s => s.slug));
      throw new Error("Subject not found");
    }


    /* 1️⃣ Create Questions */
    const createdQuestions = await Question.insertMany(
      QUESTIONS_JSON.map((q, index) => ({
        ...q,
        subjectId: subject._id,
        displayOrder: index + 1,
        createdBy: "seed-admin",
      }))
    );

    const questionIds = createdQuestions.map(q => q._id);

    /* 2️⃣ Create Papers */
    let order = 1;

    for (const paper of PAPERS_JSON) {
      const slug = paper.paperCode.toLowerCase();

      const exists = await PreviousPaper.findOne({ slug });
      if (exists) {
        console.log(`⏭️ Skipped: ${paper.paperCode}`);
        continue;
      }

      const createdPaper = await PreviousPaper.create({
        title: {
          en: paper.title,
          hi: paper.title
        },
        slug,
        paperCode: paper.paperCode,
        examId: exam._id,
        subExamId: subExam._id,
        subjectId: subject._id,
        year: paper.year,
        session: paper.session,
        contentType: paper.type,
        paperUrl: paper.paperUrl || null,
        questions:
          paper.type === "DIGITAL" || paper.type === "BOTH"
            ? questionIds
            : [],
        displayOrder: order++,
        isPremium: false,
        isVerified: true,
        status: "PUBLISHED",
        views: Math.floor(Math.random() * 5000),
        downloads: Math.floor(Math.random() * 2000),
        prints: 0,
        shares: 0,
        totalRatings: 0,
        metaTitle: paper.title,
        metaDescription: `${paper.title} previous year question paper.`,
        keywords: ["gate", "computer science", "previous year"],
        tags: ["gate", "cs", paper.year.toString()],
        createdBy: "seed-admin",
        source: "USER_UPLOAD",
      });

      console.log(`✅ Added: ${paper.paperCode}`);

      if (paper.type === "DIGITAL" || paper.type === "BOTH") {
        await SolvedPaper.create({
          previousPaperId: createdPaper._id,
          fullExplanation: {
            en: "Detailed expert solution for this paper.",
            hi: "इस पेपर के लिए विस्तृत विशेषज्ञ समाधान।"
          },
          solutionPdfUrl: "/pdf/dummy-solution.pdf",
          isPremium: false,
          solutionQuality: "EXPERT_VERIFIED",
          views: 0,
          totalLikes: 0,
          averageRating: 0,
          totalRatings: 0,
          createdBy: "seed-admin"
        });

        console.log(`   ↳ Added SolvedPaper`);
      }

    }

    console.log("🎉 Seeding Completed");
    await closeSeed();
  } catch (error) {
    console.error("❌ Seeding failed", error);
    await closeSeed();
    process.exit(1);
  }
}

seedPreviousPapers();
