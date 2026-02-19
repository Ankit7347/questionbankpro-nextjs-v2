// src/app/dashboard/notes/summaries/page.tsx
import { NotesHeader } from '@/components/student-dashboard/notes/NotesHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Plus,
  Search,
  FileText,
  Sparkles,
  BarChart3,
  Clock,
  MoreVertical,
  UploadCloud,
  Link as LinkIcon,
  Clipboard,
  Globe,
  ChevronRight,
  ArrowRight,
  File,
} from 'lucide-react';

const DUMMY_DATA = {
  stats: [
    { label: 'Total Summaries', value: '38', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'AI-Generated', value: '32', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Words Reduced', value: '87%', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Time Saved', value: '~14 hours', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ],
  recentSummaries: [
    {
      id: 1,
      title: "Summary of 'The Selfish Gene'",
      sourceType: 'PDF Upload',
      originalLength: '115,000 words',
      summaryLength: '2,300 words',
      date: '1 day ago',
      icon: File,
      color: 'text-red-500',
    },
    {
      id: 2,
      title: 'Lecture Notes on Photosynthesis',
      sourceType: 'Pasted Text',
      originalLength: '3,200 words',
      summaryLength: '450 words',
      date: '3 days ago',
      icon: Clipboard,
      color: 'text-blue-500',
    },
    {
      id: 3,
      title: 'Web Article: The Future of AI',
      sourceType: 'Web Article',
      originalLength: '5,000 words',
      summaryLength: '600 words',
      date: '5 days ago',
      icon: Globe,
      color: 'text-emerald-500',
    },
  ],
  sources: [
    { name: 'Web Articles', count: 15, icon: Globe },
    { name: 'PDFs', count: 12, icon: File },
    { name: 'Text Uploads', count: 11, icon: Clipboard },
  ]
};

export default function SummariesPage() {
  return (
    <div className="w-full text-slate-900 dark:text-slate-200 pb-24">
      <main className="w-full space-y-8">
        <NotesHeader />

        <div className="px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Summaries</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                AI-powered summaries of your study materials.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search summaries..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                <Plus className="w-5 h-5 mr-2" />
                New Summary
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
            {/* Left Column: Recent Summaries */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Recent Summaries
                </h2>
                <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">View All</button>
              </div>

              <div className="space-y-4">
                {DUMMY_DATA.recentSummaries.map((summary) => (
                  <GlassCard key={summary.id} className="group p-5 hover:border-indigo-500/30 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <summary.icon className={`w-6 h-6 ${summary.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate pr-4">
                              {summary.title}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{summary.sourceType}</p>
                          </div>
                          <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                          <span>{summary.originalLength}</span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{summary.summaryLength}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {summary.date}
                        </span>
                        <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
              {/* Create Summary */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  Create a New Summary
                </h3>
                <div className="space-y-3">
                  <button className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-left flex items-center gap-3 group">
                    <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Upload a file</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">PDF, DOCX, TXT</p>
                    </div>
                  </button>
                  <button className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-left flex items-center gap-3 group">
                    <LinkIcon className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">From a URL</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Web articles, blog posts</p>
                    </div>
                  </button>
                  <button className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-left flex items-center gap-3 group">
                    <Clipboard className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Paste text</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Copy & paste any content</p>
                    </div>
                  </button>
                </div>
              </GlassCard>

              {/* Sources */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  Sources
                </h3>
                <div className="space-y-3">
                  {DUMMY_DATA.sources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                          <source.icon className="w-4 h-4" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {source.name}
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {source.count}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}