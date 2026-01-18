'use client';

import { useEffect, useState,useCallback } from 'react';
import DataTable from '@/components/admin/DataTable';
// --- Strict TypeScript Interfaces ---
interface QuestionDetailType {
  _id: string;
  name: string;
  subject: string;
  topic: string;
  board: string;
  competitive: boolean;
  type: 'MCQ' | 'Subjective' | 'Numerical';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  exercise: string;
  tags: string[];
  version: number;
  content: any; // HTML or JSON for the question body
  solution: any;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminQuestionPage() {
  const [questions, setQuestions] = useState<QuestionDetailType[]>([]);  // Ensure empty array initialization
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataLoading, setDataLoading] = useState(false); // For table fetch
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<QuestionDetailType | null>(null);

  const fetchQuestions = useCallback(async () => {
    setDataLoading(true);
    const res = await fetch(
      `/api/admin/question?page=${page}&limit=${limit}&query=${query}`
    );
    const data = await res.json();
    setQuestions(data.data || []);  // Ensure empty array fallback
    setTotal(data.total || 1);
    setDataLoading(false);
  }, [page, limit, query]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/admin/question/${id}`, { method: 'DELETE' });
    fetchQuestions();
  };

  const handleEdit = (question: QuestionDetailType) => {
    setSelected(question);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelected(null);
    setShowForm(true);
  };

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Question List</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAdd}>
          Add New
        </button>
      </div>

      {showForm && (
        <div className="mb-4">
        </div>
      )}

      <DataTable<QuestionDetailType>
        data={questions || []}  // Ensure data is always an array
        columns={[
          { label: 'Name', accessor: 'name' },
          { label: 'Subject', accessor: 'subject' },
          { label: 'Topic', accessor: 'topic' },
          { label: 'Board', accessor: 'board' },
          { label: 'Competitive', accessor: 'competitive' },
          { label: 'Type', accessor: 'type' },
          { label: 'Difficulty', accessor: 'difficulty' },
          { label: 'Exercise', accessor: 'exercise' },
          { label: 'Tags', accessor: 'tags' },
          { label: 'Version', accessor: 'version' },
          { label: 'Created At', accessor: 'createdAt' },
          { label: 'Updated At', accessor: 'updatedAt' },
        ]}
        currentPage={page}
        total={total}
        limit={limit}
        onSearch={(q:string) => {
          setPage(1);
          setQuery(q);
        }}
        dataLoading={dataLoading}
        onPageChange={setPage}
        onLimitChange={setLimit}
        renderActions={(row:any) => (
          <div className="flex gap-2">
            <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleEdit(row)}>
              Edit
            </button>
            <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(row._id)}>
              Delete
            </button>
          </div>
        )}
      />
    </div>
  );
}
