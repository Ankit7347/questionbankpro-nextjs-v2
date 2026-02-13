// src/app/dashboard/previous-papers/[year]/page.tsx
import React from 'react';
import YearPaperList from '@/components/student-dashboard/papers/YearPaperList';
import { notFound } from 'next/navigation';
import { getPreviousPapersByYear } from '@/services/client/previousPaper.client';
import type { PreviousPaperCardUIDTO } from '@/dto/previousPaper.ui.dto';

interface PageProps {
  params: Promise<{ year: string }>;
}

export default async function PreviousYearPage({ params }: PageProps){
  const { year } = await params;

  // validate year param
  const numericYear = parseInt(year, 10);
  if (isNaN(numericYear)) {
    return notFound();
  }

  // fetch data through client helper (works on server since it uses fetch)
  let cards: PreviousPaperCardUIDTO[] = [];
  try {
    cards = await getPreviousPapersByYear(numericYear);
  } catch (err) {
    console.error('Error loading previous papers for year', year, err);
    // keep cards empty
  }

  // if there are no papers and you want 404, uncomment below
  // if (!cards.length) return notFound();

  // map to the shape YearPaperList expects
  const papers = cards.map((c): any => ({
    id: c.id,
    title: c.title,
    subjectCode: c.paperCode,  // UI list uses subjectCode for display
    session: c.session,
    difficulty: c.difficulty || '',
    isVerified: c.isVerified,
    views: c.views,
  }));

  return <YearPaperList year={year} papers={papers} mode="previous" />;
}