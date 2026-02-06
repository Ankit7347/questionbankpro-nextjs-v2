import { initSeed, closeSeed } from "./_helpers";
import SolvedPaper from "../../models/mongoose/SolvedPaper.schema";
import Exam from "../../models/mongoose/Exam.schema";
import Subject from "../../models/mongoose/Subject.schema";

// GATE CS/IT Solved Papers
const GATE_CS_SOLVED = [
  {
    paperCode: "GATE-CS-2024-SOLVED",
    title: "GATE 2024 Computer Science - Complete Solutions",
    difficulty: "Medium",
    totalMarks: 100,
    duration: 180,
    description: "Complete step-by-step solutions for GATE 2024 CS with detailed explanations for all 65 questions.",
    fileUrl: "https://example.com/papers/gate-2024-cs-solved.pdf",
    keywords: ["GATE", "CS", "2024", "Solutions"],
    solutionSteps: [
      { 
        stepNumber: 1, 
        title: "Problem Analysis", 
        body: "Carefully analyze the question to identify core concepts and requirements.",
        difficulty: "Easy", 
        helpfulCount: 250 
      },
      { 
        stepNumber: 2, 
        title: "Algorithm & Approach", 
        body: "Select and apply relevant Computer Science algorithms and concepts.",
        difficulty: "Medium", 
        helpfulCount: 200 
      },
      { 
        stepNumber: 3, 
        title: "Implementation",
        body: "Develop complete solution code with proper logic and error handling.",
        difficulty: "Hard", 
        helpfulCount: 175 
      },
      { 
        stepNumber: 4, 
        title: "Verification",
        body: "Test solution with various test cases and optimize as needed.",
        difficulty: "Medium", 
        helpfulCount: 150 
      },
    ],
    totalRatings: 4.8,
  },
  {
    paperCode: "GATE-CS-2023-SOLVED",
    title: "GATE 2023 Computer Science - Expert Solutions",
    difficulty: "Hard",
    totalMarks: 100,
    duration: 180,
    description: "Expert solutions with multiple problem-solving approaches for GATE 2023 CS.",
    fileUrl: "https://example.com/papers/gate-2023-cs-solved.pdf",
    keywords: ["GATE", "CS", "2023", "Expert Solutions"],
    solutionSteps: [
      { 
        stepNumber: 1, 
        title: "Question Understanding", 
        body: "Decode the question and identify all hidden constraints and requirements.",
        difficulty: "Medium", 
        helpfulCount: 300 
      },
      { 
        stepNumber: 2, 
        title: "Algorithm Selection",
        body: "Choose the most optimal algorithm considering time and space complexity.",
        difficulty: "Hard", 
        helpfulCount: 220 
      },
      { 
        stepNumber: 3, 
        title: "Detailed Solution",
        body: "Provide complete solution with code snippets and line-by-line explanation.",
        difficulty: "Hard", 
        helpfulCount: 200 
      },
      { 
        stepNumber: 4, 
        title: "Alternative Methods",
        body: "Discuss alternative approaches and their trade-offs.",
        difficulty: "Hard", 
        helpfulCount: 160 
      },
    ],
    totalRatings: 4.7,
  },
  {
    paperCode: "GATE-CS-2022-SOLVED",
    title: "GATE 2022 Computer Science - Solution Archive",
    difficulty: "Hard",
    totalMarks: 100,
    duration: 180,
    description: "Comprehensive solution archive for GATE 2022 CS with step-by-step problem solving.",
    fileUrl: "https://example.com/papers/gate-2022-cs-solved.pdf",
    keywords: ["GATE", "CS", "2022", "Archive"],
    solutionSteps: [
      { 
        stepNumber: 1, 
        title: "Problem Decoding", 
        body: "Extract essential information and understand the problem clearly.",
        difficulty: "Easy", 
        helpfulCount: 280 
      },
      { 
        stepNumber: 2, 
        title: "Concept Review",
        body: "Recall and apply relevant Computer Science concepts and data structures.",
        difficulty: "Medium", 
        helpfulCount: 210 
      },
      { 
        stepNumber: 3, 
        title: "Solution Development",
        body: "Develop complete working solution with optimizations.",
        difficulty: "Hard", 
        helpfulCount: 190 
      },
      { 
        stepNumber: 4, 
        title: "Testing & Optimization",
        body: "Test solution and optimize for better time and space complexity.",
        difficulty: "Medium", 
        helpfulCount: 140 
      },
    ],
    totalRatings: 4.6,
  },
  {
    paperCode: "GATE-CS-2021-SOLVED",
    title: "GATE 2021 Computer Science - Solved Questions",
    difficulty: "Medium",
    totalMarks: 100,
    duration: 180,
    description: "Comprehensive solutions for GATE 2021 with multiple problem-solving approaches.",
    fileUrl: "https://example.com/papers/gate-2021-cs-solved.pdf",
    keywords: ["GATE", "CS", "2021", "Multiple Approaches"],
    solutionSteps: [
      { 
        stepNumber: 1, 
        title: "Problem Analysis", 
        body: "Analyze requirements and identify key information.",
        difficulty: "Easy", 
        helpfulCount: 290 
      },
      { 
        stepNumber: 2, 
        title: "Concept Application",
        body: "Apply algorithms and data structure knowledge to the problem.",
        difficulty: "Medium", 
        helpfulCount: 230 
      },
      { 
        stepNumber: 3, 
        title: "Primary Implementation",
        body: "Implement the main approach clearly and efficiently.",
        difficulty: "Medium", 
        helpfulCount: 200 
      },
      { 
        stepNumber: 4, 
        title: "Alternative Solutions",
        body: "Discuss alternative solutions and their relative merits.",
        difficulty: "Hard", 
        helpfulCount: 160 
      },
    ],
    totalRatings: 4.7,
  },
];

async function seedSolvedPapers() {
  console.log("✍️  Seeding Solved Papers (GATE CS/IT)...");
  await initSeed();

  try {
    // Fetch GATE exam
    const gateExam = await Exam.findOne({ slug: "gate-exam", isDeleted: false } as any);
    if (!gateExam) {
      console.warn("⚠️  GATE exam not found. Please run: npx tsx exam.seed.ts");
      await closeSeed();
      return;
    }

    console.log(`✅ Found GATE Exam: ${gateExam.name?.en || gateExam.slug}`);

    // Find Computer Science subject
    let csSubject: any = null;
    
    // Try to find CS subject with various queries
    const subjectOptions = [
      { slug: { $regex: /cs.*it|it.*cs/ }, isDeleted: false },
      { slug: "computer-science", isDeleted: false },
      { "name.en": { $regex: /computer.*science|cs|it/ }, isDeleted: false },
    ];

    for (const query of subjectOptions) {
      csSubject = await Subject.findOne(query as any);
      if (csSubject) break;
    }

    if (!csSubject) {
      const allSubjects = await Subject.find({ isDeleted: false } as any);
      console.warn("⚠️  Computer Science subject not found. Available subjects:");
      allSubjects.forEach(s => 
        console.warn(`     ${s.slug}: ${s.name?.en || JSON.stringify(s.name)}`)
      );
      await closeSeed();
      return;
    }

    console.log(`✅ Found Subject: ${csSubject.name?.en || csSubject.slug}`);

    let seedCount = 0;

    for (const paper of GATE_CS_SOLVED) {
      const slug = paper.paperCode.toLowerCase().replace(/\s+/g, "-");

      const exists = await SolvedPaper.findOne({
        slug,
        isDeleted: false,
      } as any);

      if (exists) {
        console.log(`⏭️  Skipped: ${paper.paperCode}`);
        continue;
      }

      await SolvedPaper.create({
        title: paper.title,
        paperCode: paper.paperCode,
        slug,
        examId: gateExam._id,
        subjectId: csSubject._id,
        difficulty: paper.difficulty,
        totalMarks: paper.totalMarks,
        duration: paper.duration,
        description: paper.description,
        solutionSteps: paper.solutionSteps,
        fileUrl: paper.fileUrl,
        keywords: paper.keywords,
        status: "PUBLISHED",
        isVerified: true,
        visibility: "PUBLIC",
        isPremium: false,
        isActive: true,
        isDeleted: false,
        views: Math.floor(Math.random() * 3000),
        downloads: Math.floor(Math.random() * 1500),
        helpfulCount: Math.floor(Math.random() * 100),
        unhelpfulCount: Math.floor(Math.random() * 20),
        totalRatings: paper.totalRatings,
        createdBy: "seed-admin",
      });

      console.log(`✅ Added: ${paper.paperCode}`);
      seedCount++;
    }

    await closeSeed();
    console.log(`🎉 Solved Papers seeding completed (${seedCount}/${GATE_CS_SOLVED.length} papers added)`);
  } catch (error) {
    console.error("❌ Solved Papers seeding failed", error);
    process.exit(1);
  }
}

seedSolvedPapers();
