// src/app/(admin)/admin/exams/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Layers } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

type ExamApiRow = {
  _id: string;
  name: { en: string };
  shortName?: { en?: string };
  slug: string;
  order: number;
  isActive: boolean;
  deleted?: boolean;
};

type ExamTableRow = {
  _id: string;
  nameEn: string;
  shortNameEn: string;
  slug: string;
  order: number;
  isActive: boolean;
};

type ApiResponse = {
  data: ExamApiRow[];
  total: number;
};

export default function AdminExamsPage() {
  const router = useRouter();

  const [data, setData] = useState<ExamTableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchExams();
  }, [page, limit, search]);

  async function fetchExams() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
      });

      const res = await fetch(`/api/admin/exams?${params}`);
      const json: ApiResponse = await res.json();

      setData(
        json.data
          .filter((e) => !e.deleted)
          .map((e) => ({
            _id: e._id,
            nameEn: e.name.en,
            shortNameEn: e.shortName?.en ?? "-",
            slug: e.slug,
            order: e.order,
            isActive: e.isActive,
          }))
      );
      setTotal(json.total);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exam Management</h1>
        <button
          onClick={() => router.push("/admin/exams/new")}
          className="flex items-center gap-2 border px-4 py-2 rounded"
        >
          <Plus size={16} />
          Add Exam
        </button>
      </div>

      <DataTable<ExamTableRow>
        data={data}
        total={total}
        limit={limit}
        currentPage={page}
        dataLoading={loading}
        showSearch={true}        // local search
        showDbSearch={true}      // DB search
        onDbSearch={setSearch}   // DB search handler
        onPageChange={setPage}
        onLimitChange={(v) => {
          setPage(1);
          setLimit(v);
        }}
        getRowKey={(r) => r._id}
        columns={[
          { label: "Name", accessor: "nameEn" },
          { label: "Short Name", accessor: "shortNameEn" },
          { label: "Slug", accessor: "slug" },
          { label: "Order", accessor: "order" },
          { label: "Active", accessor: "isActive" },
        ]}
        renderActions={(row) => (
          <div className="flex gap-3">
            <button onClick={() => router.push(`/admin/exams/${row._id}/edit`)}>
              <Pencil size={16} />
            </button>
            <button onClick={() => router.push(`/admin/exams/${row._id}`)}>
              <Layers size={16} />
            </button>
            <button className="text-red-600">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />
    </div>
  );
}
