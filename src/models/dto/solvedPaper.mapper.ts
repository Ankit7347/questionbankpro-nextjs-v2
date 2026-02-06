// src/models/dto/solvedPaper.mapper.ts
/**
 * Mapper: Mongoose Document → Server DTO
 * Only used by server services
 */

import { SolvedPaperServerDTO } from './solvedPaper.dto';

/**
 * Map Mongoose document to Server DTO
 */
export function mapSolvedPaperToServerDTO(doc: any): SolvedPaperServerDTO {
  if (!doc) return null as any;

  return {
    id: doc._id?.toString(),
    title: doc.title,
    paperCode: doc.paperCode,
    year: doc.year,
    session: doc.session,
    slug: doc.slug,
    examId: doc.examId?.toString?.() || doc.examId,
    subjectId: doc.subjectId?.toString?.() || doc.subjectId,
    totalMarks: doc.totalMarks,
    solutions: (doc.solutions || []).map((step: any) => ({
      stepNumber: step.stepNumber,
      description: step.description,
      formula: step.formula,
      explanation: step.explanation,
      imageUrl: step.imageUrl,
    })),
    solutionFileUrl: doc.solutionFileUrl,
    difficulty: doc.difficulty,
    status: doc.status,
    viewCount: doc.viewCount || 0,
    downloadCount: doc.downloadCount || 0,
    isVerified: doc.isVerified || false,
    rating: doc.rating,
    ratingCount: doc.ratingCount,
    submittedBy: doc.submittedBy,
    verifiedBy: doc.verifiedBy,
    keywords: doc.keywords,
    description: doc.description,
    tags: doc.tags,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    isPublic: doc.isPublic !== false,
    isDeleted: doc.isDeleted || false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdBy: doc.createdBy?.toString?.() || doc.createdBy,
    updatedBy: doc.updatedBy?.toString?.() || doc.updatedBy,
  };
}

/**
 * Map array of documents to Server DTOs
 */
export function mapSolvedPapersToServerDTOs(docs: any[]): SolvedPaperServerDTO[] {
  return docs.map(mapSolvedPaperToServerDTO);
}
