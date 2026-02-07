'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, BookOpen, Calendar, Clock, Download, 
  Filter, X, TrendingUp, Star, Tag, Eye, ChevronRight 
} from 'lucide-react';
import {
  getSolvedPapersStats,
  getRecentSolvedPapers,
  getYearsList,
  searchSolvedPapers,
} from '@/services/client/solvedPaper.client';
import {
  SolvedPapersStatsUIDTO,
  RecentSolvedPaperUIDTO,
  YearDataUIDTO,
} from '@/dto/solvedPaper.ui.dto';

export default function SolvedPapersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [quality, setQuality] = useState<'detailed' | 'brief'>('detailed');
  const [searchResults, setSearchResults] = useState<RecentSolvedPaperUIDTO[]>([]);
  const [stats, setStats] = useState<SolvedPapersStatsUIDTO | null>(null);
  const [recentPapers, setRecentPapers] = useState<RecentSolvedPaperUIDTO[]>([]);
  const [years, setYears] = useState<YearDataUIDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, recentData, yearsData] = await Promise.all([
          getSolvedPapersStats(),
          getRecentSolvedPapers(6),
          getYearsList(),
        ]);
        setStats(statsData);
        setRecentPapers(recentData);
        setYears(yearsData);
      } catch (err) {
        console.error('Failed to load archive data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // RESTORED SEARCH LOGIC
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setIsSearching(true);
    try {
      const response: any = await searchSolvedPapers(searchQuery);
      const rawData = response.papers || (Array.isArray(response) ? response : []);
      const mappedResults: RecentSolvedPaperUIDTO[] = rawData.map((item: any) => ({
        id: item.id || item._id,
        title: item.title || 'Unknown Title',
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

  if (loading && !isSearching) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      
      {/* --- Header Section --- */}
      <header className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight flex items-center gap-3">
              <BookOpen className="text-primary w-8 h-8 md:w-12 md:h-12" /> Solved Papers
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Find step-by-step solutions and $LaTeX$ breakdowns for your exams.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="bg-secondary/40 border border-border px-4 py-2 rounded-xl flex items-center gap-3">
              <Star className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold">{stats?.totalPapers || 0} Total</span>
            </div>
            <div className="bg-secondary/40 border border-border px-4 py-2 rounded-xl flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold">Trending</span>
            </div>
          </div>
        </div>

        {/* --- Search Form (Fixed) --- */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject code or title..."
              className="w-full pl-12 pr-12 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/40 outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <button 
            type="submit"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
          >
            Search
          </button>
          <button 
            type="button"
            onClick={() => setQuality(q => q === 'detailed' ? 'brief' : 'detailed')}
            className="px-6 py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-all"
          >
            {quality === 'detailed' ? 'Detailed' : 'Brief'}
          </button>
        </form>
      </header>

      <main className="space-y-12">
        
        {/* --- Search Results View --- */}
        {isSearching ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-bold">Search Results</h2>
              <button onClick={clearSearch} className="text-sm text-primary font-bold">Back to Archive</button>
            </div>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults.map(paper => (
                  <PaperRectangle key={paper.id} paper={paper} quality={quality} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-secondary/10 rounded-3xl border-2 border-dashed border-border">
                <p className="text-muted-foreground">No papers found matching "{searchQuery}"</p>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* --- Recent Solutions --- */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-500" /> Recent Solutions
                </h2>
                <Link href="#" className="text-xs font-bold text-primary flex items-center gap-1 uppercase tracking-widest">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {recentPapers.map(paper => (
                  <PaperRectangle key={paper.id} paper={paper} quality={quality} />
                ))}
              </div>
            </section>

            {/* --- Browse by Year (Rectangular Grid) --- */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Browse by Year
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {years.map((item) => (
                  <Link
                    href={`/dashboard/solved-papers/${item.year}`}
                    key={item.year}
                    className="group p-5 bg-secondary/20 border border-border rounded-2xl flex items-center justify-between hover:border-primary/50 hover:bg-secondary/40 transition-all"
                  >
                    <div>
                      <span className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{item.year}</span>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Academic Year</p>
                    </div>
                    <div className="bg-background/50 px-3 py-1.5 rounded-xl border border-border text-center">
                      <div className="text-sm font-black text-foreground">{item.paperCount}</div>
                      <div className="text-[8px] uppercase text-muted-foreground font-bold">Papers</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

// --- Rectangular Card Component ---
function PaperRectangle({ paper, quality }: { paper: RecentSolvedPaperUIDTO, quality: 'detailed' | 'brief' }) {
  return (
    <div className="group bg-background border border-border rounded-2xl p-5 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <span className="px-2.5 py-1 bg-secondary text-[10px] font-bold rounded-lg tracking-wider text-secondary-foreground uppercase">
            {paper.code}
          </span>
          <button className="text-muted-foreground hover:text-primary transition-colors p-1">
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div>
          <Link href={`/dashboard/solved-papers/${paper.year}/${paper.id}`}>
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight">
              {paper.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-xs text-muted-foreground font-medium">{paper.year} • {paper.session}</span>
             <span className="w-1 h-1 rounded-full bg-border" />
             <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                <Eye className="w-3 h-3" /> 1.4k
             </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${quality === 'detailed' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${quality === 'detailed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-muted'}`} />
          {quality === 'detailed' ? 'Verified' : 'Summary'}
        </span>
        <Link 
          href={`/dashboard/solved-papers/${paper.year}/${paper.id}`}
          className="text-[11px] font-black text-primary uppercase tracking-tighter hover:underline"
        >
          View Solution
        </Link>
      </div>
    </div>
  );
}