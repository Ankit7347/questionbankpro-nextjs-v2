// src/app/(admin)/admin/exams/[examId]/sub-exams/new/page.tsx
"use client";

/**
 * Admin → Create SubExam
 * - ALL schema fields covered
 * - examId from URL
 * - BaseSchemaFields handled by system
 */

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type LangText = {
  en?: string;
  hi?: string;
};

type SubExamForm = {
  name: LangText;
  slug: string;
  year: number;
  stream: string;
  description: LangText;
  icon: string;              // ✅ MISSING FIELD (NOW ADDED)
  order: number;
  isActive: boolean;
  isVisibleOnCard: boolean;
};

export default function NewSubExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();

  const [form, setForm] = useState<SubExamForm>({
    name: { en: "", hi: "" },
    slug: "",
    year: new Date().getFullYear(),
    stream: "",
    description: { en: "", hi: "" },
    icon: "",
    order: 1,
    isActive: true,
    isVisibleOnCard: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`/api/admin/exams/${examId}/sub-exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push(`/admin/exams/${examId}/sub-exams`);
  }

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Create SubExam</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          required
          placeholder="Name (EN)"
          className="border p-2 w-full"
          value={form.name.en}
          onChange={(e) =>
            setForm({ ...form, name: { ...form.name, en: e.target.value } })
          }
        />

        <input
          placeholder="Name (HI)"
          className="border p-2 w-full"
          value={form.name.hi}
          onChange={(e) =>
            setForm({ ...form, name: { ...form.name, hi: e.target.value } })
          }
        />

        {/* Slug */}
        <input
          required
          placeholder="Slug"
          className="border p-2 w-full"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />

        {/* Year */}
        <input
          required
          type="number"
          placeholder="Year"
          className="border p-2 w-full"
          value={form.year}
          onChange={(e) =>
            setForm({ ...form, year: Number(e.target.value) })
          }
        />

        {/* Stream */}
        <input
          required
          placeholder="Stream (CS / IT / ME / EE)"
          className="border p-2 w-full"
          value={form.stream}
          onChange={(e) => setForm({ ...form, stream: e.target.value })}
        />

        {/* Icon */}
        <input
          placeholder="Icon URL / key"
          className="border p-2 w-full"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
        />

        {/* Description */}
        <textarea
          placeholder="Description (EN)"
          className="border p-2 w-full"
          value={form.description.en}
          onChange={(e) =>
            setForm({
              ...form,
              description: { ...form.description, en: e.target.value },
            })
          }
        />

        <textarea
          placeholder="Description (HI)"
          className="border p-2 w-full"
          value={form.description.hi}
          onChange={(e) =>
            setForm({
              ...form,
              description: { ...form.description, hi: e.target.value },
            })
          }
        />

        {/* Order */}
        <input
          required
          type="number"
          placeholder="Order"
          className="border p-2 w-full"
          value={form.order}
          onChange={(e) =>
            setForm({ ...form, order: Number(e.target.value) })
          }
        />

        {/* Flags */}
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.checked })
            }
          />
          Active
        </label>

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.isVisibleOnCard}
            onChange={(e) =>
              setForm({
                ...form,
                isVisibleOnCard: e.target.checked,
              })
            }
          />
          Visible on Card
        </label>

        <div className="flex gap-3">
          <button type="submit" className="border px-4 py-2 rounded">
            Create
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
