// src/app/(admin)/admin/exams/[examId]/sub-exams/page.tsx
"use client";

/**
 * Admin → SubExams under Exam
 * Works with SubExam.schema.ts
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DataTable from "@/components/admin/DataTable";

type SubExamRow = {
  _id: string;
  nameEn: string;
  year: number;
  stream: string;
  order: number;
  isActive: boolean;
};

type ApiResponse = {
  data: any[];
  total: number;
};

export default function SubExamsPage() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();

  const [data, setData] = useState<SubExamRow[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubExams();
  }, [page, limit, search]);

  async function fetchSubExams() {
    setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search,
    });

    const res = await fetch(
      `/api/admin/exams/${examId}/sub-exams?${params}`
    );
    const json: ApiResponse = await res.json();

    setData(
      json.data.map((s) => ({
        _id: s._id,
        nameEn: s.name.en,
        year: s.year,
        stream: s.stream,
        order: s.order,
        isActive: s.isActive,
      }))
    );
    setTotal(json.total);
    setLoading(false);
  }

  async function deleteSubExam(subExamId: string) {
    if (!confirm("Delete this SubExam?")) return;

    await fetch(`/api/admin/sub-exams/${subExamId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDeleted: true }),
    });

    fetchSubExams();
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">SubExams</h1>

        <button
          onClick={() =>
            router.push(
              `/admin/exams/${examId}/sub-exams/new`
            )
          }
          className="border px-4 py-2 rounded"
        >
          + Add SubExam
        </button>
      </div>

      <DataTable<SubExamRow>
        data={data}
        total={total}
        limit={limit}
        currentPage={page}
        dataLoading={loading}
        showSearch={true}
        showDbSearch={true}
        onDbSearch={(q) => {
          setPage(1);
          setSearch(q);
        }}
        onPageChange={setPage}
        onLimitChange={(v) => {
          setPage(1);
          setLimit(v);
        }}
        getRowKey={(r) => r._id}
        columns={[
          { label: "Name", accessor: "nameEn" },
          { label: "Year", accessor: "year" },
          { label: "Stream", accessor: "stream" },
          { label: "Order", accessor: "order" },
          { label: "Active", accessor: "isActive" },
        ]}
        renderActions={(row) => (
          <div className="flex gap-3 text-sm">
            {/* Overview */}
            <button
              className="text-indigo-600"
              onClick={() =>
                router.push(
                  `/admin/sub-exams/${row._id}`
                )
              }
            >
              Overview
            </button>

            {/* Edit */}
            <button
              className="text-blue-600"
              onClick={() =>
                router.push(
                  `/admin/sub-exams/${row._id}/edit`
                )
              }
            >
              Edit
            </button>

            {/* Delete */}
            <button
              className="text-red-600"
              onClick={() => deleteSubExam(row._id)}
            >
              Delete
            </button>
          </div>
        )}
      />
    </div>
  );
}
