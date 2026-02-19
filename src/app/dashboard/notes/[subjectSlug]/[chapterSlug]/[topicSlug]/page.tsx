// src/app/dashboard/notes/[subjectSlug]/[chapterSlug]/[topicSlug]/page.tsx
/**
 * Topic Notes Page
 * ================
 * Displays all notes for a specific topic
 *
 * Pattern:
 * - Server component (runs on server)
 * - Calls server service directly (NO API route)
 * - Uses auth() from lib/auth to get session
 * - UI DTOs only
 */

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Eye, Bookmark, Zap, Trophy, Star, Flame } from "lucide-react";
import { auth } from "@/lib/auth";
import { getNotesByTopic } from "@/services/server/notes.server";

interface PageProps {
  params: Promise<{ subjectSlug: string; chapterSlug: string; topicSlug: string }>;
}

// XP tiers for notes based on read count
function getXPTier(readCount?: number) {
  if (!readCount) return { label: "NEW", color: "text-slate-400 dark:text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", border: "border-slate-300 dark:border-slate-700" };
  if (readCount >= 10) return { label: "MASTERED", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-300 dark:border-amber-500/40" };
  if (readCount >= 5) return { label: "PRO", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10", border: "border-violet-300 dark:border-violet-500/40" };
  if (readCount >= 2) return { label: "LEARNING", color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-500/10", border: "border-cyan-300 dark:border-cyan-500/40" };
  return { label: "STARTED", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-300 dark:border-emerald-500/40" };
}

async function TopicNotesPage({ params }: PageProps) {
  const { subjectSlug, chapterSlug, topicSlug } = await params;

  const session = await auth();
  const userUuid = session?.user?.id;

  if (!userUuid) {
    return (
      <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-4 md:p-6 pb-24">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Unauthorized</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Please log in to continue</p>
        </div>
      </div>
    );
  }

  let data;
  let error: string | null = null;

  try {
    data = await getNotesByTopic(userUuid, subjectSlug, chapterSlug, topicSlug);
  } catch (err: any) {
    error = err?.message || "Failed to load topic notes";
    console.error("[topic-page] getNotesByTopic error:", err);
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-4 md:p-6 pb-24">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Failed to load topic notes</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const { notes, stats } = data;

  const formatTime = (seconds?: number) => {
    if (!seconds) return null;
    if (seconds < 60) return `${seconds}s`;
    return `${Math.round(seconds / 60)}m`;
  };

  const topicTitle = topicSlug.replace(/-/g, " ");

  // Compute a pseudo-completion % from notes that have been read
  const readNotes = notes.filter((n: any) => n.userActivity?.readCount > 0).length;
  const completionPct = notes.length > 0 ? Math.round((readNotes / notes.length) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen p-4 md:p-6 pb-28">

      {/* Back link */}
      <Link
        href={`/dashboard/notes/${subjectSlug}/${chapterSlug}`}
        className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Back to Topics
      </Link>

      {/* ── HERO HEADER ── */}
      <header className="mb-8">
        {/* Topic title with accent stripe */}
        <div className="flex items-start gap-4 mb-5">
          <div className="hidden sm:flex flex-col items-center gap-1 pt-1">
            <div className="w-1.5 h-8 bg-cyan-500 rounded-full" />
            <div className="w-1.5 h-4 bg-cyan-500/40 rounded-full" />
            <div className="w-1.5 h-2 bg-cyan-500/20 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500 dark:text-orange-400">
                Topic in Focus
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white capitalize leading-tight">
              {topicTitle}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              {stats.totalNotes} notes · {completionPct}% explored
            </p>
          </div>
        </div>

        {/* XP / Progress Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-200 dark:border-cyan-500/20 bg-gradient-to-br from-cyan-50 via-white to-indigo-50 dark:from-cyan-950/40 dark:via-slate-900 dark:to-indigo-950/40 p-5">
          {/* Decorative dots */}
          <div className="absolute top-0 right-0 w-40 h-40 opacity-10 dark:opacity-5"
            style={{ background: "radial-gradient(circle at 70% 30%, #06b6d4 0%, transparent 70%)" }} />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* XP orb */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Your Progress</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {readNotes}
                  <span className="text-slate-400 dark:text-slate-500 font-normal text-base"> / {notes.length} read</span>
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span>Exploration</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{completionPct}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <div className="flex gap-3 mt-2">
                {[
                  { icon: Trophy, label: `${stats.totalNotes} Notes`, color: "text-amber-600 dark:text-amber-400" },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className={`flex items-center gap-1 text-xs font-medium ${color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── NOTES LIST ── */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No notes yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Check back soon — materials are on the way!</p>
          </div>
        ) : (
          notes.map((note: any, idx: number) => {
            const tier = getXPTier(note.userActivity?.readCount);
            const timeSpent = formatTime(note.userActivity?.timeSpent);
            const isBookmarked = note.userActivity?.isBookmarked;

            return (
              <div
                key={note.id || idx}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-200
                  bg-white dark:bg-slate-900/50
                  border-slate-200 dark:border-slate-800
                  hover:border-cyan-400/60 dark:hover:border-cyan-500/40
                  hover:shadow-lg hover:shadow-cyan-500/5
                  hover:-translate-y-0.5`}
              >
                {/* Left accent bar — colored by tier */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                  tier.label === "MASTERED" ? "bg-amber-400" :
                  tier.label === "PRO" ? "bg-violet-500" :
                  tier.label === "LEARNING" ? "bg-cyan-400" :
                  tier.label === "STARTED" ? "bg-emerald-400" :
                  "bg-slate-300 dark:bg-slate-700"
                }`} />

                <div className="pl-5 pr-5 py-5 flex items-start gap-4">
                  {/* Note number badge */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/10 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        {/* Tier badge + bookmark */}
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`text-[10px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-md border ${tier.bg} ${tier.color} ${tier.border}`}>
                            {tier.label}
                          </span>
                          {isBookmarked && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-2 py-0.5 rounded-md">
                              <Bookmark className="w-3 h-3" /> Saved
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                          {note.title || `Note ${idx + 1}`}
                        </h3>

                        {note.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {note.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {note.userActivity?.readCount ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{note.userActivity.readCount}×</span>
                        </div>
                      ) : null}
                      {timeSpent && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{timeSpent}</span>
                        </div>
                      )}
                      {note.userActivity?.lastActive && (
                        <div className="text-xs text-slate-400 dark:text-slate-500">
                          {new Date(note.userActivity.lastActive).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      )}

                      {/* Stars for mastery */}
                      {note.userActivity?.readCount >= 5 && (
                        <div className="flex gap-0.5 ml-auto">
                          {Array.from({ length: Math.min(5, Math.floor((note.userActivity.readCount || 0) / 2)) }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <button
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                        bg-gradient-to-r from-cyan-500 to-indigo-500 text-white
                        hover:from-cyan-400 hover:to-indigo-400
                        shadow-sm shadow-cyan-500/20
                        transition-all duration-150 active:scale-95
                        group/btn"
                    >
                      {/* Animated book icon wrapper */}
                      <span className="relative w-4 h-4 flex items-center justify-center">
                        {/* Closed book — visible at rest, shrinks + rotates away on hover */}
                        <BookOpen
                          className="w-4 h-4 absolute transition-all duration-200
                            opacity-100 scale-100 rotate-0
                            group-hover/btn:opacity-0 group-hover/btn:scale-50 group-hover/btn:-rotate-12"
                        />
                        {/* Open book SVG — hidden at rest, pops open on hover */}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 absolute transition-all duration-300
                            opacity-0 scale-50 rotate-12
                            group-hover/btn:opacity-100 group-hover/btn:scale-110 group-hover/btn:rotate-0"
                          aria-hidden="true"
                        >
                          <path d="M12 7 C10 5, 5 5, 3 7 L3 19 C5 17.5, 10 17.5, 12 19" />
                          <path d="M12 7 C14 5, 19 5, 21 7 L21 19 C19 17.5, 14 17.5, 12 19" />
                          <line x1="12" y1="7" x2="12" y2="19" />
                          <path d="M6 10 C8 9, 10 9.5, 12 10" strokeOpacity="0.5" />
                          <path d="M18 10 C16 9, 14 9.5, 12 10" strokeOpacity="0.5" />
                        </svg>
                      </span>
                      {note.userActivity?.readCount ? "Read Again" : "Start Reading"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TopicNotesPage;