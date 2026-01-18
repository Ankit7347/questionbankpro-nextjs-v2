'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit3, Trash2, ChevronRight, ChevronDown, Code, Loader2 } from 'lucide-react';

// --- Internal Types (Merged for single-file use) ---
type ExamDetailType = {
    _id?: string;
    id?: string;
    name: string;
    examId: string;
    description?: string;
    [key: string]: any; // For other dynamic fields
};

type ExamType = {
    _id: string;
    name: string;
};

export default function ExamDetailsAdminPage() {
    const [examDetails, setExamDetails] = useState<ExamDetailType[]>([]);
    const [filtered, setFiltered] = useState<ExamDetailType[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState<ExamDetailType | null>(null);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [examOptions, setExamOptions] = useState<ExamType[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        fetchExams();
        fetchExamDetails();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await fetch("/api/exams");
            const data = await res.json();
            setExamOptions(data);
        } catch (err) {
            console.error("Failed to fetch exams", err);
        }
    };

    const fetchExamDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/exam-details');
            if (!res.ok) throw new Error('Failed to fetch exam details');
            const data = await res.json();
            setExamDetails(data);
            setFiltered(data);
        } catch (err) {
            setError('An error occurred while fetching exam details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (search === '') {
            setFiltered(examDetails);
        } else {
            setFiltered(
                examDetails.filter((exam) =>
                    exam.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, examDetails]);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload: Partial<ExamDetailType> = {
            name: formData.get('name') as string,
            examId: formData.get('examId') as string,
            description: formData.get('description') as string,
        };

        // Important: check for _id to determine if it is an update
        const idToUpdate = editData?._id || editData?.id;
        const method = idToUpdate ? 'PUT' : 'POST';
        const url = idToUpdate ? `/api/exam-details/${idToUpdate}` : `/api/exam-details`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(idToUpdate ? { ...payload, _id: idToUpdate } : payload),
            });

            if (!res.ok) throw new Error('Failed to save');
            
            await fetchExamDetails();
            setOpen(false);
            setEditData(null);
        } catch (err) {
            setError('An error occurred while saving.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this?')) return;
        try {
            const res = await fetch(`/api/exam-details/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            fetchExamDetails();
        } catch (err) {
            setError('An error occurred while deleting.');
        }
    };

    if (!isClient) return null;

    return (
        <main className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                        Exam Details Manager
                    </h1>
                    <p className="text-gray-500 text-sm">Create and manage detailed exam profiles</p>
                </div>

                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) setEditData(null);
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Add New Detail
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white dark:bg-slate-900">
                        <DialogTitle className="text-xl font-bold border-b pb-4">
                            {editData ? 'Edit' : 'Create'} Exam Detail
                        </DialogTitle>
                        <form onSubmit={handleSave} className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Exam Title</label>
                                    <input 
                                        name="name" 
                                        defaultValue={editData?.name} 
                                        required 
                                        className="w-full mt-1 p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Category/Parent Exam</label>
                                    <select 
                                        name="examId" 
                                        defaultValue={editData?.examId} 
                                        className="w-full mt-1 p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
                                    >
                                        {examOptions.map(opt => (
                                            <option key={opt._id} value={opt._id}>{opt.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Description</label>
                                    <textarea 
                                        name="description" 
                                        defaultValue={editData?.description} 
                                        rows={4}
                                        className="w-full mt-1 p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700" 
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-blue-600">Save Changes</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="relative">
                <input
                    className="w-full p-3 pl-4 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-800"
                    type="text"
                    placeholder="Search exam details by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Loader2 className="animate-spin mb-2" />
                        <p className="text-sm">Loading records...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-2xl text-gray-400">
                        No records found.
                    </div>
                ) : (
                    filtered.map((item) => (
                        <DocumentRow 
                            key={item._id || item.id} 
                            doc={item} 
                            onEdit={(doc) => {
                                setEditData(doc);
                                setOpen(true);
                            }} 
                            onDelete={handleDelete} 
                        />
                    ))
                )}
            </div>
        </main>
    );
}

// --- Internal Sub-Component: DocumentRow ---
function DocumentRow({ doc, onEdit, onDelete }: { doc: any, onEdit: (doc: any) => void, onDelete: (id: string) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [viewMode, setViewMode] = useState<'kv' | 'json'>('kv');
    const docId = doc._id || doc.id;

    return (
        <div className="border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between p-4 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-4">
                    <div className="text-blue-600">
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{doc.name}</h3>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">ID: {docId}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" onClick={() => setViewMode(viewMode === 'kv' ? 'json' : 'kv')}>
                        <Code size={16} className={viewMode === 'json' ? "text-blue-600" : "text-gray-400"} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(doc)} className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                        <Edit3 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(docId)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-slate-800">
                    {viewMode === 'json' ? (
                        <pre className="text-[11px] font-mono text-green-600 dark:text-green-400 overflow-x-auto p-4 bg-white dark:bg-slate-950 rounded-lg">
                            {JSON.stringify(doc, null, 2)}
                        </pre>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            {Object.entries(doc).map(([key, value]) => (
                                <div key={key} className="flex items-start gap-2 py-1 border-b border-gray-100 dark:border-slate-800/50">
                                    <span className="text-[10px] font-black uppercase text-gray-400 w-24 shrink-0 mt-1">{key}</span>
                                    <span className="text-xs text-gray-700 dark:text-gray-300 break-all">
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}