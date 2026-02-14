// src/components/course/CourseCard.tsx
"use client";

import { CourseUI } from "@/dto/course.ui.dto";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CourseCard({ course }: { course: CourseUI }) {
  const { name, type, price, access, flags, examSlug, subExamSlug, slug,id } = course;

  // Visual status config
  const isExpired = access.status === "EXPIRED";
  const isExpiring = access.status === "EXPIRING";
  const isActive = access.status === "ACTIVE" || access.status === "LIFETIME";
  const btnBase = "flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm font-bold transition shadow-sm backdrop-blur-sm";
  /* -----------------------------
     CTA Resolver (Logic remains yours)
  ------------------------------ */
  function renderCTA() {
    switch (access.status) {
      case "LIFETIME":
      case "ACTIVE":
        return (
          <a
            href={`/exams/${examSlug}/${subExamSlug}/study/${slug}`}
            className="flex w-full items-center justify-center rounded-xl bg-blue-600/90 backdrop-blur-sm px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm shadow-blue-200/50"
          >
            Go to Course
          </a>
        );

      case "EXPIRING":
        return (
          <button className="w-full rounded-xl bg-amber-500/90 backdrop-blur-sm px-3 py-2 text-sm font-bold text-white hover:bg-amber-600 transition shadow-sm shadow-amber-200/50">
            Renew Access
          </button>
        );

      case "EXPIRED":
        return (
          <div className="w-full rounded-xl bg-gray-100/80 backdrop-blur-sm px-3 py-2 text-center text-sm font-bold text-gray-500 border border-gray-200/60">
            Expired
          </div>
        );

      case "NONE":
      default:
        const isFree = flags.isFree;
        return (
          <Link
            href={`/dashboard/courses/checkout?slug=${slug}&type=${isFree ? 'enroll' : 'buy'}&courseId=${id}`}
            className={`${btnBase} ${isFree ? "bg-emerald-600/90 hover:bg-emerald-700" : "bg-gray-900/90 hover:bg-black"} text-white`}
          >
            {isFree ? "Enroll Free" : "Buy Now"}
          </Link>
        );
    }
  }

  return (
    <Card className={`group relative flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-sm
        ${isExpired ? "opacity-75 grayscale-[0.5]" : ""}
        ${isExpiring ? "border-l-4 border-l-amber-400" : ""}
        ${isActive ? "border-l-4 border-l-blue-500" : ""}
      `}
    >
      {/* 1. Header & Tags */}
      <CardHeader className="p-3 pb-1 space-y-0">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              {type}
            </span>
            {flags.isFree && (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                FREE
              </span>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
            {name}
          </CardTitle>
        </div>
      </CardHeader>

      {/* 2. Pricing/Status Info (Pushed to middle) */}
      <CardContent className="p-3 pt-1 flex-grow flex flex-col justify-end">
        {!isExpired && (
          <div className="mt-2">
            {flags.isFree ? (
              <div className="text-xl font-black text-emerald-600">₹0</div>
            ) : (
              price && (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-gray-900 dark:text-white">
                    ₹{price.final.toLocaleString()}
                  </span>
                  {price.discountPercent && (
                    <span className="text-xs font-bold text-red-500">
                      {price.discountPercent}% OFF
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Status Text */}
        {access.expiresAt && (
          <p className={`mt-1 text-[11px] font-medium ${isExpiring ? "text-amber-600" : "text-gray-400"}`}>
            {isExpired ? "Access ended" : `Expires: ${new Date(access.expiresAt).toLocaleDateString()}`}
          </p>
        )}
      </CardContent>

      {/* 3. Action (Pinned to bottom) */}
      <CardFooter className="p-3 pt-0 mt-auto">
        {renderCTA()}
      </CardFooter>
    </Card>
  );
}