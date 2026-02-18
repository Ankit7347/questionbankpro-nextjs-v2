// src/models/dto/note.mapper.ts
import { NoteServerDTO } from "./note.dto";

/**
 * Map Note document to NoteServerDTO
 */
export function mapNoteToDTO(doc: any): NoteServerDTO {
  return {
    id: doc._id?.toString() || "",
    userId: doc.userId,
    title: doc.title,
    description: doc.description,
    content: doc.content,
    subExamId: doc.subExamId?.toString() || "",
    subjectId: doc.subjectId?.toString() || "",
    subjectName: doc.subjectName,
    chapterId: doc.chapterId?.toString() || null,
    chapterName: doc.chapterName,
    topicId: doc.topicId?.toString() || null,
    topicName: doc.topicName,
    isPinned: doc.isPinned || false,
    isPublic: doc.isPublic || false,
    views: doc.views || 0,
    tags: doc.tags || [],
    attachments: doc.attachments || [],
    createdAt: doc.createdAt?.toISOString() || "",
    updatedAt: doc.updatedAt?.toISOString() || "",
  };
}

/**
 * Map multiple notes to DTOs
 */
export function mapNotesToDTOs(docs: any[]): NoteServerDTO[] {
  return docs.map(mapNoteToDTO);
}
