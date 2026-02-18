// src/models/dto/note.dto.ts
/**
 * Note Server DTO
 * ===============
 * Server-side internal DTO for note operations
 */
export interface NoteServerDTO {
  id: string;
  userId: string;
  title: string;
  description?: string;
  content?: string;
  subExamId: string;
  subjectId: string;
  subjectName?: string;
  chapterId?: string | null;
  chapterName?: string | null;
  topicId?: string | null;
  topicName?: string | null;
  isPinned: boolean;
  isPublic: boolean;
  views: number;
  tags: string[];
  attachments?: Array<{
    url: string;
    name: string;
    type: string;
    uploadedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Notes Overview UI
 * ================
 * Returned by /api/dashboard/notes
 */
export interface NotesOverviewUI {
  subjects: SubjectNotesUI[];
  stats: {
    totalNotes: number;
    totalSubjects: number;
    recentNotes: QuickNoteUI[];
  };
}

/**
 * Subject Notes UI
 * ================
 * Notes grouped by subject
 */
export interface SubjectNotesUI {
  id: string;
  name: string;
  totalNotes: number;
  progress: number;
  recentNotes: QuickNoteUI[];
}

/**
 * Quick Note UI
 * =============
 * Minimal note info for cards
 */
export interface QuickNoteUI {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string;
  chapterName?: string;
  topicId?: string;
  topicName?: string;
  progress: number;
  lastAccessed: string;
  isPinned: boolean;
}

/**
 * Subject Chapter Notes UI
 * ========================
 * Detailed notes for subject view
 */
export interface SubjectChapterNotesUI {
  subject: {
    id: string;
    name: string;
  };
  chapters: ChapterNotesUI[];
  stats: {
    totalNotes: number;
    totalChapters: number;
    totalProgress: number;
  };
}

/**
 * Chapter Notes UI
 * ================
 */
export interface ChapterNotesUI {
  id: string;
  title: string;
  description?: string;
  totalNotes: number;
  totalTopics: number;
  completedTopics: number;
  progress: number;
  topics: TopicNotesUI[];
}

/**
 * Topic Notes UI
 * ==============
 */
export interface TopicNotesUI {
  id: string;
  title: string;
  notesCount: number;
  lastNoteTime?: string;
  progress: number;
}
