// src/app/dashboard/previous-papers/[year]/[paperId]/page.tsx
import { notFound } from 'next/navigation';
import PaperView from '@/components/student-dashboard/papers/PaperView';
import { getPreviousPaperById } from '@/services/client/previousPaper.client';

interface PageProps {
  params: Promise<{
    year: string;
    paperId: string;
  }>;
}

export default async function PaperDetailPage({ params }: PageProps){
  const { year, paperId } = await params;

  let paper;
  try {
    paper = await getPreviousPaperById(paperId);
  } catch (err) {
    console.error('Error loading previous paper', paperId, err);
    return notFound();
  }

  // Validate year matches paper data
  if (paper.year.toString() !== year) {
    return notFound();
  }

  const isSolvedRoute = false;

  return (
    <PaperView 
      paper={paper} 
      solution={null}
      mode={isSolvedRoute ? 'solved' : 'previous'}
      year={year}
    />
  );
}
