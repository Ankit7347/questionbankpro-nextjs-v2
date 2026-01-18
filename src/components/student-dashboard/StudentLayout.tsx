// File: components/admin/ClientAdminLayout.tsx
'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
// Define the type for the user object based on your Auth setup
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Navbar on top always */}
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Body split: Sidebar on left (desktop), Content on right */}
      <div className="flex flex-1">
        {/* Sidebar (overlay on mobile, fixed on desktop) */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

