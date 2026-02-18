// src/components/student-dashboard/notes/NotesStats.tsx
import { Library, Clock, CheckCircle2, Bookmark } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface NotesStatsProps {
  totalNotes: number;
  totalStudyHours?: number;
  completedNotes?: number;
  bookmarkedNotes?: number;
}

export const NotesStats = ({ 
  totalNotes, 
  totalStudyHours = 0,
  completedNotes = 0,
  bookmarkedNotes = 0
}: NotesStatsProps) => (
  <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <GlassCard className="p-4 flex flex-col gap-2 from-blue-500 to-cyan-500">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Library className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Notes</span>
      </div>
      <div className="text-xl font-bold text-slate-900 dark:text-white pl-1">
        {totalNotes}
      </div>
    </GlassCard>

    <GlassCard className="p-4 flex flex-col gap-2 from-purple-500 to-pink-500">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
          <Clock className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Study Time</span>
      </div>
      <div className="text-xl font-bold text-slate-900 dark:text-white pl-1">
        {totalStudyHours}h
      </div>
    </GlassCard>

    <GlassCard className="p-4 flex flex-col gap-2d from-emerald-500 to-teal-500">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed</span>
      </div>
      <div className="text-xl font-bold text-slate-900 dark:text-white pl-1">
        {completedNotes}
      </div>
    </GlassCard>

    <GlassCard className="p-4 flex flex-col gap-2d from-amber-500 to-orange-500">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Bookmark className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Saved</span>
      </div>
      <div className="text-xl font-bold text-slate-900 dark:text-white pl-1">
        {bookmarkedNotes}
      </div>
    </GlassCard>
  </section>
);