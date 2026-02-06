import { initSeed, closeSeed } from "./_helpers";
import PreviousPaper from "../../models/mongoose/PreviousPaper.schema";
import Exam from "../../models/mongoose/Exam.schema";
import Subject from "../../models/mongoose/Subject.schema";

const PREVIOUS_PAPERS = [
  {
    title: "GATE 2024 Computer Science - Forenoon Session",
    paperCode: "CS-2024-FN",
    year: 2024,
    session: "Feb",
    examName: "GATE",
    subjectName: "Computer Science and Information Technology",
    difficulty: "Hard",
    totalMarks: 100,
    duration: 180,
    description: "Official GATE 2024 Computer Science forenoon session question paper",
    fileUrl: "/uploads/papers/gate-2024-cs-fn.pdf",
    solutionFileUrl: "/uploads/solutions/gate-2024-cs-fn-solution.pdf",
    keywords: ["GATE", "CS", "2024", "Programming", "Data Structures", "Algorithms"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
  {
    title: "GATE 2023 Computer Science - Evening Session",
    paperCode: "CS-2023-EV",
    year: 2023,
    session: "Feb",
    examName: "GATE",
    subjectName: "Computer Science and Information Technology",
    difficulty: "Hard",
    totalMarks: 100,
    duration: 180,
    description: "Official GATE 2023 Computer Science evening session question paper",
    fileUrl: "/uploads/papers/gate-2023-cs-ev.pdf",
    keywords: ["GATE", "CS", "2023", "DBMS", "OS", "Networks"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
  {
    title: "GATE 2022 Electronics and Communication",
    paperCode: "EC-2022-FN",
    year: 2022,
    session: "Feb",
    examName: "GATE",
    subjectName: "Electronics and Communication Engineering",
    difficulty: "Hard",
    totalMarks: 100,
    duration: 180,
    description: "Official GATE 2022 EC question paper forenoon session",
    fileUrl: "/uploads/papers/gate-2022-ec-fn.pdf",
    keywords: ["GATE", "EC", "2022", "Signals", "Communication", "Electromagnetics"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
  {
    title: "CBSE Class 12 Physics 2024 Board Exam",
    paperCode: "CBSE-PHY-12-2024",
    year: 2024,
    session: "Mar",
    examName: "CBSE",
    subjectName: "Physics",
    difficulty: "Medium",
    totalMarks: 70,
    duration: 180,
    description: "CBSE Class 12 Physics Board Examination 2024",
    fileUrl: "/uploads/papers/cbse-phy-12-2024.pdf",
    keywords: ["CBSE", "Physics", "Class12", "Board"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
  {
    title: "JEE Main 2024 January Mathematics",
    paperCode: "JEE-MAIN-JAN-2024-MATH",
    year: 2024,
    session: "Jan",
    examName: "JEE Main",
    subjectName: "Mathematics",
    difficulty: "Hard",
    totalMarks: 100,
    duration: 180,
    description: "JEE Main January 2024 Mathematics paper",
    fileUrl: "/uploads/papers/jee-main-jan-2024-math.pdf",
    solutionFileUrl: "/uploads/solutions/jee-main-jan-2024-math-solution.pdf",
    keywords: ["JEE", "Mathematics", "2024", "Calculus", "Algebra"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
    isPremium: false,
  },
  {
    title: "UGC NET June 2023 Computer Science",
    paperCode: "UGC-NET-CS-JUN-2023",
    year: 2023,
    session: "Jun",
    examName: "UGC NET",
    subjectName: "Computer Science",
    difficulty: "Medium",
    totalMarks: 150,
    duration: 180,
    description: "UGC NET June 2023 Computer Science paper",
    fileUrl: "/uploads/papers/ugc-net-cs-jun-2023.pdf",
    keywords: ["UGC", "NET", "CS", "2023", "Teaching", "Research"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
];

// GATE CS/IT Previous Papers
const GATE_CS_PAPERS = [
  {
    title: "GATE 2024 Computer Science & IT - Forenoon Session",
    paperCode: "GATE-CS-2024-FN",
    year: 2024,
    session: "Feb",
    difficulty: "Medium",
    totalMarks: 100,
    duration: 180,
    description: "Official GATE 2024 Computer Science & Information Technology complete question paper with 65 questions in 3 hours.",
    fileUrl: "https://example.com/papers/gate-2024-cs-it-fn.pdf",
    solutionFileUrl: "https://example.com/solutions/gate-2024-cs-it-fn-solution.pdf",
    keywords: ["GATE", "CS", "2024", "Computer Science", "Engineering"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
  {
    title: "GATE 2024 Computer Science & IT - Afternoon Session",
    paperCode: "GATE-CS-2024-AN",
    year: 2024,
    session: "Feb",
    difficulty: "Medium",
    totalMarks: 100,
    duration: 180,
    description: "Official GATE 2024 Computer Science & IT afternoon session question paper with 65 questions.",
    fileUrl: "https://example.com/papers/gate-2024-cs-it-an.pdf",
    solutionFileUrl: "https://example.com/solutions/gate-2024-cs-it-an-solution.pdf",
    keywords: ["GATE", "CS", "2024", "Afternoon"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
  {
    title: "GATE 2023 Computer Science & IT - Session 1",
    paperCode: "GATE-CS-2023-S1",
    year: 2023,
    session: "Feb",
    difficulty: "Hard",
    totalMarks: 100,
    duration: 180,
    description: "Official GATE 2023 Computer Science & IT Session 1 question paper featuring advanced questions on algorithms, DBMS, and networking.",
    fileUrl: "https://example.com/papers/gate-2023-cs-it-s1.pdf",
    solutionFileUrl: "https://example.com/solutions/gate-2023-cs-it-s1-solution.pdf",
    keywords: ["GATE", "CS", "2023", "DBMS", "Algorithms", "OS"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
  {
    title: "GATE 2023 Computer Science & IT - Session 2",
    paperCode: "GATE-CS-2023-S2",
    year: 2023,
    session: "Feb",
    difficulty: "Hard",
    totalMarks: 100,
    duration: 180,
    description: "Official GATE 2023 Computer Science & IT Session 2 complete question paper covering full CS syllabus.",
    fileUrl: "https://example.com/papers/gate-2023-cs-it-s2.pdf",
    solutionFileUrl: "https://example.com/solutions/gate-2023-cs-it-s2-solution.pdf",
    keywords: ["GATE", "CS", "2023", "Data Structures", "Networks"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
  {
    title: "GATE 2022 Computer Science & IT - Forenoon Session",
    paperCode: "GATE-CS-2022-FN",
    year: 2022,
    session: "Feb",
    difficulty: "Hard",
    totalMarks: 100,
    duration: 180,
    description: "Official GATE 2022 Computer Science & IT forenoon session with new exam pattern including MCQs and NAT questions.",
    fileUrl: "https://example.com/papers/gate-2022-cs-it-fn.pdf",
    solutionFileUrl: "https://example.com/solutions/gate-2022-cs-it-fn-solution.pdf",
    keywords: ["GATE", "CS", "2022", "MCQ", "NAT", "New Pattern"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
  {
    title: "GATE 2022 Computer Science & IT - Afternoon Session",
    paperCode: "GATE-CS-2022-AN",
    year: 2022,
    session: "Feb",
    difficulty: "Hard",
    totalMarks: 100,
    duration: 180,
    description: "Official GATE 2022 Computer Science & IT afternoon session with challenging MCQ and numerical answer type questions.",
    fileUrl: "https://example.com/papers/gate-2022-cs-it-an.pdf",
    solutionFileUrl: "https://example.com/solutions/gate-2022-cs-it-an-solution.pdf",
    keywords: ["GATE", "CS", "2022", "Afternoon", "Programming"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
  {
    title: "GATE 2021 Computer Science & IT - Session 1",
    paperCode: "GATE-CS-2021-S1",
    year: 2021,
    session: "Feb",
    difficulty: "Medium",
    totalMarks: 100,
    duration: 180,
    description: "Official GATE 2021 Computer Science & IT first session question paper from the 2-session online examination format.",
    fileUrl: "https://example.com/papers/gate-2021-cs-it-s1.pdf",
    solutionFileUrl: "https://example.com/solutions/gate-2021-cs-it-s1-solution.pdf",
    keywords: ["GATE", "CS", "2021", "Online Exam", "Session 1"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
  {
    title: "GATE 2021 Computer Science & IT - Session 2",
    paperCode: "GATE-CS-2021-S2",
    year: 2021,
    session: "Feb",
    difficulty: "Medium",
    totalMarks: 100,
    duration: 180,
    description: "Official GATE 2021 Computer Science & IT second session with complete exam format including all question types.",
    fileUrl: "https://example.com/papers/gate-2021-cs-it-s2.pdf",
    solutionFileUrl: "https://example.com/solutions/gate-2021-cs-it-s2-solution.pdf",
    keywords: ["GATE", "CS", "2021", "Session 2", "Full Length"],
    status: "PUBLISHED",
    isVerified: true,
    visibility: "PUBLIC",
  },
];

async function seedPreviousPapers() {
  console.log("📚 Seeding Previous Papers...");
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
      { slug: { $regex: /cs.*it|it.*cs/ } },
      { slug: "computer-science" },
      { "name.en": { $regex: /computer.*science|cs|it/ } },
      { slug: "operating-systems" }, // Fallback to OS which is part of CS
      { slug: "dbms" }, // Fallback to DBMS which is part of CS
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

    for (const paper of GATE_CS_PAPERS) {
      const slug = paper.paperCode.toLowerCase().replace(/\s+/g, "-");

      const exists = await PreviousPaper.findOne({
        slug,
        isDeleted: false,
      } as any);

      if (exists) {
        console.log(`⏭️  Skipped: ${paper.paperCode}`);
        continue;
      }

      await PreviousPaper.create({
        title: paper.title,
        paperCode: paper.paperCode,
        slug,
        year: paper.year,
        session: paper.session,
        examId: gateExam._id,
        subjectId: csSubject._id,
        difficulty: paper.difficulty,
        totalMarks: paper.totalMarks,
        duration: paper.duration,
        description: paper.description,
        paperUrl: paper.fileUrl,
        solutionFileUrl: paper.solutionFileUrl,
        keywords: paper.keywords,
        status: paper.status,
        isVerified: paper.isVerified,
        visibility: paper.visibility,
        isPremium: false,
        isActive: true,
        isDeleted: false,
        views: Math.floor(Math.random() * 5000),
        downloads: Math.floor(Math.random() * 2000),
        createdBy: "seed-admin",
      });

      console.log(`✅ Added: ${paper.paperCode}`);
      seedCount++;
    }

    await closeSeed();
    console.log(
      `🎉 Previous Papers seeding completed (${seedCount}/${GATE_CS_PAPERS.length} papers added)`
    );
  } catch (error) {
    console.error("❌ Previous Papers seeding failed", error);
    process.exit(1);
  }
}

seedPreviousPapers();
