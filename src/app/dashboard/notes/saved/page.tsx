// src/app/dashboard/notes/saved/page.tsx
import { NotesHeader } from '@/components/student-dashboard/notes/NotesHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Bookmark,
  Search,
  Plus,
  Folder,
  Star,
  Clock,
  FileText,
  Tag,
  ArrowRight,
  Filter,
  SortAsc
} from 'lucide-react';

const DUMMY_DATA = {
  stats: [
    { label: 'Total Saved', value: '142', icon: Bookmark, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Favorites', value: '18', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Folders', value: '8', icon: Folder, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'This Week', value: '+12', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ],
  savedNotes: [
    {
      id: 1,
      title: 'Introduction to Quantum Mechanics',
      subject: 'Physics',
      preview: 'Wave-particle duality is the concept in quantum mechanics that every particle or quantum entity may be described as either a particle or a wave.',
      date: '2 days ago',
      tags: ['Quantum', 'Basics'],
      isFavorite: true,
      color: 'text-cyan-500',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20'
    },
    {
      id: 2,
      title: 'Cellular Respiration Steps',
      subject: 'Biology',
      preview: 'Cellular respiration is a set of metabolic reactions and processes that take place in the cells of organisms to convert chemical energy from oxygen molecules.',
      date: '5 days ago',
      tags: ['Metabolism', 'Cells'],
      isFavorite: false,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      id: 3,
      title: 'Calculus II: Series & Sequences',
      subject: 'Mathematics',
      preview: 'In mathematics, a sequence is an enumerated collection of objects in which repetitions are allowed and order matters.',
      date: '1 week ago',
      tags: ['Calculus', 'Math'],
      isFavorite: true,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 4,
      title: 'Organic Chemistry: Alkanes',
      subject: 'Chemistry',
      preview: 'Alkanes are acyclic saturated hydrocarbons. In other words, an alkane consists of hydrogen and carbon atoms arranged in a tree structure.',
      date: '2 weeks ago',
      tags: ['Organic', 'Chemistry'],
      isFavorite: false,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ],
  folders: [
    { name: 'Exam Prep', count: 24, color: 'text-red-500' },
    { name: 'Research Projects', count: 15, color: 'text-blue-500' },
    { name: 'Quick Reference', count: 42, color: 'text-green-500' },
    { name: 'Archive', count: 61, color: 'text-slate-500' },
  ]
};

export default function SavedNotesPage() {
  return (
    <div className="w-full text-slate-900 dark:text-slate-200 pb-24">
      <main className="w-full space-y-8">
        <NotesHeader />

        <div className="px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Saved Notes</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Access your bookmarked content and organized collections.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search saved notes..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                <Plus className="w-5 h-5 mr-2" />
                New Collection
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DUMMY_DATA.stats.map((stat, index) => (
              <GlassCard key={index} className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Saved Notes List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  Recent Saves
                </h2>
                <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                        <SortAsc className="w-4 h-4" />
                    </button>
                </div>
              </div>

              <div className="space-y-4">
                {DUMMY_DATA.savedNotes.map((note) => (
                  <GlassCard key={note.id} className="group p-5 hover:border-indigo-500/30 transition-all duration-300">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl shrink-0 ${note.bg}`}>
                            <FileText className={`w-6 h-6 ${note.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate pr-4">
                                        {note.title}
                                    </h3>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        {note.subject}
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        {note.date}
                                    </p>
                                </div>
                                <button className={`p-1.5 rounded-lg transition-colors ${note.isFavorite ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                    <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                                {note.preview}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {note.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                            <Tag className="w-3 h-3" /> {tag}
                                        </span>
                                    ))}
                                </div>
                                <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Read Note <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
              {/* Collections/Folders */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Folder className="w-5 h-5 text-indigo-500" />
                    Collections
                    </h3>
                    <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Edit</button>
                </div>
                <div className="space-y-3">
                  {DUMMY_DATA.folders.map((folder, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <Folder className={`w-4 h-4 ${folder.color} fill-current opacity-20`} />
                        <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {folder.name}
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {folder.count}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors border border-dashed border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700">
                  + New Collection
                </button>
              </GlassCard>

              {/* Quick Actions */}
              <GlassCard className="p-6">
                 <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Quick Actions
                 </h3>
                 <div className="space-y-2">
                    <button className="w-full p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                        <Bookmark className="w-4 h-4" />
                        Import Bookmarks
                    </button>
                    <button className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                        <FileText className="w-4 h-4" />
                        Export All Notes
                    </button>
                 </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}