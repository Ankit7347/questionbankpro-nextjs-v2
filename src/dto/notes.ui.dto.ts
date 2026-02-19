// src/dto/notes.ui.dto.ts
/**
 * Notes UI DTOs
 * =============
 * Client-side DTOs for the Notes feature
 * No imports from server or mongoose
 */

/**
 * Notes Overview
 * ==============
 * Returned by /api/dashboard/notes
 */
export interface NotesOverviewData {
  subjects: SubjectNotes[];
  stats: {
    totalNotes: number;
    totalSubjects: number;
  };
  recentNote?: RecentNoteData;
}

/**
 * Subject Notes
 * =============
 * Info about notes in a subject
 */
export interface SubjectNotes {
  slug: string;
  name: string;
  totalNotes: number;
  progress: number;
}

/**
 * Recent Note Data
 * ================
 * For the "Continue Learning" section
 */
export interface RecentNoteData {
  topicSlug: string;
  chapterSlug: string;
  subjectSlug: string;
  topicName: string;
  chapterName: string;
  subjectName: string;
  progress: number;
  lastAccessed: string;
}

/**
 * Subject Chapters Data
 * =====================
 * Returned by /api/dashboard/notes/[subjectId]
 */
export interface SubjectChaptersData {
  subject: {
    slug: string;
    name: string;
  };
  chapters: ChapterData[];
  stats: {
    totalNotes: number;
    totalChapters: number;
  };
}

/**
 * Chapter Data
 * ============
 */
export interface ChapterData {
  slug: string;
  title: string;
  description?: string;
  totalNotes: number;
  totalTopics: number;
  completedTopics: number;
  progress: number;
}

/**
 * Topic Data
 * ==========
 */
export interface TopicData {
  slug: string;
  title: string;
  notesCount: number;
  progress: number;
}
/**
 * Chapter Topics Data
 * ===================
 * Returned by /api/dashboard/notes/[subjectId]/[chapterId]
 */
export interface ChapterTopicsData {
  chapter: {
    slug: string;
    title: string;
    description?: string;
  };
  topics: TopicData[];
  stats: {
    totalNotes: number;
    totalTopics: number;
    completedTopics: number;
  };
}

/**
 * Topic Notes Data
 * ================
 * Returned by /api/dashboard/notes/[subjectId]/[chapterId]/[topicId]
 */
export interface TopicNotesData {
  topic: {
    slug: string;
    title: string;
    difficulty?: string;
  };
  chapter: {
    slug: string;
    title: string;
  };
  notes: NoteItem[];
  stats: {
    totalNotes: number;
  };
}

/**
 * Note Item
 * =========
 */
export interface NoteItem {
  id: string;
  title: string;
  content: string;
  type: "text" | "image" | "link";
  createdDate: string;
}