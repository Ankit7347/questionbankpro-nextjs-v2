// src/components/layout/Navbar.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { FaBars, FaHome, FaSearch, FaTimes } from "react-icons/fa"; // Added icons
import { FiLogIn, FiLogOut } from "react-icons/fi";
// Use the session user type directly to ensure compatibility
import { Session } from "next-auth";

import { ExamLandingUI } from "@/dto/examLanding.ui.dto";
import { fetchExamLanding } from "@/services/client/exam.client";

import { FaUser } from "react-icons/fa";

// Function to generate a consistent color based on a string (like username/email)
const getAvatarColor = (name:string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Use HSL for better control: Hue (0-360), Saturation (70%), Lightness (60%)
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};


// Define the props to expect the 'user' object from the session
interface UserAvatarProps {
  user: Session["user"];
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  // Safe access to name with a fallback for the color generator
  const bgColor = getAvatarColor(user?.name || "Guest");

  return (
    <div className="relative w-8 h-8 flex items-center justify-center rounded-full border overflow-hidden shrink-0">
      {/* Background Color + Icon (Fallback) */}
      <div 
        style={{ backgroundColor: bgColor }}
        className="absolute inset-0 flex items-center justify-center text-white"
      >
        <FaUser size={14} />
      </div>

      {/* Image (Sits on top of the fallback if it exists) */}
      {user?.image && (
        <img 
          src={user.image} 
          className="relative w-full h-full object-cover" 
          alt={user.name || "user"} 
          onError={(e) => { (e.currentTarget.style.display = 'none') }}
        />
      )}
    </div>
  );
};
export default function Navbar() {
  const [exams, setExams] = useState<ExamLandingUI[]>([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // New state

  const { data: session } = useSession();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchExamLanding()
      .then((res) => {
        if (res.success && res.data) setExams(res.data);
      })
      .catch(() => setExams([]));
  }, []);

  const filtered = search
    ? exams.flatMap((exam) => 
        (exam.courses || [])
          .filter(c => 
            exam.examName.toLowerCase().includes(search.toLowerCase()) || 
            c.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(course => ({ ...exam, targetCourse: course }))
      )
    : [];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900 shadow">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        
        {/* Logo - Hide when search is open on mobile to save space */}
        {!isMobileSearchOpen && (
          <Link href="/" className="flex items-center gap-2 font-bold whitespace-nowrap">
            <FaHome /> 
            {/* Change this line below */}
            <span className="inline">Exam Preparation</span> 
          </Link>
        )}

        {/* Desktop Search & Mobile Search Container */}
        <div 
          ref={searchRef} 
          className={`${
            isMobileSearchOpen ? "flex-1 px-2" : "hidden sm:block w-64"
          } relative transition-all duration-300`}
        >
          <div className="flex items-center gap-2">
            <input
              autoFocus={isMobileSearchOpen}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exams..."
              className="w-full px-4 py-2 rounded-full border dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Close Mobile Search Button */}
            {isMobileSearchOpen && (
              <button onClick={() => { setIsMobileSearchOpen(false); setSearch(""); }}>
                <FaTimes className="text-gray-500" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {search && filtered.length > 0 && (
            <div className="absolute mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border rounded shadow-lg z-50">
              {filtered.map((item) => (
                <Link
                  key={`${item.examSlug}-${item.targetCourse.slug}`}
                  href={`/exams/${item.examSlug}/${item.targetCourse.slug}`}
                  onClick={() => { setSearch(""); setIsMobileSearchOpen(false); }}
                  className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b last:border-0"
                >
                  <p className="text-xs text-blue-600 font-semibold">{item.examName}</p>
                  <p className="text-sm dark:text-gray-200">{item.targetCourse.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Mobile Search Toggle Button */}
          {!isMobileSearchOpen && (
            <button 
              className="sm:hidden text-gray-600 dark:text-gray-300"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <FaSearch size={20} />
            </button>
          )}

          <button onClick={() => setMenuOpen((s) => !s)} className="p-1">
            <div className="flex items-center gap-3">
              {session ? (
                <UserAvatar user={session.user} />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                  <FaBars size={20} className="text-gray-600" />
                </div>
              )}
            </div>
          </button>
        </div>

        {/* User Menu Dropdown */}
        {menuOpen && (
          <div className="absolute right-4 top-16 bg-white dark:bg-gray-800 border rounded shadow-xl w-48 p-3 z-50">
            {session ? (
              <>
                <p className="font-medium text-sm border-b pb-2 mb-2">{session.user?.name}</p>
                <button onClick={() => signOut()} className="w-full flex items-center gap-2 text-red-500 text-sm py-2">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="w-full flex items-center gap-2 text-blue-600 text-sm py-2">
                <FiLogIn /> Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}