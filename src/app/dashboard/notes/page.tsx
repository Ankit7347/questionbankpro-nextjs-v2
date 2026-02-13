// src/app/dashboard/notes/page.tsx

import React from 'react';
import { 
  BookOpen, Library, Zap, BarChart3
} from 'lucide-react';
import { BackgroundDecor } from '@/components/student-dashboard/notes/BackgroundDecor';
import { NotesHeader } from '@/components/student-dashboard/notes/NotesHeader';
import { NotesStats } from '@/components/student-dashboard/notes/NotesStats';
import { QuickResume, QuickResumeData } from '@/components/student-dashboard/notes/QuickResume';
import { StudyTools } from '@/components/student-dashboard/notes/StudyTools';
import { SubjectGrid, Subject } from '@/components/student-dashboard/notes/SubjectGrid';


async function getNotesOverview() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/dashboard/notes`, { cache: 'no-store' });
    if (!res.ok) return { subjects: [], stats: { totalNotes: 0 } };
    return res.json();
  } catch (error) {
    return { subjects: [], stats: { totalNotes: 0 } };
  }
}

const subjectConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string; gradient: string }> = {
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
  maths: { 
    icon: <BarChart3 className="w-6 h-6" />, 
    color: 'text-purple-600 dark:text-purple-400', 
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-500/20',
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent' 
  },
};

const quickResume: QuickResumeData = {
  topicId: 'thermodynamics-intro',
  topicName: 'Laws of Thermodynamics',
  chapterName: 'Thermodynamics',
  subjectName: 'Physics',
  progress: 75,
  lastAccessed: '2h ago',
};

export default async function NotesPage() {
  const data = await getNotesOverview();
  
  const subjects: Subject[] = data.subjects.map((s: any) => ({
    ...s,
    ...(subjectConfig[s.id] || { 
      icon: <BookOpen className="w-6 h-6" />, 
      color: 'text-slate-500 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800/50',
      border: 'border-slate-200 dark:border-slate-700',
      gradient: 'from-slate-500/10 via-slate-500/5 to-transparent'
    })
  }));
  const totalNotes = data.stats.totalNotes;

  return (
    <div className="w-full text-slate-900 dark:text-slate-200 pb-24 relative overflow-hidden transition-colors duration-300">
      <BackgroundDecor />
      <NotesHeader />
      <main className="w-full p-4 space-y-8">
        <NotesStats totalNotes={totalNotes} />
        <QuickResume data={quickResume} />
        <StudyTools />
        <SubjectGrid subjects={subjects} />
      </main>
    </div>
  );
}
