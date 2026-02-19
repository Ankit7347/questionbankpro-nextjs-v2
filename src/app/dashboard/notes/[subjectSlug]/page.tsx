// src/app/dashboard/notes/[subjectSlug]/page.tsx
/**
 * Subject Notes Page
 * ==================
 * Displays chapters within a subject with progress tracking
 *
 * Pattern:
 * - Server component (runs on server)
 * - Calls server service directly (NO API route - avoids session cookie issues)
 * - Uses auth() from lib/auth to get session
 * - UI DTOs only, no mongoose/server-side data leakage
 */

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { auth } from "@/lib/auth";
import { getNotesBySubject } from "@/services/server/notes.server";
import { ChapterData } from "@/dto/notes.ui.dto";

interface PageProps {
  params: Promise<{ subjectSlug: string }>;
}

async function SubjectNotesPage({ params }: PageProps) {
  const { subjectSlug } = await params;

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
    data = await getNotesBySubject(userUuid, subjectSlug);
  } catch (err: any) {
    error = err?.message || "Failed to load subject chapters";
    console.error("[notes-page] getNotesBySubject error:", err);
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-4 md:p-6 pb-24">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Failed to load subject chapters</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const { subject, chapters, stats } = data;
  const totalProgress =
    chapters.length > 0
      ? Math.round(chapters.reduce((sum, ch) => sum + ch.progress, 0) / chapters.length)
      : 0;

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-4 md:p-6 pb-24">
      {/* Header */}
      <header className="mb-8">
        <Link
          href="/dashboard/notes"
          className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Library
        </Link>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">
              {subject.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Master the curriculum chapter by chapter.
            </p>
          </div>

          <div className="text-right hidden md:block">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{totalProgress}%</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">Total Completion</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Chapters</p>
            <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{stats.totalChapters}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Notes</p>
            <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{stats.totalNotes}</p>
          </div>
        </div>
      </header>

      {/* Chapters List */}
      <div className="space-y-4">
        {chapters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No chapters available</p>
          </div>
        ) : (
          chapters.map((chapter: ChapterData) => (
            <Link
              key={chapter.slug}
              href={`/dashboard/notes/${subjectSlug}/${chapter.slug}`}
            >
              <div className="group bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 dark:hover:border-cyan-500/30 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  {/* Progress Icon */}
                  <div className="mt-1">
                    {chapter.progress === 100 ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : chapter.progress > 0 ? (
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <Circle className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                        <span className="absolute text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                          {chapter.progress}%
                        </span>
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {chapter.title}
                      </h3>
                      <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                        {chapter.completedTopics}/{chapter.totalTopics} Topics
                      </span>
                    </div>
                    {chapter.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {chapter.description}
                      </p>
                    )}

                    {/* Chapter Progress Bar */}
                    <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1">
                      <div
                        className="bg-cyan-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${chapter.progress}%` }}
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

export default SubjectNotesPage;