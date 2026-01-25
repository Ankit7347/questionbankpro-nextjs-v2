// src/dashboard/courses/page.tsx

/**
 * Dashboard → Courses Page
 * ========================
 *
 * ROLE:
 * - Orchestrates dashboard course rendering
 * - Makes a SINGLE client-side API call
 * - Renders pre-bucketed course sections
 *
 * IMPORTANT RULES:
 * - NO business logic here
 * - NO access calculation here
 * - NO price / expiry / enrollment checks here
 * - This page only RENDERS what server decides
 *
 * If something feels complex here,
 * the bug is ALWAYS in the server layer, not here.
 */

"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/course/CourseCard";
import { fetchDashboardCourses } from "@/services/client/course.client";
import { mapCourseAccessAPIToUI } from "@/dto/course.ui.mapper";

export default function CoursesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"my-learning" | "explore">("my-learning");

  useEffect(() => {
    fetchDashboardCourses()
      .then((res) => {
        if (!res.success || !res.data) return;
        const ctx = res.data.context;
        const mapGroup = (arr: any[]) =>
          arr.map((c: any) =>
            mapCourseAccessAPIToUI(c, {
              examSlug: ctx.examSlug,
              subExamSlug: ctx.subExamSlug,
            })
          );

        setData({
          myCourses: {
            active: mapGroup(res.data.myCourses.active),
            expiring: mapGroup(res.data.myCourses.expiring),
            expired: mapGroup(res.data.myCourses.expired),
          },
          explore: {
            free: mapGroup(res.data.explore.free),
            paid: mapGroup(res.data.explore.paid),
          },
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonLoader />;

  if (!data) return <ErrorState />;

  return (
    <div className="space-y-8">
      {/* 1. Tab Switcher */}
      <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 w-fit">
        <button
          onClick={() => setActiveTab("my-learning")}
          className={`px-6 py-2 text-sm font-medium rounded-lg transition ${
            activeTab === "my-learning" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Learning
        </button>
        <button
          onClick={() => setActiveTab("explore")}
          className={`px-6 py-2 text-sm font-medium rounded-lg transition ${
            activeTab === "explore" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Explore Courses
        </button>
      </div>

      <div className="space-y-10">
        {activeTab === "my-learning" ? (
          <>
            {/* Auto-hiding sections: If length is 0, they render nothing */}
            <Section title="Active Now" items={data.myCourses.active} />
            <Section title="Expiring Soon" items={data.myCourses.expiring} />
            <Section title="Course History" items={data.myCourses.expired} />
            
            {/* Fallback if ALL 3 sub-sections are empty */}
            {data.myCourses.active.length === 0 && 
             data.myCourses.expiring.length === 0 && 
             data.myCourses.expired.length === 0 && (
              <EmptyState message="You haven't enrolled in any courses yet." />
            )}
          </>
        ) : (
          <>
            <Section title="Featured Paid Courses" items={data.explore.paid} />
            <Section title="Free Resources" items={data.explore.free} />
            
            {data.explore.paid.length === 0 && data.explore.free.length === 0 && (
              <EmptyState message="No new courses to explore right now." />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Section: Auto-hides if items are empty
 */
function Section({ title, items }: { title: string; items: any[] }) {
  if (items.length === 0) return null; // THE KEY CHANGE: Auto-hide logic

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-300">{title}</h2>
        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-gray-200 rounded-lg" />
      <div className="space-y-4">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <h2 className="text-lg font-semibold">Unable to load courses</h2>
      <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 underline">
        Retry
      </button>
    </div>
  );
}