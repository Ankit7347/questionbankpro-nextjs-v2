// src/app/exams/[examSlug]/[subExamSlug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BookOpen, AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";

import { ExamCourseOverviewDTO } from "@/dto/examCourse.dto";
import { fetchCourseOverview } from "@/services/client/course.client";
import CourseSubjectSection from "@/components/exams/course/CourseSubjectSection";

export default function CoursePage() {
  const { examSlug, subExamSlug } = useParams<{ examSlug: string; subExamSlug: string }>();

  const [data, setData] = useState<ExamCourseOverviewDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const response = await fetchCourseOverview(examSlug, subExamSlug);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || "Course not found");
      }
      setLoading(false);
    };

    loadData();
  }, [examSlug, subExamSlug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <RefreshCcw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading Course Content...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <main className="flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="p-6 rounded-full bg-red-50 dark:bg-red-900/10 mb-6 border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
          Course Not Found
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed">
          The course <span className="text-red-600 font-bold italic">"{subExamSlug.replace(/-/g, " ")}" </span> 
          does not exist or has been moved. If you think this is a mistake, please check back later.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link 
            href="/exams" 
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Other Exams
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

return (
  <div className="space-y-6 md:space-y-8 p-4">
    
    {/* Section Header */}
    <div className="flex flex-col gap-1">
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
        <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
        Available Subjects
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Select a subject to view chapters and study materials.
      </p>
    </div>

    {/* Subject Grid Section */}
    <section>
      <CourseSubjectSection 
        subjects={data.subjects} 
        examSlug={examSlug} 
        subExamSlug={subExamSlug} 
      />
    </section>

    {/* Helpful for mobile: Extra bottom padding so content isn't 
        hidden by the mobile navigation bar */}
    <div className="h-10 lg:hidden" />
  </div>
);
}