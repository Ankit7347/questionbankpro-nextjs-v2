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

  useEffect(() => {
    fetchDashboardCourses()
      .then((res) => {
        if (!res.success || !res.data) return;
        const ctx = res.data.context;
        const mapGroup = (arr: any[]) =>
          arr.map((c) =>
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
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* -----------------------------
     Loading State
  ------------------------------ */
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Unable to load courses
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-md">
          We couldn’t fetch your dashboard courses right now.
          Please refresh the page or try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Retry
        </button>

      </div>
    );
  }


  return (
    <div className="space-y-12">
      <Section
        title="Active Courses"
        items={data.myCourses.active}
        emptyMessage="You have no active courses."
      />
      <Section
        title="Free Courses"
        items={data.explore.free}
        emptyMessage="No free courses available right now."
      />

      <Section
        title="Paid Courses"
        items={data.explore.paid}
        emptyMessage="No paid courses available right now."
      />
      <Section
        title="Expiring Soon"
        items={data.myCourses.expiring}
        emptyMessage="No courses are expiring soon."
      />
      <Section
        title="Expired Courses"
        items={data.myCourses.expired}
        emptyMessage="You have no expired courses."
      />
    </div>
  );

}
/**
 * Section
 * -------
 * Pure presentational component.
 * Assumes items are already filtered and categorized.
 */
function Section({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: any[];
  emptyMessage: string;
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
