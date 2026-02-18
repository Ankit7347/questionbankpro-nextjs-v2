// src/components/student-dashboard/notes/StudyTools.tsx
import Link from 'next/link';
import { BrainCircuit, Zap, Calculator, FileText, Bookmark } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export const StudyTools = () => (
  <section>
    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <BrainCircuit className="w-5 h-5 text-purple-500" />
      Study Tools
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { name: 'Flashcards', icon: <Zap className="w-4 h-4" />, color: 'text-amber-500', bg: 'bg-amber-500/10', href: '/dashboard/notes/flashcards', gradient: 'from-amber-500 to-orange-500' },
        { name: 'Formulas', icon: <Calculator className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-500/10', href: '/dashboard/notes/formulas', gradient: 'from-blue-500 to-cyan-500' },
        { name: 'Summaries', icon: <FileText className="w-4 h-4" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', href: '/dashboard/notes/summaries', gradient: 'from-emerald-500 to-teal-500' },
        { name: 'Saved', icon: <Bookmark className="w-4 h-4" />, color: 'text-pink-500', bg: 'bg-pink-500/10', href: '/dashboard/notes/saved', gradient: 'from-pink-500 to-rose-500' },
      ].map((tool) => (
        <Link key={tool.name} href={tool.href} className="block group">
          <GlassCard className={`flex items-center gap-3 p-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95 h-full ${tool.gradient}`}>
            <div className={`p-2 rounded-lg ${tool.bg} ${tool.color}`}>
              {tool.icon}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{tool.name}</span>
          </GlassCard>
        </Link>
      ))}
    </div>
  </section>
);