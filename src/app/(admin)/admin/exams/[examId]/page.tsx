// src/app/(admin)/admin/exams/[examId]/page.tsx
"use client";

/**
 * Admin → Exam Overview
 * Path: /admin/exams/[examId]
 * Purpose:
 * - Entry page for an Exam
 * - Navigate to SubExams / Edit
 */

import { useParams, useRouter } from "next/navigation";

export default function AdminExamOverviewPage() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push("/admin/exams")}
        className="text-sm text-gray-600"
      >
        ← Back to Exams
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold">Exam Management</h1>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <button
          onClick={() =>
            router.push(`/admin/exams/${examId}/edit`)
          }
          className="border p-4 rounded text-left hover:bg-gray-50"
        >
          <div className="font-semibold">Edit Exam</div>
          <div className="text-sm text-gray-600">
            Update name, slug, education level, status
          </div>
        </button>

        <button
          onClick={() =>
            router.push(`/admin/exams/${examId}/sub-exams`)
          }
          className="border p-4 rounded text-left hover:bg-gray-50"
        >
          <div className="font-semibold">Manage SubExams</div>
          <div className="text-sm text-gray-600">
            Create, edit and search SubExams under this Exam
          </div>
        </button>
      </div>
    </div>
  );
}
