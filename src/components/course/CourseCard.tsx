// src/components/course/CourseCard.tsx
import React from "react";
import { CourseUI } from "@/dto/course.ui.dto";

export default function CourseCard({ course,mode }: { course: CourseUI, mode: "enrolled" | "explore"; }) {
  const { name, type, price, access, flags } = course;

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">

      {/* Top Content */}
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
          </h3>

          {flags.isFree && (
            <span className="flex-shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              FREE
            </span>
          )}
        </div>

        {/* Type Badge */}
        <div className="mb-4 inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {type} COURSE
        </div>

        {/* Pricing Section */}
        <div className="mb-6 h-12 flex items-end">
          {!flags.isFree ? (
            <div className="flex flex-col">
              {price.discountPercent ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      ₹{price.final.toLocaleString()}
                    </span>
                    <span className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {price.discountPercent}% OFF
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-400 line-through">
                    ₹{price.base.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  ₹{price.final.toLocaleString()}
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹0</span>
              <span className="text-xs text-gray-400">Lifetime Free Access</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Section */}
      <div className="mt-4">
        {mode === "enrolled" ? (
          /* ======================
             ENROLLED → GO TO COURSE
             ====================== */
          <a
            href={`/exams/${course.examSlug}/${course.subExamSlug}/study/${course.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-black active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Go to Course
          </a>
        ) : flags.isFree ? (
          /* ======================
             EXPLORE → FREE COURSE
             ====================== */
          <button className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.98]">
            Enroll Now
          </button>
        ) : (
          /* ======================
             EXPLORE → PAID COURSE
             ====================== */
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98] shadow-sm shadow-blue-200 dark:shadow-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Buy Now
          </button>
        )}
      </div>

    </div>
  );
}
