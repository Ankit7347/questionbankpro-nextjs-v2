"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Star, TrendingUp, BookOpen, Tag, Shuffle } from 'lucide-react';

// --- Interfaces ---
interface SolutionStep {
  id: string;
  title?: string;
  body: string; // can contain LaTeX inline markers like $...$ or $$...$$
}

interface SolvedPaper {
  id: string;
  title: string;
  subject: string;
  year: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  views: number;
  isVerified: boolean;
  isPremium?: boolean;
  shortDescription?: string;
  questionCount: number;
  sampleSteps?: SolutionStep[];
}

interface SubjectGroup {
  subject: string;
  papers: SolvedPaper[];
}

// --- Helper components ---
const ExpertBadge: React.FC<{ verified?: boolean }> = ({ verified }) => (
  <span className={`text-xs px-2 py-1 rounded-full text-slate-900 ${verified ? 'bg-emerald-400' : 'bg-slate-700'} font-semibold`}> 
    {verified ? 'Verified Solutions' : "Community"}
  </span>
);

const LatexInline: React.FC<{ latex: string }> = ({ latex }) => {
  // NOTE: For production replace this with KaTeX/MathJax render.
  return <code className="bg-slate-800/60 px-1 rounded text-cyan-300 font-mono">{latex}</code>;
};

export default function SolvedPapersPage() {
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [quality, setQuality] = useState<'detailed' | 'brief'>('detailed');
  const [data, setData] = useState<{ stats: any; subjects: SubjectGroup[]; trending: SolvedPaper[] } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/dashboard/solved-papers');
        const json = await res.json();
        if (mounted) setData(json);
      } catch (err) {
        console.error('Failed to load solved papers data', err);
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  const subjectList = useMemo(() => data?.subjects.map(s => s.subject) ?? [], [data]);

  const filteredSubjects = useMemo(() => {
    if (!data) return [];
    if (query.trim()) {
      const q = query.toLowerCase();
      return data.subjects.map(s => ({
        ...s,
        papers: s.papers.filter(p => p.title.toLowerCase().includes(q) || (p.shortDescription || '').toLowerCase().includes(q)),
      })).filter(s => s.papers.length > 0);
    }
    if (subjectFilter) {
      return data.subjects.filter(s => s.subject === subjectFilter);
    }
    return data.subjects;
  }, [data, query, subjectFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-serif">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-cyan-400" /> Solved Papers
            </h1>
            <p className="text-slate-400 mt-1 max-w-xl">Curated, step-by-step solutions and concept callouts to master exam papers. Toggle solution quality while browsing.</p>
          </div>

          <div className="w-full md:w-auto mt-3 md:mt-0">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by topic, question, or keyword..."
                className="block w-full pl-10 pr-12 py-3 border border-slate-800 rounded-xl leading-5 bg-slate-900/60 text-slate-300 placeholder-slate-500 focus:outline-none sm:text-sm h-12"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-2">
                <button
                  onClick={() => setQuality(q => q === 'detailed' ? 'brief' : 'detailed')}
                  className="px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-slate-200 hover:bg-slate-800 transition"
                >
                  {quality === 'detailed' ? 'Detailed' : 'Brief'}
                </button>
                <button
                  onClick={() => { setQuery(''); setSubjectFilter(null); }}
                  className="p-2 rounded-lg hover:bg-slate-800"
                  title="Clear"
                >
                  <Shuffle className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats & Trending */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Star className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Solved Papers</p>
                <p className="text-xl font-bold text-white">{data?.stats?.totalSolved ?? '—'}</p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Trending</p>
                <p className="text-xl font-bold text-white">{data?.trending?.length ?? 0}</p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Tag className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Subjects</p>
                <p className="text-xl font-bold text-white">{subjectList.length}</p>
              </div>
            </div>
          </div>

          {/* Trending mini list */}
          <div className="mt-4 md:mt-0 w-full md:w-1/3">
            <h3 className="text-sm text-slate-400 mb-2">Most-Viewed Solutions</h3>
            <div className="flex gap-2 overflow-x-auto">
              {data?.trending?.map((t) => (
                <Link
                  key={t.id}
                  href={`/dashboard/solved-papers/${t.year}/${t.id}`}
                  className="min-w-[180px] bg-slate-900/40 border border-slate-800 rounded-xl p-3 hover:border-cyan-400/30 transition flex gap-3 items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white truncate">{t.title}</h4>
                      <span className="text-xs text-slate-400">{t.views} views</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 truncate">{t.subject} • {t.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Subjects List */}
      <main className="space-y-8">
        {filteredSubjects.length === 0 && (
          <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-xl text-slate-400">No results. Try a different query or select a subject.</div>
        )}

        {filteredSubjects.map((group) => (
          <section key={group.subject} id={`subject-${group.subject}`} className="bg-slate-900/20 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-white">{group.subject}</h2>
                <ExpertBadge verified={group.papers.some(p => p.isVerified)} />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSubjectFilter(prev => prev === group.subject ? null : group.subject)} className="text-sm text-slate-400 hover:text-white">{subjectFilter === group.subject ? 'Clear' : 'Filter'}</button>
                <Link href={`/dashboard/solved-papers/${group.papers[0]?.year ?? ''}`} className="text-sm text-cyan-300 hover:underline">View by Year</Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {group.papers.map((paper) => (
                <article key={paper.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 hover:border-cyan-400/20 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-white font-semibold truncate">{paper.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{paper.subject} • {paper.year} • {paper.difficulty}</p>
                    </div>
                    <div className="text-right">
                      {paper.isPremium && <span className="text-xs text-amber-300">Premium</span>}
                      <div className="text-xs text-slate-400">Q: {paper.questionCount}</div>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mt-3">{paper.shortDescription}</p>

                  {/* Quick peek steps */}
                  <div className="mt-3 space-y-2">
                    {(quality === 'detailed' ? paper.sampleSteps?.slice(0, 3) : paper.sampleSteps?.slice(0,1))?.map(s => (
                      <div key={s.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                        {s.title && <div className="text-xs text-slate-400 mb-1">{s.title}</div>}
                        <div className="text-sm text-slate-200">
                          {/* Primitive latex detection */}
                          {s.body.includes('$') ? <LatexInline latex={s.body} /> : <span>{s.body}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Link href={`/dashboard/solved-papers/${paper.year}/${paper.id}`} className="text-sm text-cyan-300 hover:underline">Open Paper</Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{paper.views} views</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Floating Index Button */}
      <div className="fixed right-4 bottom-6 md:right-8 md:bottom-8">
        <a href="#top" className="bg-cyan-400 text-slate-900 p-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
          Index
        </a>
      </div>
    </div>
  );
}
