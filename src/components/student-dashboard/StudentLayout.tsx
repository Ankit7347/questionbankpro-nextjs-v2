'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface StudentLayoutProps {
  children: React.ReactNode;
  user: {
    id: string;
    role: string;
    uiMode: "light" | "dark";
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      
      {/* 🔥 Navbar ALWAYS on top — sticky */}
      <header className="sticky top-0 z-50">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      </header>

      {/* 🔥 Sidebar left + content right */}
      <div className="flex flex-1 min-h-0">
        
        {/* Sidebar (unchanged) */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* 🔥 Main scroll area */}
        <main className="flex-1 overflow-auto m-4">
          {children}
        </main>

      </div>
    </div>
  );
}
