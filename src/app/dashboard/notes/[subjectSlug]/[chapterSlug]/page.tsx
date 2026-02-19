// src/app/dashboard/notes/[subjectSlug]/[chapterSlug]/page.tsx
/**
 * Chapter Notes Page
 * ==================
 * Displays topics within a chapter with progress tracking
 * 
 * Pattern:
 * - Server component (runs on server)
 * - Calls server service directly (NO API route)
 * - Uses auth() from lib/auth to get session
 * - UI DTOs only
 */

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { auth } from "@/lib/auth";
import { getNotesByChapter } from "@/services/server/notes.server";
import { TopicData } from "@/dto/notes.ui.dto";

interface PageProps {
  params: Promise<{ subjectSlug: string; chapterSlug: string }>;
}

async function ChapterNotesPage({ params }: PageProps) {
  const { subjectSlug, chapterSlug } = await params;

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
    data = await getNotesByChapter(userUuid, subjectSlug, chapterSlug);
  } catch (err: any) {
    error = err?.message || "Failed to load chapter topics";
    console.error("[chapter-page] getNotesByChapter error:", err);
  }

  if (error || !data) {
    return (
      <div className="bg-slate-950 text-slate-200 p-4 md:p-6 pb-24">
        <div className="text-center">
          <p className="text-red-400">Failed to load chapter topics</p>
          <p className="text-sm text-slate-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const { chapter, topics, stats } = data;
  const totalProgress = topics.length > 0
    ? Math.round(topics.reduce((sum, t) => sum + t.progress, 0) / topics.length)
    : 0;

  return (
    <div className="bg-slate-950 text-slate-200 p-4 md:p-6 pb-24">
      {/* Header */}
      <header className="mb-8">
        <Link
          href={`/dashboard/notes/${subjectSlug}`}
          className="inline-flex items-center text-sm text-slate-400 hover:text-cyan-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Chapters
        </Link>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white capitalize">
              {chapter.title}
            </h1>
            <p className="text-slate-400 mt-1">
              Explore topics and master your understanding.
            </p>
          </div>

          <div className="text-right hidden md:block">
            <div className="text-2xl font-bold text-cyan-400">{totalProgress}%</div>
            <div className="text-xs text-slate-500">Topics Completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-slate-900 rounded-full h-2">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400">Total Topics</p>
            <p className="text-xl font-bold text-cyan-400">{stats.totalTopics}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400">Total Notes</p>
            <p className="text-xl font-bold text-cyan-400">{stats.totalNotes}</p>
          </div>
        </div>
      </header>

      {/* Topics List */}
      <div className="space-y-4">
        {topics.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No topics available yet</p>
            <p className="text-sm text-slate-500 mt-2">Check back soon for more content</p>
          </div>
        ) : (
          topics.map((topic: TopicData) => (
            <Link
              key={topic.slug}
              href={`/dashboard/notes/${subjectSlug}/${chapterSlug}/${topic.slug}`}
            >
              <div className="m-2 group bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  {/* Progress Icon */}
                  <div className="mt-1">
                    {topic.progress === 100 ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : topic.progress > 0 ? (
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <Circle className="w-6 h-6 text-slate-700" />
                        <span className="absolute text-[10px] font-bold text-cyan-400">
                          {topic.progress}%
                        </span>
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-slate-700" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {topic.title}
                      </h3>
                      <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {topic.notesCount} Notes
                      </span>
                    </div>

                    {/* Topic Progress Bar */}
                    <div className="mt-3 w-full bg-slate-800 rounded-full h-1">
                      <div
                        className="bg-cyan-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${topic.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default ChapterNotesPage;
