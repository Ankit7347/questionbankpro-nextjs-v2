// Folder: app/dashboard/notes/page.tsx
import React from 'react';
import Link from 'next/link';
import { 
  Search, BookOpen, Clock, Library, Zap, BarChart3, 
  ChevronRight, Flame, Trophy, TrendingUp, Sparkles, MoreVertical 
} from 'lucide-react';

// Interfaces for data
interface Subject {
  id: string;
  name: string;
  icon: React.ReactNode;
  totalNotes: number;
  progress: number;
  color: string;
  gradient: string;
}

interface QuickResume {
  topicId: string;
  topicName: string;
  chapterName: string;
  subjectName: string;
  progress: number;
  lastAccessed: string;
}

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

const subjectConfig: Record<string, { icon: React.ReactNode; color: string; gradient: string }> = {
  physics: { 
    icon: <Zap className="w-6 h-6" />, 
    color: 'text-cyan-400', 
    gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent' 
  },
  chemistry: { 
    icon: <Library className="w-6 h-6" />, 
    color: 'text-emerald-400', 
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent' 
  },
  maths: { 
    icon: <BarChart3 className="w-6 h-6" />, 
    color: 'text-purple-400', 
    gradient: 'from-purple-500/20 via-purple-500/5 to-transparent' 
  },
};

const quickResume: QuickResume = {
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
      color: 'text-slate-400',
      gradient: 'from-slate-500/20 via-slate-500/5 to-transparent'
    })
  }));
  const totalNotes = data.stats.totalNotes;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-950/20 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Search */}
      <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
              <BookOpen className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
              Library
            </h1>
            <p className="text-xs text-slate-400 font-medium">Welcome back, Architect.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <Flame className="w-4 h-4 fill-orange-500/20" />
                <span className="text-xs font-bold">12</span>
             </div>
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">AS</span>
                </div>
             </div>
          </div>
        </div>

        {/* Global Search */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
            <Search className="w-5 h-5 text-slate-500 mr-3" />
            <input
              type="text"
              placeholder="Search for notes, topics, or tags..."
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
            />
            <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
               <span className="text-[10px] text-slate-400 font-medium">⌘K</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 space-y-8">
        
        {/* Stats Overview (Scrollable on mobile) */}
        <section className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
           <div className="min-w-[140px] flex-1 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
              <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-400"><Library className="w-5 h-5" /></div>
              <div>
                <div className="text-2xl font-bold text-white">{totalNotes}</div>
                <div className="text-xs text-slate-500">Total Notes</div>
              </div>
           </div>
           <div className="min-w-[140px] flex-1 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
              <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-400"><Clock className="w-5 h-5" /></div>
              <div>
                <div className="text-2xl font-bold text-white">12.5h</div>
                <div className="text-xs text-slate-500">Study Time</div>
              </div>
           </div>
           <div className="min-w-[140px] flex-1 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
              <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400"><Trophy className="w-5 h-5" /></div>
              <div>
                <div className="text-2xl font-bold text-white">85%</div>
                <div className="text-xs text-slate-500">Avg. Score</div>
              </div>
           </div>
        </section>

        {/* Quick Resume */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
              Continue Learning
            </h2>
            <Link href="#" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">View History</Link>
          </div>
          
          <Link href={`/dashboard/notes/${quickResume.subjectName.toLowerCase()}/${quickResume.chapterName.toLowerCase()}/${quickResume.topicId}`}>
            <div className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-1 hover:border-cyan-500/30 transition-all cursor-pointer active:scale-[0.99]">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-slate-950/50 rounded-xl p-5 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">{quickResume.subjectName}</span>
                      <span className="text-slate-500">&bull;</span>
                      <span className="text-slate-400">{quickResume.chapterName}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{quickResume.topicName}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Last read {quickResume.lastAccessed}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">{quickResume.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${quickResume.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Subject Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Your Subjects</h2>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/dashboard/notes/${subject.id}`}>
                <div className="group relative h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative h-full rounded-2xl bg-slate-900/40 border border-slate-800 p-5 hover:border-slate-700/50 transition-all cursor-pointer flex flex-col justify-between backdrop-blur-sm active:scale-[0.99]">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3.5 rounded-xl bg-slate-950 border border-slate-800 ${subject.color} shadow-lg shadow-black/20`}>
                        {subject.icon}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-950/50 px-2 py-1 rounded-lg border border-slate-800/50">
                        <TrendingUp className="w-3 h-3" />
                        <span>{subject.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{subject.name}</h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                        <span>{subject.totalNotes} Notes</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300 text-cyan-500/0 group-hover:text-cyan-500 flex items-center gap-1">
                          Open <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                      <div className="mt-3 w-full bg-slate-800/50 rounded-full h-1">
                        <div className={`h-full rounded-full ${subject.color.replace('text-', 'bg-')} opacity-50`} style={{ width: `${subject.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}