import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Play } from 'lucide-react';

interface SolutionStep {
  id: string;
  title?: string;
  body: string; // may contain LaTeX markers
  callout?: string; // concept callout
}

interface PaperData {
  id: string;
  title: string;
  subject: string;
  year: string;
  isVerified: boolean;
  isPremium?: boolean;
  videoLink?: string;
  questions: Array<{ qid: string; questionText: string }>;
  solutionSteps: SolutionStep[];
  conclusion?: string;
}

interface PageProps {
  params: Promise<{
    year: string;
    paperId: string;
  }>;
}

export default async function SolvedPaperDetail({ params }: PageProps) {
  const { year, paperId } = await params;

  // Fetch the paper data from API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/dashboard/solved-papers/${year}/${paperId}`, { cache: 'no-store' });
  const json = await res.json();
  const paper: PaperData = json?.paper;

  if (!paper) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-serif">
        <Link href="/dashboard/solved-papers" className="text-slate-400 hover:text-cyan-300 inline-flex items-center gap-2 mb-4"> 
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-xl">Paper not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-serif">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link href="/dashboard/solved-papers" className="text-slate-400 hover:text-cyan-300 inline-flex items-center gap-2 mb-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="text-3xl font-extrabold text-white">{paper.title}</h1>
          <p className="text-xs text-slate-400 mt-1">{paper.subject} • {paper.year} {paper.isVerified && <span className="ml-2 inline-block px-2 py-0.5 bg-emerald-400 text-slate-900 text-xs rounded">Verified</span>}</p>
        </div>

        <div className="flex items-center gap-3">
          {paper.videoLink && (
            <a href={paper.videoLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-cyan-400 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:opacity-95">
              <Play className="w-4 h-4" /> Video Solution
            </a>
          )}
        </div>
      </div>

      {/* Split view: Question | Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Questions */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Question Paper</h2>
          <ol className="list-decimal ml-5 space-y-3 text-slate-200">
            {paper.questions.map(q => (
              <li key={q.qid} className="text-sm">{q.questionText}</li>
            ))}
          </ol>
        </div>

        {/* Right: Solutions */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Solution (Step-by-step)</h2>
          <div className="space-y-4">
            {paper.solutionSteps.map(step => (
              <div key={step.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                {step.title && <div className="text-xs text-slate-400 mb-1">{step.title}</div>}
                <div className="text-slate-200 text-sm">
                  {/* Simple latex placeholder; replace with KaTeX for real rendering */}
                  {step.body.includes('$') ? (
                    <code className="bg-slate-800/60 px-1 rounded text-cyan-300 font-mono">{step.body}</code>
                  ) : (
                    <span>{step.body}</span>
                  )}
                </div>
                {step.callout && <div className="mt-3 text-xs text-slate-400 bg-slate-800/40 rounded p-2">{step.callout}</div>}
              </div>
            ))}

            {paper.conclusion && (
              <div className="mt-2 p-4 bg-slate-900/60 border border-cyan-400 rounded-lg">
                <div className="text-xs text-slate-300">Final Answer</div>
                <div className="text-white font-semibold mt-1">{paper.conclusion}</div>
              </div>
            )}

            {paper.isPremium && (
              <div className="mt-4 p-4 bg-amber-900/10 border border-amber-700 rounded-lg text-amber-300">
                This is a premium solution. Subscribe to view interactive steps and full derivations.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
