// src/components/course/CourseCard.tsx
"use client";

import { CourseUI } from "@/dto/course.ui.dto";

/**
 * CourseCard
 * ==========
 *
 * STATE-DRIVEN UI COMPONENT
 *
 * Rules:
 * - NO `mode`
 * - NO enrollment guessing
 * - CTA decided ONLY by `course.access.status`
 * - Pure render component
 */
export default function CourseCard({ course }: { course: CourseUI }) {
  const { name, type, price, access, flags, examSlug, subExamSlug, slug } =
    course;

  /* -----------------------------
     CTA Resolver (UI-only)
  ------------------------------ */
  function renderCTA() {
    switch (access.status) {
      case "LIFETIME":
      case "ACTIVE":
        return (
          <a
            href={`/exams/${examSlug}/${subExamSlug}/study/${slug}`}
            className="flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Go to Course
          </a>
        );

      case "EXPIRING":
        return (
          <button className="w-full rounded-xl bg-yellow-500 px-4 py-3 text-sm font-bold text-white hover:bg-yellow-600">
            Renew Access
          </button>
        );

      case "EXPIRED":
        return (
          <div className="w-full rounded-xl bg-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            Expired
          </div>
        );

      case "NONE":
      default:
        return flags.isFree ? (
          <button className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700">
            Enroll Free
          </button>
        ) : (
          <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
            Buy Now
          </button>
        );
    }
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* -----------------------------
          Top Content
      ------------------------------ */}
      <div>
        <div className="mb-2 flex items-start justify-between">
          <h3 className="line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
            {name}
          </h3>

          {flags.isFree && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              FREE
            </span>
          )}
        </div>

        <div className="mb-4 inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {type} COURSE
        </div>

        {/* -----------------------------
            Pricing
        ------------------------------ */}
        <div className="mb-6">
          {flags.isFree ? (
            <div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ₹0
              </div>
              <div className="text-xs text-gray-400">
                Free Access
                {access.expiresAt && " (Limited Time)"}
              </div>
            </div>
          ) : (
            price && (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">
                    ₹{price.final.toLocaleString()}
                  </span>

                  {price.discountPercent && (
                    <span className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {price.discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* -----------------------------
          Action Section
      ------------------------------ */}
      <div className="mt-4">{renderCTA()}</div>
    </div>
  );
}
