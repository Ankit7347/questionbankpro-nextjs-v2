// src/app/(no-login)/best-book/page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  Search, 
  BookOpen, 
  Filter, 
  Library, 
  Sparkles, 
  X,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component or use standard tailwind

// Types
interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl?: string;
  description?: string;
  tags: string[];
  exam: string;
  subExam: string;
  subject: string;
  examSlug: string;
  subExamSlug: string;
  subjectSlug: string;
}

interface FilterOption {
  name: { en: string } | string;
  slug: string;
  examSlug?: string; // For SubExam
  subExamSlug?: string; // For Subject
}

export default function BestBooksPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  
  // Metadata for filters
  const [exams, setExams] = useState<FilterOption[]>([]);
  const [subExams, setSubExams] = useState<FilterOption[]>([]);
  const [subjects, setSubjects] = useState<FilterOption[]>([]);

  // Filter State
  const [search, setSearch] = useState("");
  const [selectedExam, setSelectedExam] = useState<string>("all");
  const [selectedSubExam, setSelectedSubExam] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("explore");

  // Initial Data Fetch (Metadata)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch("/api/bestbook?action=metadata");
        const json = await res.json();
        if (json.success) {
          setExams(json.data.exams);
          setSubExams(json.data.subExams);
          setSubjects(json.data.subjects);
        }
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      }
    };
    fetchMetadata();
  }, []);

  // Set default filters based on user session
  useEffect(() => {
    if (status === "authenticated" && session?.user?.subExamId) {
      setActiveTab("recommended");
    }
  }, [status, session]);

  // Fetch Books when filters change
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const payload: any = {};
        if (search) payload.search = search;

        if (activeTab === "recommended") {
          payload.recommended = true;
        } else {
          if (selectedExam && selectedExam !== "all") payload.examSlug = selectedExam;
          if (selectedSubExam && selectedSubExam !== "all") payload.subExamSlug = selectedSubExam;
          if (selectedSubject && selectedSubject !== "all") payload.subjectSlug = selectedSubject;
        }

        const res = await fetch("/api/bestbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setBooks(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const timeoutId = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timeoutId);
  }, [search, selectedExam, selectedSubExam, selectedSubject, activeTab]);

  // Derived Filter Options (Dependent Dropdowns)
  const filteredSubExams = useMemo(() => {
    if (selectedExam === "all") return subExams;
    return subExams.filter((s) => s.examSlug === selectedExam);
  }, [selectedExam, subExams]);

  const filteredSubjects = useMemo(() => {
    if (selectedSubExam === "all") return subjects;
    return subjects.filter((s) => s.subExamSlug === selectedSubExam);
  }, [selectedSubExam, subjects]);

  // Handlers
  const handleTabChange = (val: string) => {
    setActiveTab(val);
    
    // When switching tabs, we reset the manual filters to avoid confusion
    // The API handles the actual filtering logic based on the tab mode
    if (val === "recommended" || val === "explore") {
      setSelectedExam("all");
      setSelectedSubExam("all");
      setSelectedSubject("all");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedExam("all");
    setSelectedSubExam("all");
    setSelectedSubject("all");
  };

  const getName = (obj: any) => (typeof obj.name === 'object' ? obj.name.en : obj.name);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-slate-900 pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/sample-book.png')]"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Curated Books for <span className="text-indigo-200">Top Rankers</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-10">
            Discover the most recommended study materials, handpicked by experts to help you ace your exams.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search by title, author, or topic..."
              className="pl-11 py-6 rounded-full text-lg shadow-xl border-0 bg-white/95 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-indigo-400 text-slate-900 placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        
        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedExam} onValueChange={(val) => { setSelectedExam(val); setSelectedSubExam("all"); setSelectedSubject("all"); setActiveTab("explore"); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                {exams.map((e) => (
                  <SelectItem key={e.slug} value={e.slug}>{getName(e)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubExam} onValueChange={(val) => { setSelectedSubExam(val); setSelectedSubject("all"); setActiveTab("explore"); }}>
              <SelectTrigger className="w-full" disabled={selectedExam === "all" && filteredSubExams.length > 100}>
                <SelectValue placeholder="Select Class/Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {filteredSubExams.map((e) => (
                  <SelectItem key={e.slug} value={e.slug}>{getName(e)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={(val) => { setSelectedSubject(val); setActiveTab("explore"); }}>
              <SelectTrigger className="w-full" disabled={filteredSubjects.length === 0}>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {filteredSubjects.map((e) => (
                  <SelectItem key={e.slug} value={e.slug}>{getName(e)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20"
            >
              <X size={16} /> Clear Filters
            </Button>
          </div>
        </div>

        {/* Tabs & Results */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white dark:bg-slate-900 p-1 border dark:border-slate-800 rounded-lg h-auto">
              {status === "authenticated" && (
                <TabsTrigger 
                  value="recommended"
                  className="px-4 py-2 rounded-md data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/30 dark:data-[state=active]:text-indigo-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Recommended For You
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="explore"
                className="px-4 py-2 rounded-md data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"
              >
                <Library className="w-4 h-4 mr-2" />
                Explore All
              </TabsTrigger>
            </TabsList>

            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {loading ? "Searching..." : `${books.length} books found`}
            </div>
          </div>

          <TabsContent value="recommended" className="mt-0">
            <BookGrid books={books} loading={loading} />
          </TabsContent>

          <TabsContent value="explore" className="mt-0">
            <BookGrid books={books} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-Components
// ----------------------------------------------------------------------

function BookGrid({ books, loading }: { books: Book[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[380px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse p-4">
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-4" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded mb-4" />
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <BookOpen className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No books found</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
        <Button variant="link" onClick={() => window.location.reload()} className="mt-4 text-indigo-600">
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const href = `/exams/${book.examSlug}/${book.subExamSlug}/${book.subjectSlug}`;

  return (
    <Link href={href} className="block h-full">
      <Card className="group h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
        {/* Image Area */}
        <div className="relative h-52 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {book.imageUrl ? (
            <img 
              src={book.imageUrl} 
              alt={book.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <BookOpen size={48} />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm shadow-sm">
              {book.subject}
            </Badge>
          </div>
        </div>

        <CardContent className="flex-1 p-5">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
            <span>{book.exam}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{book.subExam}</span>
          </div>
          
          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {book.title}
          </h3>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
            by {book.author}
          </p>

          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
            {book.description || "No description available for this book."}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {book.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
