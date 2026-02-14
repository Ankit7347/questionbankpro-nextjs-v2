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
  const { name, type, price, access, flags, examSlug, subExamSlug, slug, id } = course;

  const isExpired = access.status === "EXPIRED";
  const isExpiring = access.status === "EXPIRING";
  const isActive = access.status === "ACTIVE" || access.status === "LIFETIME";

  function renderCTA() {
    // Compact button with smaller text and padding
    const btnBase = "flex w-full items-center justify-center rounded-lg px-2 py-1.5 text-xs font-bold transition-all duration-300 backdrop-blur-xl border border-white/20 shadow-sm active:scale-95";

    switch (access.status) {
      case "LIFETIME":
      case "ACTIVE":
        return (
          <a
            href={`/exams/${examSlug}/${subExamSlug}/study/${slug}`}
            className={`${btnBase} bg-blue-500/30 text-blue-900 dark:text-blue-100 hover:bg-blue-500/50 border-blue-400/30`}
          >
            Go to Course
          </a>
        );

      case "EXPIRING":
        return (
          <button className={`${btnBase} bg-amber-500/30 text-amber-900 dark:text-amber-100 hover:bg-amber-500/50 border-amber-400/30`}>
            Renew
          </button>
        );

      case "EXPIRED":
        return (
          <div className={`${btnBase} bg-gray-400/10 text-gray-500 border-white/5 cursor-not-allowed`}>
            Expired
          </div>
        );

      case "NONE":
      default:
        const isFree = flags.isFree;
        return (
          <Link
            href={`/dashboard/courses/checkout?slug=${slug}&type=${isFree ? 'enroll' : 'buy'}&courseId=${id}`}
            className={`${btnBase} ${
              isFree 
                ? "bg-emerald-500/30 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-500/50" 
                : "bg-gray-900/60 text-white hover:bg-black"
            }`}
          >
            {isFree ? "Enroll Free" : "Buy Now"}
          </Link>
        );
    }
  }

  return (
    <Card 
      className={`
        group relative flex flex-col h-fit max-w-sm rounded-xl overflow-hidden transition-all duration-500 
        hover:shadow-xl hover:-translate-y-1
        
        /* Crystal Core */
        bg-white/15 dark:bg-slate-900/40 
        backdrop-blur-xl backdrop-saturate-150
        border border-white dark:border-white/10
        
        /* State styles */
        ${isExpired ? "opacity-60 grayscale-[0.2]" : ""}
        ${isExpiring ? "border-l-2 border-l-amber-400/80" : ""}
        ${isActive ? "border-l-2 border-l-blue-500/80" : ""}
      `}
    >
      {/* Surface Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
      
      <CardHeader className="p-3 pb-1 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-white/40 dark:bg-white/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tight text-gray-600 dark:text-gray-400 border border-white/10">
              {type}
            </span>
            {flags.isFree && (
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/10">
                FREE
              </span>
            )}
          </div>
          <CardTitle className="line-clamp-1 text-sm font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
            {name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-1 flex-grow flex flex-col justify-end relative z-10">
        {!isExpired && (
          <div className="flex items-center justify-between">
            {flags.isFree ? (
              <div className="text-lg font-black text-emerald-600 drop-shadow-sm">₹0</div>
            ) : (
              price && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">
                    ₹{price.final.toLocaleString()}
                  </span>
                  {price.discountPercent && (
                    <span className="text-[9px] font-bold text-red-500">
                      -{price.discountPercent}%
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {access.expiresAt && (
          <p className={`mt-1 text-[10px] font-medium ${isExpiring ? "text-amber-600" : "text-gray-400"}`}>
             {isExpired ? "Expired" : `Ends: ${new Date(access.expiresAt).toLocaleDateString()}`}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-3 pt-0 mt-1 relative z-10">
        {renderCTA()}
      </CardFooter>
    </Card>
  );
}