// src/app/dashboard/notes/flashcards/page.jsx
import { NotesHeader } from '@/components/student-dashboard/notes/NotesHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Plus, 
  Play, 
  Clock, 
  Layers, 
  Brain, 
  Search, 
  MoreVertical,
  Trophy,
  Flame,
  TrendingUp
} from 'lucide-react';

const DUMMY_DATA = {
  stats: [
    { label: 'Total Decks', value: '12', icon: Layers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Cards Learned', value: '854', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Day Streak', value: '7', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Mastery Level', value: 'Pro', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ],
  recentDecks: [
    {
      id: 1,
      title: 'Human Anatomy: Skeletal System',
      count: 45,
      mastery: 75,
      lastStudied: '2 hours ago',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      id: 2,
      title: 'Pharmacology: Antibiotics',
      count: 32,
      mastery: 45,
      lastStudied: '1 day ago',
      color: 'from-emerald-500 to-teal-400'
    },
    {
      id: 3,
      title: 'Pathology: Cardiovascular',
      count: 68,
      mastery: 90,
      lastStudied: '3 days ago',
      color: 'from-rose-500 to-pink-400'
    },
    {
      id: 4,
      title: 'Medical Terminology 101',
      count: 120,
      mastery: 15,
      lastStudied: '5 days ago',
      color: 'from-violet-500 to-purple-400'
    }
  ],
  categories: [
    { name: 'Anatomy', count: 5 },
    { name: 'Physiology', count: 3 },
    { name: 'Pharmacology', count: 2 },
    { name: 'Pathology', count: 2 },
  ]
};

export default function FlashcardsPage() {
  return (
    <div className="w-full text-slate-900 dark:text-slate-200 pb-24">
      <main className="w-full space-y-8">
        <NotesHeader />
        
        <div className="px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Flashcards</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Review and master your study materials efficiently.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search decks..." 
                  className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                <Plus className="w-5 h-5 mr-2" />
                Create Deck
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
            {/* Left Column: Recent Decks */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Recent Decks
                </h2>
                <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">View All</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DUMMY_DATA.recentDecks.map((deck) => (
                  <GlassCard key={deck.id} className="group relative overflow-hidden hover:ring-2 hover:ring-indigo-500/50 transition-all duration-300">
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${deck.color}`} />
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {deck.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {deck.count} cards
                          </p>
                        </div>
                        <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400">Mastery</span>
                          <span className="font-medium text-slate-900 dark:text-white">{deck.mastery}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${deck.color} rounded-full`} 
                            style={{ width: `${deck.mastery}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {deck.lastStudied}
                        </span>
                        <button className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
              {/* Quick Study */}
              <GlassCard className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-500" />
                  Quick Study
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Ready for a quick session? We've selected 20 cards for review based on your spaced repetition schedule.
                </p>
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  Start Session
                </button>
              </GlassCard>

              {/* Categories */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500" />
                  Categories
                </h3>
                <div className="space-y-3">
                  {DUMMY_DATA.categories.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                      <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {cat.name}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {cat.count}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors border border-dashed border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700">
                  + Add Category
                </button>
              </GlassCard>

              {/* Daily Goal */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Daily Goal
                  </h3>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                    On Track
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Cards Reviewed</span>
                    <span className="font-medium text-slate-900 dark:text-white">45 / 50</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[90%]" />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Just 5 more cards to reach your daily goal!
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}