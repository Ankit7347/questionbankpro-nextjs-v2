// src/app/dashboard/notes/formulas/page.tsx
import { NotesHeader } from '@/components/student-dashboard/notes/NotesHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Plus,
  Search,
  Calculator,
  Sigma,
  FileText,
  Star,
  Clock,
  MoreVertical,
  Atom,
  FlaskConical,
  Zap,
  TrendingUp,
  BookOpen,
  ChevronRight
} from 'lucide-react';

const DUMMY_DATA = {
  stats: [
    { label: 'Total Formulas', value: '1,240', icon: Sigma, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Cheat Sheets', value: '24', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Favorites', value: '86', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Calculations', value: '3.2k', icon: Calculator, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ],
  recentSheets: [
    {
      id: 1,
      title: 'Physics: Kinematics & Dynamics',
      subject: 'Physics',
      count: 45,
      lastViewed: '2 hours ago',
      icon: Atom,
      color: 'text-cyan-500',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 2,
      title: 'Calculus: Integration Rules',
      subject: 'Mathematics',
      count: 128,
      lastViewed: '1 day ago',
      icon: Sigma,
      color: 'text-purple-500',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: 'Organic Chemistry Reactions',
      subject: 'Chemistry',
      count: 64,
      lastViewed: '3 days ago',
      icon: FlaskConical,
      color: 'text-emerald-500',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      title: 'Trigonometric Identities',
      subject: 'Mathematics',
      count: 32,
      lastViewed: '5 days ago',
      icon: Zap,
      color: 'text-orange-500',
      gradient: 'from-orange-500 to-red-500'
    }
  ],
  subjects: [
    { name: 'Mathematics', count: 12, icon: Calculator },
    { name: 'Physics', count: 8, icon: Atom },
    { name: 'Chemistry', count: 6, icon: FlaskConical },
    { name: 'Biology', count: 4, icon: BookOpen },
  ]
};

export default function FormulasPage() {
  return (
    <div className="w-full text-slate-900 dark:text-slate-200 pb-24">
      <main className="w-full space-y-8">
        <NotesHeader />

        <div className="px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Formulas</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Access your cheat sheets and mathematical equations.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search formulas..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                <Plus className="w-5 h-5 mr-2" />
                New Sheet
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
            {/* Left Column: Recent Sheets */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Recent Sheets
                </h2>
                <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">View All</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DUMMY_DATA.recentSheets.map((sheet) => (
                  <GlassCard key={sheet.id} className="group relative overflow-hidden hover:ring-2 hover:ring-indigo-500/50 transition-all duration-300">
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${sheet.gradient}`} />
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                          <sheet.icon className={`w-6 h-6 ${sheet.color}`} />
                        </div>
                        <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {sheet.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {sheet.subject} • {sheet.count} formulas
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {sheet.lastViewed}
                        </span>
                        <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Open <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
              {/* Formula of the Day */}
              <GlassCard className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  Formula of the Day
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 mb-4">
                  <p className="text-center font-serif text-lg text-slate-800 dark:text-slate-200">
                    E = mc²
                  </p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Mass-Energy Equivalence</span>
                </p>
                <p className="text-xs text-slate-400">
                  In physics, mass–energy equivalence is the relationship between mass and energy in a system's rest frame.
                </p>
              </GlassCard>

              {/* Subjects */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  Subjects
                </h3>
                <div className="space-y-3">
                  {DUMMY_DATA.subjects.map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                          <sub.icon className="w-4 h-4" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {sub.name}
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {sub.count}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors border border-dashed border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700">
                  + Add Subject
                </button>
              </GlassCard>

              {/* Quick Tools */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Quick Tools
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-center group">
                        <Calculator className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Calculator</span>
                    </button>
                    <button className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-center group">
                        <Sigma className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Converter</span>
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