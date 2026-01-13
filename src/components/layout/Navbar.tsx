// src/components/layout/Navbar.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { FaBars, FaHome, FaUserCircle } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";

import { ExamLandingUI } from "@/dto/examLanding.ui.dto";
import { fetchExamLanding } from "@/services/client/exam.client";

export default function Navbar() {
  const [exams, setExams] = useState<ExamLandingUI[]>([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session } = useSession();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchExamLanding()
      .then((res) => {
        if (res.success && res.data) {
          setExams(res.data);
        } else {
          setExams([]);
        }
      })
      .catch(() => setExams([]));
  }, []);

  const filtered = search
    ? exams.filter((exam) => {
        const q = search.toLowerCase();

        const examMatch =
          exam.examName.toLowerCase().includes(q);

        const courseMatch =
          Array.isArray(exam.courses) &&
          exam.courses.some((c) =>
            c.name.toLowerCase().includes(q)
          );

        return examMatch || courseMatch;
      })
    : [];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900 shadow">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <FaHome /> Exam Preparation
        </Link>

        {/* Search */}
        <div ref={searchRef} className="relative w-64 hidden sm:block">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams or courses…"
            className="w-full px-4 py-2 rounded-full border dark:bg-gray-700"
          />

          {search && filtered.length > 0 && (
            <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border rounded shadow">
              {filtered.map((exam) =>
                exam.courses.map((course) => (
                  <Link
                    key={`${exam.examSlug}-${course.slug}`}
                    href={`/exams/${exam.examSlug}/${course.slug}`}
                    onClick={() => setSearch("")}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    {exam.examName} — {course.name}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* User / Menu */}
        <button onClick={() => setMenuOpen((s) => !s)}>
          {session ? <FaUserCircle size={28} /> : <FaBars size={24} />}
        </button>

        {menuOpen && (
          <div className="absolute right-4 top-16 bg-white dark:bg-gray-800 border rounded shadow w-48 p-3">
            {session ? (
              <>
                <p className="font-medium">{session.user?.name}</p>
                <button
                  onClick={() => signOut()}
                  className="mt-3 flex gap-2 text-red-500"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex gap-2 text-blue-600"
              >
                <FiLogIn /> Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
