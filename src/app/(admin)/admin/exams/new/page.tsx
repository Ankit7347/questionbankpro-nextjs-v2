// src/app/(admin)/admin/exams/new/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// --- Types ---
type LangText = { en?: string; hi?: string };

type ExamForm = {
  name: LangText;
  shortName: LangText;
  slug: string;
  order: number;
  educationLevelId: string;
  isActive: boolean;
};

type EducationLevel = {
  _id: string;
  name: { en: string };
};

export default function NewExamPage() {
  const router = useRouter();
  
  // States
  const [levels, setLevels] = useState<EducationLevel[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ExamForm>({
    name: { en: "", hi: "" },
    shortName: { en: "", hi: "" },
    slug: "",
    order: 1,
    educationLevelId: "",
    isActive: true,
  });

  useEffect(() => {
    fetchEducationLevels();
  }, []);

  async function fetchEducationLevels() {
    try {
      setLoadingLevels(true);
      const res = await fetch("/api/admin/education-levels");
      if (!res.ok) throw new Error("Failed to load education levels");
      const json = await res.json();
      setLevels(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingLevels(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create exam");
      }

      router.push("/admin/exams");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Create New Exam</h1>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name (Multilingual) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name (English) *</label>
            <input
              required
              placeholder="e.g. Union Public Service Commission"
              className="border p-2 w-full rounded"
              value={form.name.en}
              onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Name (Hindi)</label>
            <input
              placeholder="e.g. संघ लोक सेवा आयोग"
              className="border p-2 w-full rounded"
              value={form.name.hi}
              onChange={(e) => setForm({ ...form, name: { ...form.name, hi: e.target.value } })}
            />
          </div>
        </div>

        {/* Short Name (Multilingual) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Short Name (EN)</label>
            <input
              placeholder="e.g. UPSC"
              className="border p-2 w-full rounded"
              value={form.shortName.en}
              onChange={(e) => setForm({ ...form, shortName: { ...form.shortName, en: e.target.value } })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Short Name (HI)</label>
            <input
              placeholder="e.g. यूपीएससी"
              className="border p-2 w-full rounded"
              value={form.shortName.hi}
              onChange={(e) => setForm({ ...form, shortName: { ...form.shortName, hi: e.target.value } })}
            />
          </div>
        </div>

        {/* Slug */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Slug *</label>
          <input
            required
            placeholder="upsc-exam-2024"
            className="border p-2 w-full rounded"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        {/* Education Level Dropdown */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Education Level *</label>
          <select
            required
            disabled={loadingLevels}
            className="border p-2 w-full rounded"
            value={form.educationLevelId}
            onChange={(e) => setForm({ ...form, educationLevelId: e.target.value })}
          >
            <option value="">
              {loadingLevels ? "Loading levels..." : "Select Education Level"}
            </option>
            {levels.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name.en}
              </option>
            ))}
          </select>
        </div>

        {/* Order */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Display Order</label>
          <input
            required
            type="number"
            className="border p-2 w-full rounded"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          />
        </div>

        {/* Active Toggle */}
        <label className="flex gap-2 items-center cursor-pointer pt-2">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          <span className="text-sm font-medium">Active (Visible to users)</span>
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t">
          <button
            type="submit"
            disabled={submitting || loadingLevels}
            className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold disabled:bg-indigo-300"
          >
            {submitting ? "Creating..." : "Create Exam"}
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