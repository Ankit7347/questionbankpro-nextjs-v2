import { initSeed, closeSeed } from "./_helpers";
import BestBook from "../../models/mongoose/BestBook.schema";
import Exam from "../../models/mongoose/Exam.schema";
import SubExam from "../../models/mongoose/SubExam.schema";
import Subject from "../../models/mongoose/Subject.schema";

const EXAM_SLUG = "gate-exam";
const SUB_EXAM_SLUG = "gate-2026-cs-it";
const IMAGE_URL = "/images/sample-book.png";

const BOOKS_DATA = [
  {
    subjectSlug: "operating-systems",
    books: [
      {
        title: "Operating System Concepts",
        author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
        description: "Known as the 'Dinosaur Book', this is the standard text for Operating Systems concepts used in GATE preparation.",
        tags: ["Operating Systems", "Standard Text", "GATE"],
      },
      {
        title: "Modern Operating Systems",
        author: "Andrew S. Tanenbaum",
        description: "A deep dive into operating system design and implementation details.",
        tags: ["Operating Systems", "Tanenbaum", "Reference"],
      },
    ],
  },
  {
    subjectSlug: "dbms",
    books: [
      {
        title: "Database System Concepts",
        author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
        description: "The definitive guide to database concepts, covering SQL, normalization, and transaction management.",
        tags: ["DBMS", "Korth", "GATE"],
      },
      {
        title: "Fundamentals of Database Systems",
        author: "Ramez Elmasri, Shamkant B. Navathe",
        description: "Excellent resource for understanding the theoretical foundations of database systems.",
        tags: ["DBMS", "Elmasri", "Navathe"],
      },
    ],
  },
];

export async function seedBestBooks() {
  console.log("📚 Seeding Best Books...");
  await initSeed();

  try {
    // 1. Fetch Exam and SubExam
    const exam = await Exam.findOne({ slug: EXAM_SLUG });
    if (!exam) throw new Error(`Exam '${EXAM_SLUG}' not found`);

    const subExam = await SubExam.findOne({ slug: SUB_EXAM_SLUG });
    if (!subExam) throw new Error(`SubExam '${SUB_EXAM_SLUG}' not found`);

    let createdCount = 0;

    // 2. Iterate through data
    for (const item of BOOKS_DATA) {
      // Find Subject
      // Note: We search by slug to match the syllabus seed
      const subject = await Subject.findOne({ slug: item.subjectSlug });
      
      if (!subject) {
        console.warn(`⚠️ Subject '${item.subjectSlug}' not found. Skipping books for this subject.`);
        continue;
      }

      for (const book of item.books) {
        // Check if book exists to avoid duplicates
        const existingBook = await BestBook.findOne({
          title: book.title,
          subExamId: subExam._id,
          subjectId: subject._id,
        });

        if (existingBook) {
          console.log(`⏭️ Skipped: ${book.title}`);
          continue;
        }

        await BestBook.create({
          title: book.title,
          author: book.author,
          examId: exam._id,
          subExamId: subExam._id,
          subjectId: subject._id,
          imageUrl: IMAGE_URL,
          description: book.description,
          tags: book.tags,
          isActive: true,
        });

        console.log(`✅ Added: ${book.title}`);
        createdCount++;
      }
    }

    console.log(`🎉 Best Books seeding completed. Added ${createdCount} books.`);
  } catch (error) {
    console.error("❌ Best Books seeding failed:", error);
  } finally {
    await closeSeed();
  }
}

seedBestBooks();
