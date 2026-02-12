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

  // Notice: No "if (!data) return loading" here. 
  // We pass nulls to the component, and the component shows the flash cards.
  return (
    <UnifiedArchiveView 
      mode="previous"
      stats={data?.stats}
      recentPapers={data?.recent}
      years={data?.years}
      onSearch={async (q) => {
        const res: any = await searchPreviousPapers(q);
        const rawPapers = res.papers || (Array.isArray(res) ? res : []);
        return rawPapers.map((item: any) => ({
          id: item._id || item.id,
          title: item.title || item.subject || "Untitled Paper",
          code: item.paperCode || item.code || "N/A",
          year: item.year || "2026",
          session: item.session || "Annual",
          dateAdded: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.dateAdded || "Recently")
        }));
      }}
    />
  );
}