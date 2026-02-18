// src/components/student-dashboard/notes/NotesHeader.tsx
import React from 'react';
import { BookOpen, Flame, LucideIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { NotesHeaderClient } from './NotesHeaderClient';

export interface UserProfile {
  initials: string;
  streakCount: number;
  name: string;
}

export interface NotesHeaderProps {
  title?: string;
  subtitle?: string;
  user?: UserProfile;
  searchPlaceholder?: string;
  showKeyboardShortcut?: boolean;
  keyboardShortcut?: string;
  headerIcon?: LucideIcon;
  className?: string;
}

export const NotesHeader: React.FC<NotesHeaderProps> = ({
  title = 'Library',
  subtitle = 'Welcome back, Architect.',
  user,
  searchPlaceholder = 'Search for notes, topics, or tags...',
  showKeyboardShortcut = true,
  keyboardShortcut = '⌘K',
  headerIcon: HeaderIcon = BookOpen,
  className = '',
}) => {
  const displaySubtitle = user?.name
    ? subtitle.replace('Architect', user.name)
    : subtitle;

  return (
    <header className={`sticky top-0 z-20 ${className}`}>
      <GlassCard className="w-full border-b border-slate-200 dark:border-white/5 rounded-lg">
        <div className="px-3 py-3 space-y-3">

          {/* Static header row — rendered on the server */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                <HeaderIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400 fill-cyan-400/20" />
                {title}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {displaySubtitle}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400">
                  <Flame className="w-4 h-4 fill-orange-500/20" />
                  <span className="text-xs font-bold">{user.streakCount}</span>
                </div>
              )}

              {user && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-px">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-white">
                      {user.initials}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive search — hydrated on the client */}
          <NotesHeaderClient
            searchPlaceholder={searchPlaceholder}
            showKeyboardShortcut={showKeyboardShortcut}
            keyboardShortcut={keyboardShortcut}
          />

        </div>
      </GlassCard>
    </header>
  );
};