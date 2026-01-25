// src/app/dashboard/courses/page.tsx
"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/course/courseCard";
import { CourseUI } from "@/dto/course.ui.dto";
import { fetchDashboardCourses } from "@/services/client/course.client";

export default function CoursesPage() {
  const [enrolled, setEnrolled] = useState<CourseUI[]>([]);
  const [explore, setExplore] = useState<CourseUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Dashboard → Courses
     * ONE client call
     * Internally makes:
     *  - /api/user/courses
     *  - /api/course/by-subexam
     */
    fetchDashboardCourses("gate-2026-cs-it")
      .then((res) => {
        if (res.success && res.data) {
          setEnrolled(res.data.enrolled);
          setExplore(res.data.explore);
        } else {
          setError(res.error ?? "Failed to load courses");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-[#0B0E14]">
      <div className="mx-auto max-w-screen-xl space-y-12">

        {/* ============================
            My Courses (Enrolled)
        ============================ */}
        <section>
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            My Courses
          </h1>

          {enrolled.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {enrolled.map((course) => (
                <CourseCard key={course.id} course={course} mode="enrolled" />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              You are not enrolled in any courses yet.
            </p>
          )}
        </section>

        {/* ============================
            Explore Courses
        ============================ */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Explore Courses
          </h2>

          {explore.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {explore.map((course) => (
                <CourseCard key={course.id} course={course} mode="explore" />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No courses available right now.
            </p>
          )}
        </section>

      </div>
    </div>
  );
}
