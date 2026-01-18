'use client';

import { useCallback, useEffect, useState } from 'react';
import { 
  Edit3, Trash2, ChevronRight, ChevronDown, 
  Code, Loader2, Plus, Search, X, Save 
} from 'lucide-react';

// --- Strict TypeScript Interfaces ---
interface SyllabusType {
    _id: string;
    grade: string;
    subject: string;
    chapter_name: string;
    topic: string;
    board: string;
    examId: string;
    competitive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Interface for the form data to ensure type safety during submission
interface SyllabusPayload extends Omit<SyllabusType, '_id' | 'createdAt' | 'updatedAt'> {
    _id?: string;
}

export default function AdminSyllabusPage() {
    const [syllabusList, setSyllabusList] = useState<SyllabusType[]>([]);
    const [query, setQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    
    // Form States
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selected, setSelected] = useState<SyllabusType | null>(null);

    // 1. Fetch Logic with strong typing
    const fetchSyllabus = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                query: query
            });
            const res = await fetch(`/api/admin/syllabus?${params.toString()}`);
            const data = await res.json();
            setSyllabusList(data.data || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [page, limit, query]);

    useEffect(() => {
        fetchSyllabus();
    }, [fetchSyllabus]);

    // 2. Action Handlers
    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this syllabus entry?')) return;
        try {
            const res = await fetch(`/api/admin/syllabus/${id}`, { method: 'DELETE' });
            if (res.ok) fetchSyllabus();
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        // Type-safe payload construction
        const payload: SyllabusPayload = {
            grade: formData.get('grade') as string,
            subject: formData.get('subject') as string,
            board: formData.get('board') as string,
            chapter_name: formData.get('chapter_name') as string,
            topic: formData.get('topic') as string,
            examId: formData.get('examId') as string,
            competitive: formData.get('competitive') === 'on',
        };

        const id = selected?._id;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/admin/syllabus/${id}` : `/api/admin/syllabus`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(id ? { ...payload, _id: id } : payload),
            });
            if (res.ok) {
                setShowForm(false);
                setSelected(null);
                fetchSyllabus();
            }
        } catch (err) {
            alert("Error saving data");
        }
    };

    return (
        <main className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 dark:bg-[#0B0F17] min-h-screen">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        Syllabus Repository
                    </h1>
                    <p className="text-gray-500 text-sm italic font-medium">
                        Total Records: <span className="text-blue-600">{total}</span>
                    </p>
                </div>
                <button 
                    onClick={() => { setSelected(null); setShowForm(true); }}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus size={20} /> Add New Entry
                </button>
            </div>

            {/* SPA Form Container */}
            {showForm && (
                <section className="bg-white dark:bg-slate-900 border-2 border-blue-500/30 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {selected ? 'Edit Syllabus Entry' : 'Create New Syllabus Entry'}
                        </h2>
                        <button 
                            onClick={() => setShowForm(false)} 
                            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input label="Grade" name="grade" defaultValue={selected?.grade} />
                        <Input label="Subject" name="subject" defaultValue={selected?.subject} />
                        <Input label="Board" name="board" defaultValue={selected?.board} />
                        <Input label="Chapter Name" name="chapter_name" defaultValue={selected?.chapter_name} />
                        <Input label="Topic" name="topic" defaultValue={selected?.topic} />
                        <Input label="Exam ID" name="examId" defaultValue={selected?.examId} />
                        
                        <div className="flex items-center gap-3 md:col-span-1">
                            <input 
                                type="checkbox" 
                                id="competitive-checkbox"
                                name="competitive" 
                                defaultChecked={selected?.competitive} 
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="competitive-checkbox" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                                Competitive Exam
                            </label>
                        </div>

                        <div className="md:col-span-3 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-800">
                            <button 
                                type="button" 
                                onClick={() => setShowForm(false)} 
                                className="px-6 py-2 font-bold text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all"
                            >
                                <Save size={18} /> {selected ? 'Update Record' : 'Save Record'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {/* Search Filters */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                    className="w-full p-4 pl-12 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm text-gray-700 dark:text-gray-200"
                    placeholder="Quick search by topic, chapter, or board..."
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setPage(1); }}
                />
            </div>

            {/* Data Display */}
            <div className="space-y-3 pb-20">
                {loading ? (
                    <div className="py-32 flex flex-col items-center text-gray-400">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p className="font-bold tracking-tight uppercase text-xs">Syncing with server...</p>
                    </div>
                ) : (
                    <>
                        {syllabusList.length > 0 ? (
                            syllabusList.map((item) => (
                                <SyllabusRow 
                                    key={item._id} 
                                    doc={item} 
                                    onEdit={(doc) => { 
                                        setSelected(doc); 
                                        setShowForm(true); 
                                        window.scrollTo({top: 0, behavior: 'smooth'}); 
                                    }}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl">
                                <p className="text-gray-400 font-medium">No records found matching your criteria.</p>
                            </div>
                        )}
                        
                        {/* Pagination Controls */}
                        {total > limit && (
                            <nav className="flex items-center justify-between px-2 py-8">
                                <button 
                                    disabled={page === 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="px-6 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl disabled:opacity-30 font-bold text-sm transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        Page {page} of {Math.ceil(total/limit)}
                                    </span>
                                </div>
                                <button 
                                    disabled={page * limit >= total}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-6 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl disabled:opacity-30 font-bold text-sm transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                                >
                                    Next Page
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

// --- Sub-Component: Typed Row ---
interface RowProps {
    doc: SyllabusType;
    onEdit: (doc: SyllabusType) => void;
    onDelete: (id: string) => void;
}

function SyllabusRow({ doc, onEdit, onDelete }: RowProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'kv' | 'json'>('kv');

    return (
        <div className="group border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all shadow-sm">
            <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-colors ${isExpanded ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded">
                                {doc.board}
                            </span>
                            {doc.competitive && (
                                <span className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded">
                                    Competitive
                                </span>
                            )}
                            <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{doc.topic}</h3>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium">
                            {doc.subject} <span className="mx-1 opacity-30">|</span> {doc.chapter_name} <span className="mx-1 opacity-30">|</span> Class {doc.grade}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button 
                        onClick={() => setViewMode(v => v === 'kv' ? 'json' : 'kv')} 
                        className={`p-2 rounded-xl transition-colors ${viewMode === 'json' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                        title="Toggle View Mode"
                    >
                        <Code size={16} />
                    </button>
                    <button 
                        onClick={() => onEdit(doc)} 
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-blue-600 transition-colors"
                        title="Edit Record"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button 
                        onClick={() => onDelete(doc._id)} 
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-red-600 transition-colors"
                        title="Delete Record"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-300">
                    {viewMode === 'json' ? (
                        <pre className="text-[11px] font-mono text-green-600 dark:text-green-400 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-x-auto shadow-inner">
                            {JSON.stringify(doc, null, 2)}
                        </pre>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <DataField label="Board/Authority" value={doc.board} />
                            <DataField label="Subject Area" value={doc.subject} />
                            <DataField label="Grade Level" value={doc.grade} />
                            <DataField label="Exam Association" value={doc.examId} />
                            <DataField label="Chapter Title" value={doc.chapter_name} className="md:col-span-2" />
                            <DataField label="Competitive Tag" value={doc.competitive ? "Enabled" : "Disabled"} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// --- Helper UI Components ---
function DataField({ label, value, className = "" }: { label: string, value: string, className?: string }) {
    return (
        <div className={`flex flex-col gap-1 border-b border-gray-200/50 dark:border-slate-800 pb-2 ${className}`}>
            <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{label}</span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{value || 'N/A'}</span>
        </div>
    );
}

interface InputProps {
    label: string;
    name: string;
    defaultValue?: string;
    type?: string;
}

function Input({ label, name, defaultValue, type = "text" }: InputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
            <input 
                name={name} 
                type={type}
                defaultValue={defaultValue}
                required
                className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-800 dark:text-gray-100"
            />
        </div>
    );
}