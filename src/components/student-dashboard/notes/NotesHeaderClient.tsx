// src/components/student-dashboard/notes/NotesHeaderClient.tsx
'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface NotesHeaderClientProps {
  searchPlaceholder?: string;
  showKeyboardShortcut?: boolean;
  keyboardShortcut?: string;
  onSearch?: (query: string) => void;
}

export const NotesHeaderClient: React.FC<NotesHeaderClientProps> = ({
  searchPlaceholder = 'Search for notes, topics, or tags...',
  showKeyboardShortcut = true,
  keyboardShortcut = '⌘K',
  onSearch,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className="relative group mx-1">
      {/* Subtle glow on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500" />

      <div className="relative flex items-center bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all backdrop-blur-sm">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5 shrink-0" />

        <input
          type="text"
          placeholder={searchPlaceholder}
          onChange={handleSearchChange}
          className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:outline-none"
        />

        {showKeyboardShortcut && (
          <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {keyboardShortcut}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};