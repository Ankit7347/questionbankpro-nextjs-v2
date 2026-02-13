// src/models/dto/solvedPaper.mapper.ts
/**
 * Mapper: Mongoose Document → Server DTO
 * Only used by server services
 */

import { SolvedPaperServerDTO } from './solvedPaper.dto';
type Lang = "en" | "hi";

function resolveText(
  text: { en: string; hi?: string } | string,
  lang: Lang
): string {
  // if text is already a string, just return it (fallback)
  if (typeof text === 'string') return text;
  return text[lang] ?? text.en;
}

function extractId(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value._id) return value._id.toString();
    if (value.id) return value.id.toString();
    // if object has custom toString that isn't [object Object]
    if (value.toString && typeof value.toString === 'function') {
      const s = value.toString();
      if (s && s !== '[object Object]') return s;
    }
    return '';
  }
  if (value.toString && typeof value.toString === 'function') {
    const s = value.toString();
    if (s && s !== '[object Object]') return s;
  }
  return '';
}

/**
 * Map Mongoose document to Server DTO
 */
export function mapSolvedPaperToServerDTO(
  doc: any,
  lang: Lang
): SolvedPaperServerDTO {
  if (!doc) return null as any;

  return {
    id: doc._id?.toString(),
    title: resolveText(doc.title, lang),
    paperCode: doc.paperCode,
    year: doc.year,
    session: doc.session,
    slug: doc.slug,
    examId: extractId(doc.examId),
    subjectId: extractId(doc.subjectId),
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
    createdBy: extractId(doc.createdBy),
    updatedBy: extractId(doc.updatedBy),
  };
}

/**
 * Map array of documents to Server DTOs
 */
export function mapSolvedPapersToServerDTOs(
  docs: any[],
  lang: Lang
): SolvedPaperServerDTO[] {
  // using closure to supply lang – Array.map's optional second
  // argument is 'thisArg', not a custom parameter
  return docs.map(doc => mapSolvedPaperToServerDTO(doc, lang));
}
