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
  id: string;
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
  topicId: string;
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
    id: string;
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
  id: string;
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
  id: string;
  title: string;
  notesCount: number;
  progress: number;
}
