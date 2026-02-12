// src/app/dashboard/previous-papers/page.tsx
'use client';
import UnifiedArchiveView from '@/components/student-dashboard/papers/UnifiedArchiveView';
import { getPreviousPapersStats, getRecentPreviousPapers, getYearsList, searchPreviousPapers } from '@/services/client/previousPaper.client';
import { useEffect, useState } from 'react';

export default function PreviousArchive() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const [stats, recent, years] = await Promise.all([
          getPreviousPapersStats(), 
          getRecentPreviousPapers(6), 
          getYearsList()
        ]);
        setData({ stats, recent, years });
      } catch (error) {
        console.error("Failed to fetch archive data:", error);
      }
    })();
  }, []);

  if (!data) return <div className="p-10 animate-pulse text-slate-500 font-black uppercase text-xs tracking-widest">Loading Archive...</div>;

  return (
    <UnifiedArchiveView 
      mode="previous"
      stats={data.stats}
      recentPapers={data.recent}
      years={data.years}
      onSearch={async (q) => {
        const res: any = await searchPreviousPapers(q);
        // Extract the array from the response (handles { papers: [...] } or [...])
        const rawPapers = res.papers || (Array.isArray(res) ? res : []);

        // MAP the data to match the PaperItem interface exactly
        return rawPapers.map((item: any) => ({
          id: item._id || item.id,
          title: item.title || item.subject || "Untitled Paper",
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