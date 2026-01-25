// src/app/(admin)/admin/exams/[examId]/edit/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

// --- Types ---
type LangText = { en?: string; hi?: string };

type ExamApiRow = {
  name: LangText;
  shortName?: LangText;
  description?: LangText;
  slug: string;
  order: number;
  educationLevelId: string;
  isActive: boolean;
};

type EducationLevel = {
  _id: string;
  name: { en: string };
};

export default function EditExamPage() {
  const params = useParams();
  const examId = params?.examId as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ExamApiRow | null>(null);
  const [levels, setLevels] = useState<EducationLevel[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 1. Validation Logic
  const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

  const fetchData = useCallback(async () => {
    if (!isValidObjectId(examId)) {
      setError("Invalid Exam ID format.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch both simultaneously for better performance
      const [examRes, levelsRes] = await Promise.all([
        fetch(`/api/admin/exams/${examId}`),
        fetch("/api/admin/education-levels")
      ]);

      if (examRes.status === 404) {
        setError("Exam not found (404).");
        return;
      }

      if (!examRes.ok || !levelsRes.ok) {
        throw new Error("Failed to fetch data from server.");
      }

      const examData = await examRes.json();
      const levelsData = await levelsRes.json();

      setForm(examData);
      setLevels(levelsData);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/exams/${examId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed.");
      
      router.push("/admin/exams");
      router.refresh(); // Ensure the list page sees new data
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // --- Render States ---

  if (loading) return <div className="p-10 text-center">Loading exam data...</div>;

  if (error) return (
    <div className="p-10 text-center space-y-4">
      <div className="text-red-500 font-bold text-xl">{error}</div>
      <button 
        onClick={() => router.push("/admin/exams")}
        className="bg-gray-100 px-4 py-2 rounded border"
      >
        Go Back to List
      </button>
    </div>
  );

  if (!form) return null;

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Edit Exam</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Name (EN)"
            className="border p-2 w-full"
            value={form.name.en ?? ""}
            required
            onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
          />
          <input
            placeholder="Name (HI)"
            className="border p-2 w-full"
            value={form.name.hi ?? ""}
            onChange={(e) => setForm({ ...form, name: { ...form.name, hi: e.target.value } })}
          />
        </div>

        {/* Short Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Short Name (EN)"
            className="border p-2 w-full"
            value={form.shortName?.en ?? ""}
            onChange={(e) => setForm({ ...form, shortName: { ...form.shortName, en: e.target.value } })}
          />
          <input
            placeholder="Short Name (HI)"
            className="border p-2 w-full"
            value={form.shortName?.hi ?? ""}
            onChange={(e) => setForm({ ...form, shortName: { ...form.shortName, hi: e.target.value } })}
          />
        </div>

        {/* Slug */}
        <div>
            <label className="text-xs text-gray-500">URL Slug</label>
            <input
              placeholder="slug-example-text"
              className="border p-2 w-full"
              value={form.slug}
              required
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
        </div>

        {/* Education Level */}
        <select
          className="border p-2 w-full"
          value={form.educationLevelId}
          required
          onChange={(e) => setForm({ ...form, educationLevelId: e.target.value })}
        >
          <option value="">Select Education Level</option>
          {levels.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name.en}
            </option>
          ))}
        </select>

        {/* Order */}
        <input
          type="number"
          placeholder="Order"
          className="border p-2 w-full"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        />

        {/* Active Toggle */}
        <label className="flex gap-2 items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          <span>Active / Visible</span>
        </label>

        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-blue-300"
          >
            {submitting ? "Saving..." : "Update Exam"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="border px-4 py-2 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}