//src/app/dashboard/solved-papers/[year]/page.tsx
import React from 'react';
import YearPaperList from '@/components/student-dashboard/papers/YearPaperList';
import { notFound } from 'next/navigation';
import { getSolvedPapersByYear } from '@/services/client/solvedPaper.client';
import type { SolvedPaperCardUIDTO } from '@/dto/solvedPaper.ui.dto';

interface PageProps {
  params: Promise<{ year: string }>;
}

export default async function SolvedYearPage({ params }: PageProps) {
  const { year } = await params;
  const numericYear = parseInt(year, 10);
  if (isNaN(numericYear)) {
    return notFound();
  }

  let cards: SolvedPaperCardUIDTO[] = [];
  try {
    cards = await getSolvedPapersByYear(numericYear);
  } catch (err) {
    console.error('Error loading solved papers for year', year, err);
  }

  const papers = cards.map((c) => ({
    id: c.id,
    title: c.title,
    subjectCode: c.code,
    session: c.session,
    difficulty: c.difficulty || '',
    isVerified: c.isVerified,
    views: c.views,
  }));

  return <YearPaperList year={year} papers={papers} mode="solved" />;
}