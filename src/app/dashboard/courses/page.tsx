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
import Link from "next/link";
import { fetchDashboardCourses } from "@/services/client/course.client";
import { mapCourseAccessAPIToUI } from "@/dto/course.ui.mapper";

import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Card, CardContent } from "@/components/ui/card";

/* -----------------------------------------------------------
   MAIN PAGE
----------------------------------------------------------- */
export default function CoursesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

  if (!loading && !data) return <ErrorState />;

  return (
    <div className="space-y-8">
      {!mounted ? (
        <>
          <SectionSkeleton title="Active Now" />
          <SectionSkeleton title="Expiring Soon" />
        </>
      ) : (
        <Tabs defaultValue="my-learning" className="w-full space-y-8">
          {/* TABS HEADER */}
          <TabsList className="w-full max-w-md grid grid-cols-2 h-12 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger
              value="my-learning"
              className="rounded-lg text-sm font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600"
            >
              My Learning
            </TabsTrigger>
            <TabsTrigger
              value="explore"
              className="rounded-lg text-sm font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600"
            >
              Explore Courses
            </TabsTrigger>
          </TabsList>

          {/* MY LEARNING */}
          <TabsContent value="my-learning" className="space-y-10">
            {loading ? (
              <>
                <SectionSkeleton title="Active Now" />
                <SectionSkeleton title="Expiring Soon" />
              </>
            ) : (
              <>
                <Section title="Active Now" items={data.myCourses.active} count={data.myCourses.active.length} />
                <Section title="Expiring Soon" items={data.myCourses.expiring} count={data.myCourses.expiring.length} />
                <Section title="Course History" items={data.myCourses.expired} count={data.myCourses.expired.length} />
              </>
            )}
          </TabsContent>

          {/* EXPLORE */}
          <TabsContent value="explore" className="space-y-10">
            {loading ? (
              <>
                <SectionSkeleton title="Featured Paid Courses" />
                <SectionSkeleton title="Free Resources" />
              </>
            ) : (
              <>
                <Section title="Paid Courses" items={data.explore.paid} count={data.explore.paid.length} />
                <Section title="Free Resources" items={data.explore.free} count={data.explore.free.length}/>

                {data.explore.paid.length === 0 &&
                  data.explore.free.length === 0 && (
                    <EmptyState message="No new courses to explore right now." />
                  )}
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

/* -----------------------------------------------------------
   SECTION
----------------------------------------------------------- */
function Section({
  title,
  items,
  count
}: {
  title: string;
  items: any[];
  count: number;
}) {
  if (items.length === 0) return null;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 mb-5"> {/* Changed to gap-3 */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-300">
          {title}
        </h2>
        <span className="bg-blue-100 text-blue-600 dark:bg-gray-800 dark:text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-gray-700">
          {count}
        </span>
      </div>

      <div className="p-2 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        {items.map((course) => (
          <CourseCard key={course.id} data={course} />
        ))}
      </div>
    </section>
  );
}

/* -----------------------------------------------------------
   SECTION SKELETON
----------------------------------------------------------- */
function SectionSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-300">
        {title}
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <CourseCard key={i} loading />
        ))}
      </div>
    </div>
  );
}

/* -----------------------------------------------------------
   EMPTY STATE
----------------------------------------------------------- */
function EmptyState({ message }: { message: string }) {
  return (
    <Card className="border-dashed bg-transparent shadow-none">
      <CardContent className="py-20 text-center">
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

/* -----------------------------------------------------------
   ERROR STATE
----------------------------------------------------------- */
function ErrorState() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <h2 className="text-lg font-semibold">Unable to load courses</h2>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 text-blue-600 underline"
      >
        Retry
      </button>
    </div>
  );
}

/* -----------------------------------------------------------
   UNIFIED COURSE CARD (REAL + SKELETON)
----------------------------------------------------------- */
function CourseCard({
  data,
  loading = false,
}: {
  data?: any;
  loading?: boolean;
}) {
  /* SKELETON MODE */
  if (loading) {
    return (
      // Added a light gray base so the white/gray highlights actually show up
      <div className="h-[28vh] rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-900 shadow-xl flex flex-col p-3 space-y-3 animate-pulse">

        {/* Thumbnail - Darker than the background */}
        <div className="w-full h-32 rounded-lg bg-gray-200 dark:bg-white/20" />

        {/* Title */}
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/15 rounded" />

        {/* Subtitle */}
        <div className="h-3 w-1/2 bg-gray-200 dark:bg-white/10 rounded" />

        {/* Button */}
        <div className="mt-auto h-8 w-full bg-gray-200 dark:bg-white/5 rounded-lg" />
      </div>
    );
  }

  /* REAL CARD */
  const { name, price, flags, access, examSlug, subExamSlug, slug } = data;

  const isExpired = access.status === "EXPIRED";
  const isExpiring = access.status === "EXPIRING";

  function CTA() {
    const btn =
      "flex w-full items-center justify-center rounded-lg px-2 py-1.5 text-xs font-bold transition-all border backdrop-blur-xl";

    switch (access.status) {
      case "ACTIVE":
      case "LIFETIME":
        return (
          <Link
            href={`/exams/${examSlug}/${subExamSlug}/study/${slug}`}
            className={`${btn} bg-blue-500/30 text-blue-900`}
          >
            Go to Course
          </Link>
        );

      case "EXPIRING":
        return (
          <button className={`${btn} bg-amber-500/30 text-amber-900`}>
            Renew
          </button>
        );

      case "EXPIRED":
        return (
          <div className={`${btn} bg-gray-300/20 text-gray-500`}>
            Expired
          </div>
        );

      default:
        return (
          <Link
            href={`/dashboard/courses/checkout?slug=${slug}`}
            className={`${btn} ${flags.isFree
              ? "bg-emerald-500/30 text-emerald-900"
              : "bg-gray-900/60 text-white"
              }`}
          >
            {flags.isFree ? "Enroll Free" : "Buy Now"}
          </Link>
        );
    }
  }

  return (
    <div className="h-[28vh] rounded-xl border border-white/40 bg-white/20 dark:bg-white/10 backdrop-blur-xl shadow-xl flex flex-col p-3 space-y-3">
      <div className="w-full h-32 rounded-lg overflow-hidden">
        <img
          src="/images/coursecard.png"
          alt="Course Thumbnail"
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
        {name}
      </h3>

      <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
        {flags.isFree ? (
          <span className="font-bold text-emerald-600">₹0</span>
        ) : (
          <span className="font-bold text-blue-700">
            ₹{price?.final?.toLocaleString()}
          </span>
        )}

        {access.expiresAt && (
          <span className={isExpiring ? "text-amber-600" : "opacity-70"}>
            {isExpired
              ? "Expired"
              : `Ends: ${new Date(access.expiresAt).toLocaleDateString()}`}
          </span>
        )}
      </div>

      <div className="mt-auto">{CTA()}</div>
    </div>
  );
}