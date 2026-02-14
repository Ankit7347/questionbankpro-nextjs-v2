import { initSeed, closeSeed } from "./_helpers";
import Quiz from "../../models/mongoose/Quiz.schema";
import Question from "../../models/mongoose/Question.schema";
import Exam from "../../models/mongoose/Exam.schema";
import SubExam from "../../models/mongoose/SubExam.schema";
import Subject from "../../models/mongoose/Subject.schema";
import Chapter from "../../models/mongoose/Chapter.schema";
import Topic from "../../models/mongoose/Topic.schema";

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
      { text: { en: "O(1)" }, isCorrect: false },
    ],
    explanation: {
      en: "Binary search reduces the search space by half each step.",
      hi: "बाइनरी सर्च हर चरण में खोज क्षेत्र को आधा करता है।"
    },
    marks: 2,
    difficulty: "Medium"
  },
  {
    content: {
      en: "Which data structure uses LIFO principle?",
      hi: "कौन सी डेटा स्ट्रक्चर LIFO सिद्धांत का उपयोग करती है?"
    },
    type: "MCQ",
    options: [
      { text: { en: "Queue" }, isCorrect: false },
      { text: { en: "Stack" }, isCorrect: true },
      { text: { en: "Tree" }, isCorrect: false },
      { text: { en: "Graph" }, isCorrect: false },
    ],
    explanation: {
      en: "Stack follows Last In First Out (LIFO) principle.",
      hi: "स्टैक अंतिम आगत प्रथम आउटपुट (LIFO) सिद्धांत का पालन करता है।"
    },
    marks: 1,
    difficulty: "Easy"
  },
  {
    content: {
      en: "What is the space complexity of quicksort?",
      hi: "क्विकसॉर्ट की अंतरिक्ष जटिलता क्या है?"
    },
    type: "MCQ",
    options: [
      { text: { en: "O(1)" }, isCorrect: false },
      { text: { en: "O(log n)" }, isCorrect: true },
      { text: { en: "O(n)" }, isCorrect: false },
      { text: { en: "O(n log n)" }, isCorrect: false },
    ],
    explanation: {
      en: "Quicksort uses O(log n) space for recursive call stack in average case.",
      hi: "क्विकसॉर्ट औसत स्थिति में पुनरावर्ती कॉल स्टैक के लिए O(log n) स्पेस का उपयोग करता है।"
    },
    marks: 2,
    difficulty: "Hard"
  },
  {
    content: {
      en: "Which sorting algorithm is stable?",
      hi: "कौन सा सॉर्टिंग एल्गोरिथ्म स्थिर है?"
    },
    type: "MCQ",
    options: [
      { text: { en: "Quicksort" }, isCorrect: false },
      { text: { en: "Heapsort" }, isCorrect: false },
      { text: { en: "Merge sort" }, isCorrect: true },
      { text: { en: "Selection sort" }, isCorrect: false },
    ],
    explanation: {
      en: "Merge sort is a stable sorting algorithm that maintains the relative order of equal elements.",
      hi: "मर्ज सॉर्ट एक स्थिर सॉर्टिंग एल्गोरिथ्म है जो समान तत्वों के सापेक्ष क्रम को बनाए रखता है।"
    },
    marks: 2,
    difficulty: "Medium"
  }
];

/* ======================================================
   🔹 SEED FUNCTION
====================================================== */

async function seedQuiz() {
  console.log("🎯 Seeding Quiz with Questions...");
  await initSeed();

  try {
    // Find Exam (GATE)
    const exam = await Exam.findOne({ slug: "gate-exam", isDeleted: false });
    if (!exam) throw new Error("Exam 'gate-exam' not found");
    console.log(`✓ Found Exam: ${exam.name.en}`);

    // Find SubExam (GATE 2026 CS/IT)
    const subExam = await SubExam.findOne({
      slug: "gate-2026-cs-it",
      isDeleted: false,
    });
    if (!subExam) throw new Error("SubExam 'gate-2026-cs-it' not found");
    console.log(`✓ Found SubExam: ${subExam.name.en}`);

    // Find or create Subject
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
    console.log(`✓ Found Subject: ${subject.name.en}`);

    // Find or create Chapter
    let chapter = await Chapter.findOne({
      slug: "data-structures-dsa",
      isDeleted: false,
    });

    if (!chapter) {
      chapter = await Chapter.create({
        name: {
          en: "Data Structures & Algorithms",
          hi: "डेटा संरचनाएं और एल्गोरिथ्म"
        },
        slug: "data-structures-dsa",
        subjectId: subject._id,
        description: "Learn fundamental data structures and their algorithms",
        displayOrder: 1,
        createdBy: "seed-admin",
      });
      console.log(`✓ Created Chapter: ${chapter.name.en}`);
    } else {
      console.log(`✓ Found Chapter: ${chapter.name.en}`);
    }

    // Find or create Topic
    let topic = await Topic.findOne({
      slug: "sorting-algorithms-gate-2026",
      isDeleted: false,
    });

    if (!topic) {
      topic = await Topic.create({
        name: {
          en: "Sorting Algorithms",
          hi: "सॉर्टिंग एल्गोरिथ्म"
        },
        slug: "sorting-algorithms-gate-2026",
        chapterId: chapter._id,
        subjectId: subject._id,
        description: "Master various sorting algorithms and their complexities",
        displayOrder: 1,
        createdBy: "seed-admin",
      });
      console.log(`✓ Created Topic: ${topic.name.en}`);
    } else {
      console.log(`✓ Found Topic: ${topic.name.en}`);
    }

    // Create Questions
    console.log("\n📝 Creating Questions...");
    const createdQuestions = await Question.insertMany(
      QUESTIONS_JSON.map((q, index) => ({
        ...q,
        subjectId: subject._id,
        chapterId: chapter._id,
        topicId: topic._id,
        displayOrder: index + 1,
        createdBy: "seed-admin",
      }))
    );

    const questionIds = createdQuestions.map(q => q._id);
    console.log(`✓ Created ${createdQuestions.length} questions`);

    // Check if quiz already exists
    const existingQuiz = await Quiz.findOne({
      subExamId: subExam._id,
      topicId: topic._id,
      isDeleted: false,
    });

    if (existingQuiz) {
      console.log(`⏭️ Quiz already exists, skipping creation`);
      await closeSeed();
      return;
    }

    // Create Quiz
    console.log("\n🎯 Creating Quiz...");
    const quiz = await Quiz.create({
      title: {
        en: "Sorting Algorithms - GATE 2026 Practice Quiz",
        hi: "सॉर्टिंग एल्गोरिथ्म - GATE 2026 प्रैक्टिस क्विज"
      },
      description: {
        en: "Practice quiz covering sorting algorithms with time and space complexity analysis",
        hi: "समय और स्पेस जटिलता विश्लेषण के साथ सॉर्टिंग एल्गोरिथ्म को कवर करने वाली प्रैक्टिस क्विज"
      },
      slug: "sorting-algorithms-gate-2026-quiz",
      
      // Hierarchy
      examId: exam._id,
      subExamId: subExam._id,
      subjectId: subject._id,
      chapterId: chapter._id,
      topicId: topic._id,
      
      // Questions & Scoring
      questionIds,
      totalQuestions: questionIds.length,
      totalMarks: 7, // 2 + 1 + 2 + 2 = 7
      marksPerQuestion: 1.75,
      durationMinutes: 10,
      
      // Quiz Configuration
      quizType: "topic", // topic, chapter, subject, full_syllabus, mock_test
      negativeMarking: {
        enabled: true,
        marksPerWrongAnswer: 0.5,
      },
      
      // Status
      isPublished: true,
      publishedAt: new Date(),
      
      // Metadata
      displayOrder: 1,
      isPremium: false,
      isVerified: true,
      difficulty: "Medium",
      views: 0,
      totalAttempts: 0,
      totalRatings: 0,
      averageRating: 0,
      
      // Meta
      metaTitle: "Sorting Algorithms Quiz - GATE 2026",
      metaDescription: "Practice MCQ quiz on sorting algorithms for GATE 2026 preparation",
      keywords: ["sorting", "algorithms", "gate", "quiz", "practice"],
      tags: ["gate", "dsa", "algorithms", "2026"],
      
      createdBy: "seed-admin",
    });

    console.log(`✅ Created Quiz: ${quiz.title.en}`);
    console.log(`   • Questions: ${quiz.totalQuestions}`);
    console.log(`   • Total Marks: ${quiz.totalMarks}`);
    console.log(`   • Duration: ${quiz.durationMinutes} minutes`);
    console.log(`   • Negative Marking: ${quiz.negativeMarking.enabled ? `Yes (-${quiz.negativeMarking.marksPerWrongAnswer} per wrong)` : "No"}`);

    console.log("\n🎉 Seeding Completed Successfully!");
    await closeSeed();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await closeSeed();
    process.exit(1);
  }
}

seedQuiz();
