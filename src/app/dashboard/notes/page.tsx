// src/app/dashboard/notes/page.tsx
import React from 'react';
import {
  BookOpen, Library, Zap, BarChart3
} from 'lucide-react';
import { auth } from '@/lib/auth';
import { getNotesOverview } from '@/services/server/notes.server';
import { NotesHeader } from '@/components/student-dashboard/notes/NotesHeader';
import { NotesStats } from '@/components/student-dashboard/notes/NotesStats';
import { QuickResume, QuickResumeData } from '@/components/student-dashboard/notes/QuickResume';
import { StudyTools } from '@/components/student-dashboard/notes/StudyTools';
import { SubjectGrid, Subject } from '@/components/student-dashboard/notes/SubjectGrid';
import { NotesOverviewData } from '@/dto/notes.ui.dto';

/**
 * Get color config for subject
 * ============================
 */
function getSubjectConfig(subjectName: string) {

  const name = subjectName.toLowerCase();

  const subjectConfigs: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string; gradient: string }> = {
    physics: {
      icon: <Zap className="w-6 h-6" />,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/30',
      border: 'border-cyan-200 dark:border-cyan-500/20',
      gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent'
    },
    chemistry: {
      icon: <Library className="w-6 h-6" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent'
    },
    mathematics: {
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-500/20',
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent'
    },
    maths: {
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-500/20',
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent'
    },
  };

  // Return matching config or default
  for (const [key, config] of Object.entries(subjectConfigs)) {
    if (name.includes(key) || key.includes(name)) {
      return config;
    }
  }

  // Default config
  return {
    icon: <BookOpen className="w-6 h-6" />,
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800/50',
    border: 'border-slate-200 dark:border-slate-700',
    gradient: 'from-slate-500/10 via-slate-500/5 to-transparent'
  };
}

export default async function NotesPage() {
  // Get user session
  const session = await auth();
  
  if (!session?.user?.id) {
    return (
      <div className="w-full text-slate-900 dark:text-slate-200 pb-24">
        <main className="w-full p-4 space-y-8">
          <NotesHeader />
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">Please login to view notes</p>
          </div>
        </main>
      </div>
    );
  }

  // Fetch notes data directly from server service
  let data: NotesOverviewData = {
    subjects: [],
    stats: { totalNotes: 0, totalSubjects: 0 },
    recentNote: undefined,
  };

  try {
    data = await getNotesOverview(session.user.id);
  } catch (error) {
    console.error('Error fetching notes overview:', error);
  }

  // Map subjects to Subject type with configs
  const subjects: Subject[] = data.subjects.map((s) => ({
    id: s.id,
    name: s.name,
    totalNotes: s.totalNotes,
    progress: s.progress,
    ...getSubjectConfig(s.name),
  }));

  // Prepare recent note data
  let quickResumeData: QuickResumeData | undefined;
  if (data.recentNote) {
    quickResumeData = {
      topicId: data.recentNote.topicId,
      topicName: data.recentNote.topicName,
      chapterName: data.recentNote.chapterName,
      subjectName: data.recentNote.subjectName,
      progress: data.recentNote.progress,
      lastAccessed: data.recentNote.lastAccessed,
    };
  }

  const totalNotes = data.stats.totalNotes;

  return (
    <div className="w-full text-slate-900 dark:text-slate-200 pb-24 relative overflow-hidden transition-colors duration-300">
      <main className="w-full p-4 space-y-8">
        <NotesHeader />
        <NotesStats totalNotes={totalNotes} />
        <QuickResume data={quickResumeData} />
        <StudyTools />
        <SubjectGrid subjects={subjects} />
      </main>
    </div>
  );
}
