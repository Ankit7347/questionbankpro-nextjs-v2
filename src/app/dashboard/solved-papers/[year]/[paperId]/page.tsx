// src/app/dashboard/solved-papers/[year]/[paperId]/page.tsx
import { notFound } from 'next/navigation';
import PaperView from '@/components/student-dashboard/papers/PaperView';
import { getSolvedPaperById } from '@/services/client/solvedPaper.client';

interface PageProps {
  params: Promise<{
    year: string;
    paperId: string;
  }>;
}

export default async function SolvedPaperDetailPage({ params }: PageProps) {
  const { year, paperId } = await params;

  let paper;
  try {
    paper = await getSolvedPaperById(paperId);
  } catch (err) {
    console.error('Error loading solved paper', paperId, err);
    return notFound();
  }

  // Validate year matches paper data
  if (paper.year.toString() !== year) {
    return notFound();
  }

  const isSolvedRoute = true;

  return (
    <PaperView 
      paper={paper} 
      solution={null}
      mode={isSolvedRoute ? 'solved' : 'previous'}
      year={year}
    />
  );
}
