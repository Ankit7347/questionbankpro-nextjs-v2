// src/app/dashboard/solved-papers/page.tsx

'use client';
import UnifiedArchiveView from '@/components/student-dashboard/papers/UnifiedArchiveView';
import { getSolvedPapersStats, getRecentSolvedPapers, getYearsList, searchSolvedPapers } from '@/services/client/solvedPaper.client';
import { useEffect, useState } from 'react';

export default function SolvedArchive() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const [stats, recent, years] = await Promise.all([
          getSolvedPapersStats(), 
          getRecentSolvedPapers(6), 
          getYearsList()
        ]);
        setData({ stats, recent, years });
      } catch (error) {
        console.error("Failed to load solved archive:", error);
      }
    })();
  }, []);

  // Removed the "Loading Solved Archive..." text div 
  // UnifiedArchiveView will now handle the skeleton state internally
  return (
    <UnifiedArchiveView 
      mode="solved"
      stats={data?.stats}
      recentPapers={data?.recent}
      years={data?.years}
      onSearch={async (q) => {
        const res: any = await searchSolvedPapers(q);
        
        // Extract array: handles { papers: [] } or just []
        const rawPapers = res.papers || (Array.isArray(res) ? res : []);

        // Transform data to match the UI's PaperItem interface
        return rawPapers.map((item: any) => ({
          id: item._id || item.id,
          title: item.title || item.subject || "Untitled Solution",
          code: item.paperCode || item.code || "N/A",
          year: item.year || "2026",
          session: item.session || "Annual",
          dateAdded: item.createdAt 
            ? new Date(item.createdAt).toLocaleDateString() 
            : (item.dateAdded || "Recently")
        }));
      }}
    />
  );
}