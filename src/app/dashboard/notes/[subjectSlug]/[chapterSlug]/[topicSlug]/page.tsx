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
import { ArrowLeft, BookOpen, Clock, Eye, Bookmark } from "lucide-react";
import { auth } from "@/lib/auth";
import { getNotesByTopic } from "@/services/server/notes.server";

interface PageProps {
  params: Promise<{ subjectSlug: string; chapterSlug: string; topicSlug: string }>;
}

async function TopicNotesPage({ params }: PageProps) {
  const { subjectSlug, chapterSlug, topicSlug } = await params;

  // Get session from auth
  const session = await auth();
  const userUuid = session?.user?.id;

  if (!userUuid) {
    return (
      <div className="bg-slate-950 text-slate-200 p-4 md:p-6 pb-24">
        <div className="text-center">
          <p className="text-red-400">Unauthorized</p>
          <p className="text-sm text-slate-400 mt-2">Please log in to continue</p>
        </div>
      </div>
    );
  }

  let data;
  let error: string | null = null;

  try {
    // Call server service directly
    data = await getNotesByTopic(userUuid, subjectSlug, chapterSlug, topicSlug);
  } catch (err: any) {
    error = err?.message || "Failed to load topic notes";
    console.error("[topic-page] getNotesByTopic error:", err);
  }

  if (error || !data) {
    return (
      <div className="bg-slate-950 text-slate-200 p-4 md:p-6 pb-24">
        <div className="text-center">
          <p className="text-red-400">Failed to load topic notes</p>
          <p className="text-sm text-slate-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const { notes, stats } = data;

  // Format time helper
  const formatTime = (seconds?: number) => {
    if (!seconds) return "Not started";
    if (seconds < 60) return `${seconds}s`;
    return `${Math.round(seconds / 60)}m`;
  };

  return (
    <div className="bg-slate-950 text-slate-200 p-4 md:p-6 pb-24">
      {/* Header */}
      <header className="mb-8">
        <Link
          href={`/dashboard/notes/${subjectSlug}/${chapterSlug}`}
          className="inline-flex items-center text-sm text-slate-400 hover:text-cyan-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Topics
        </Link>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white capitalize">
              {topicSlug.replace(/-/g, " ")}
            </h1>
            <p className="text-slate-400 mt-1">
              Study notes and materials for this topic.
            </p>
          </div>

          <div className="text-right hidden md:block">
            <div className="text-2xl font-bold text-cyan-400">{stats.totalNotes}</div>
            <div className="text-xs text-slate-500">Notes Available</div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-6 bg-slate-900/50 rounded-lg border border-slate-800 p-4">
          <p className="text-sm text-slate-300 font-semibold mb-3">Topic Overview</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400">Total Notes</p>
              <p className="text-lg font-bold text-cyan-400 mt-1">{stats.totalNotes}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No notes available for this topic</p>
            <p className="text-sm text-slate-500 mt-2">Check back soon for more materials</p>
          </div>
        ) : (
          notes.map((note: any, idx: number) => (
            <div
              key={note.id || idx}
              className="group bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Note Icon */}
                <div className="mt-1 flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

                {/* Note Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {note.title || `Note ${idx + 1}`}
                      </h3>
                      {note.description && (
                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                          {note.description}
                        </p>
                      )}
                    </div>
                    {note.userActivity?.isBookmarked && (
                      <Bookmark className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    )}
                  </div>

                  {/* Note Metadata */}
                  <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-400">
                    {note.userActivity?.readCount && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{note.userActivity.readCount} views</span>
                      </div>
                    )}
                    {note.userActivity?.timeSpent && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(note.userActivity.timeSpent)}</span>
                      </div>
                    )}
                    {note.userActivity?.lastActive && (
                      <div className="text-slate-500">
                        Last: {new Date(note.userActivity.lastActive).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Read Note Button */}
                  <button className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Read Note
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TopicNotesPage;
