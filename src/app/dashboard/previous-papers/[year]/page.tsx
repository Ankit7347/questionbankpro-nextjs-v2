// src/app/dashboard/previous-papers/[year]/page.tsx
import YearPaperList from '@/components/student-dashboard/papers/YearPaperList';
import { notFound } from 'next/navigation';

const MOCK_PAPERS = [
  // --- Semester 3 (College) ---
  { id: 'p1', title: 'Data Structures & Algorithms', subjectCode: 'CS301', session: 'Semester 3', difficulty: 'Hard', isVerified: true, views: 5420 },
  { id: 'p2', title: 'Operating Systems', subjectCode: 'CS302', session: 'Semester 3', difficulty: 'Medium', isVerified: true, views: 3210 },
  { id: 'p3', title: 'Computer Networks', subjectCode: 'CS303', session: 'Semester 3', difficulty: 'Hard', isVerified: true, views: 4100 },

  // --- Semester 1 (College) ---
  { id: 'p4', title: 'Engineering Mathematics-I', subjectCode: 'MA101', session: 'Semester 1', difficulty: 'Hard', isVerified: true, views: 8900 },
  { id: 'p5', title: 'Applied Physics', subjectCode: 'PH101', session: 'Semester 1', difficulty: 'Medium', isVerified: false, views: 2300 },
  { id: 'p6', title: 'Programming in C', subjectCode: 'CS101', session: 'Semester 1', difficulty: 'Easy', isVerified: true, views: 12400 },

  // --- Annual Exam (School/Board) ---
  { id: 'p7', title: 'Science (Physics & Chemistry)', subjectCode: 'SCI-X', session: 'Annual Exam', difficulty: 'Medium', isVerified: true, views: 15600 },
  { id: 'p8', title: 'Social Science', subjectCode: 'SST-X', session: 'Annual Exam', difficulty: 'Easy', isVerified: true, views: 9800 },

  // --- Competitive/Shift Exams ---
  { id: 'p9', title: 'General Awareness (Morning Shift)', subjectCode: 'GK-SHIFT1', session: 'Competitive Shift', difficulty: 'Medium', isVerified: true, views: 7200 },
  { id: 'p10', title: 'Quantitative Aptitude (Evening Shift)', subjectCode: 'QA-SHIFT2', session: 'Competitive Shift', difficulty: 'Hard', isVerified: true, views: 6500 },
];

interface PageProps {
  params: Promise<{ year: string }>;
}

export default async function SolvedYearPage({ params }: PageProps) {
  // NEXT.JS 15: Await params
  const { year } = await params;

  // For testing, we only allow 2026. Change this when connecting to DB.
  if (year !== "2026") {
    return notFound();
  }

  return (
    <YearPaperList 
      year={year} 
      papers={MOCK_PAPERS} 
      mode="previous" 
    />
  );
}