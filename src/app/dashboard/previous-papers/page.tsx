// src/app/dashboard/previous-papers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, FileText, Calendar, Clock, Download, Filter, X } from 'lucide-react';
import {
  getPreviousPapersStats,
  getRecentPreviousPapers,
  getYearsList,
  searchPreviousPapers,
} from '@/services/client/previousPaper.client';
import {
  PreviousPapersStatsUIDTO,
  RecentPreviousPaperUIDTO,
  YearDataUIDTO,
} from '@/dto/previousPaper.ui.dto';

function PreviousPapersSkeleton() {
  return (
    <div className="text-foreground p-4 md:p-8 font-sans max-w-7xl mx-auto animate-pulse">
      {/* --- Header & Stats Skeleton --- */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-4 w-96 max-w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-40 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="w-full sm:w-40 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>

        {/* --- Search Bar Skeleton --- */}
        <div className="w-full md:max-w-2xl h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </header>

      {/* --- Recently Added Section Skeleton --- */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full sm:w-72 h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      </section>

      {/* --- Year Selection Grid Skeleton --- */}
      <section>
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function PreviousPapersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<RecentPreviousPaperUIDTO[]>([]);
  const [stats, setStats] = useState<PreviousPapersStatsUIDTO | null>(null);
  const [recentPapers, setRecentPapers] = useState<RecentPreviousPaperUIDTO[]>([]);
  const [years, setYears] = useState<YearDataUIDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, recentData, yearsData] = await Promise.all([
          getPreviousPapersStats(),
          getRecentPreviousPapers(4),
          getYearsList(),
        ]);

        setStats(statsData);
        setRecentPapers(recentData);
        setYears(yearsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
        console.error('Error loading previous papers:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setIsSearching(true);
    try {
      const response: any = await searchPreviousPapers(searchQuery);
      const rawData = response.papers || (Array.isArray(response) ? response : []);
      const mappedResults: RecentPreviousPaperUIDTO[] = rawData.map((item: any) => ({
        id: item.id || item._id,
        subject: item.title || item.subject || 'Unknown Subject',
        code: item.paperCode || item.code || 'N/A',
        year: item.year?.toString() || '',
        session: item.session || '',
        dateAdded: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.dateAdded || '')
      }));
      setSearchResults(mappedResults);
    } catch (err) {
      console.error('Error searching papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  if (loading) {
    return (
      <PreviousPapersSkeleton />
    );
  }

  if (error) {
    return (
      <div className="text-foreground p-4 md:p-8 font-sans max-w-7xl mx-auto">
        <div className="text-center py-12 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="text-foreground p-4 md:p-8 font-sans max-w-7xl mx-auto">
      {/* --- Header & Stats --- */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-7 h-7 md:w-8 md:h-8 text-blue-500" />
              Previous Papers Archive
            </h1>
            <p className="text-slate-400">
              Access past examination papers, marking schemes, and resources.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <div className="w-full sm:w-auto bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 flex items-center gap-3 min-h-16 shadow-sm hover:shadow-md transition">
              <div className="p-2 bg-blue-500/10 rounded-md">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Papers</p>
                <p className="text-xl font-bold text-foreground">{stats?.totalPapers || 0}</p>
              </div>
            </div>
            <div className="w-full sm:w-auto bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 flex items-center gap-3 min-h-16 shadow-sm hover:shadow-md transition">
              <div className="p-2 bg-emerald-500/10 rounded-md">
                <Download className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Downloads</p>
                <p className="text-xl font-bold text-foreground">{(stats?.totalDownloads || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Search Bar --- */}
        <form onSubmit={handleSearch} className="relative w-full md:max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all h-12"
            placeholder="Search by subject code (e.g., CS101) or keyword..."
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
             {isSearching && (
               <button
                 type="button"
                 onClick={clearSearch}
                 className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors h-10 w-10 flex items-center justify-center text-slate-500"
               >
                 <X className="h-5 w-5" />
               </button>
             )}
             <button type="submit" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors h-10 w-10 flex items-center justify-center">
                <Filter className="h-5 w-5 text-slate-500" />
             </button>
          </div>
        </form>
      </header>

      {isSearching ? (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
              Search Results
            </h2>
          </div>
          {searchResults.length > 0 ? (
            <div className="grid gap-4">
              {searchResults.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-blue-500 transition-all group cursor-pointer shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-md font-mono">
                        {paper.code}
                      </span>
                      <span className="text-xs text-muted-foreground">{paper.dateAdded}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-500 transition-colors">
                      {paper.subject}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {paper.year} • {paper.session}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                     <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-500 transition-colors">
                        <Download className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No papers found</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                We couldn't find any previous papers matching "{searchQuery}". Try searching for a different subject code or keyword.
              </p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* --- Recently Added Section --- */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Recently Added
              </h2>
              <Link href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors h-12 flex items-center">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {recentPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="w-full sm:w-72 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-blue-500 transition-all group cursor-pointer active:scale-95 shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-md font-mono">
                      {paper.code}
                    </span>
                    <span className="text-xs text-muted-foreground">{paper.dateAdded}</span>
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-medium mb-1 group-hover:text-blue-500 transition-colors">
                    {paper.subject}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {paper.year} • {paper.session}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* --- Year Selection Grid --- */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Browse by Year
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {years.map((item) => (
                <Link
                  href={`/dashboard/previous-papers/${item.year}`}
                  key={item.year}
                  className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-blue-500/30 transition-all active:scale-95 group min-h-28"
                >
                  <span className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-blue-500 mb-2">
                    {item.year}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-200 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                    {item.paperCount} Papers
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}