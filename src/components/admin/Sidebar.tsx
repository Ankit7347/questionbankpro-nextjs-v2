// File: components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/exam-details', label: 'Exam-Details' },
  { href: '/admin/question', label: 'Question' },
  { href: '/admin/quiz', label: 'Quiz' },
  { href: '/admin/syllabus', label: 'Syllabus' },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar container */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-gray-100 shadow transition-transform transform md:translate-x-0 md:relative md:z-0 md:block md:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b md:hidden">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`block p-2 rounded cursor-pointer hover:bg-gray-300 ${
                  pathname === link.href ? 'bg-gray-300 font-semibold' : ''
                }`}
                onClick={onClose}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
