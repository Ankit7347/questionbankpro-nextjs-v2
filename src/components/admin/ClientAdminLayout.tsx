// File: components/admin/ClientAdminLayout.tsx
'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function ClientAdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
