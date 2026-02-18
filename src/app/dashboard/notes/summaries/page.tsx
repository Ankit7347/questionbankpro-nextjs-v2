// src/app/dashboard/notes/flashcards/page.jsx
import { NotesHeader } from '@/components/student-dashboard/notes/NotesHeader';

export default function SummariesPage() {
  return (
    <div className="w-full text-slate-900 dark:text-slate-200 pb-24">
      <main className="w-full space-y-8">
        <NotesHeader />
        <div className="p-4">
          <h1 className="text-2xl font-bold">Summaries</h1>
          <p className="text-slate-500">Quick summaries of your notes.</p>
        </div>
      </main>
    </div>
  );
}