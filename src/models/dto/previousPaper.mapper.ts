// src/models/dto/previousPaper.mapper.ts
/**
 * Mapper: Mongoose Model → Server DTO
 * Converts raw database documents to server DTOs
 */

import { PreviousPaperServerDTO } from './previousPaper.dto';
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

export function mapPreviousPaperToServerDTO(
  mongoDocument: any,
  lang: Lang
): PreviousPaperServerDTO {
  return {
    _id: mongoDocument._id?.toString() || '',
    title: resolveText(mongoDocument.title, lang),
    slug: mongoDocument.slug,
    paperCode: mongoDocument.paperCode,

    // Relations
    examId: extractId(mongoDocument.examId),
    subExamId: extractId(mongoDocument.subExamId),
    courseId: extractId(mongoDocument.courseId),
    subjectId: extractId(mongoDocument.subjectId),
    chapterId: extractId(mongoDocument.chapterId),

    // Paper Details
    year: mongoDocument.year,
    session: mongoDocument.session,
    duration: mongoDocument.duration,
    totalMarks: mongoDocument.totalMarks,
    difficulty: mongoDocument.difficulty,

    // Content Files
    paperUrl: mongoDocument.paperUrl,
    markingSchemeUrl: mongoDocument.markingSchemeUrl,
    solutionUrl: mongoDocument.solutionUrl,
    additionalResourcesUrls: mongoDocument.additionalResourcesUrls,

    // Metadata
    description: mongoDocument.description,
    keywords: mongoDocument.keywords,
    searchText: mongoDocument.searchText,

    // Quality
    isVerified: mongoDocument.isVerified || false,
    verifiedBy: mongoDocument.verifiedBy,
    verifiedAt: mongoDocument.verifiedAt,
    isCopyrighted: mongoDocument.isCopyrighted || false,
    copyrightHolder: mongoDocument.copyrightHolder,
    copyrightLicense: mongoDocument.copyrightLicense,

    // Access Control
    visibility: mongoDocument.visibility || 'PUBLIC',
    isPremium: mongoDocument.isPremium || false,
    accessLevel: mongoDocument.accessLevel || 'FREE',
    validFrom: mongoDocument.validFrom,
    validTo: mongoDocument.validTo,

    // Analytics
    views: mongoDocument.views || 0,
    downloads: mongoDocument.downloads || 0,
    prints: mongoDocument.prints || 0,
    shares: mongoDocument.shares || 0,
    averageRating: mongoDocument.averageRating || 0,
    totalRatings: mongoDocument.totalRatings || 0,
    totalComments: mongoDocument.totalComments || 0,
    totalBookmarks: mongoDocument.totalBookmarks || 0,

    // Admin
    status: mongoDocument.status || 'DRAFT',
    priority: mongoDocument.priority || 0,
    displayOrder: mongoDocument.displayOrder || 0,
    createdBy: mongoDocument.createdBy,
    publishedAt: mongoDocument.publishedAt,
    lastSyncedAt: mongoDocument.lastSyncedAt,

    // SEO
    metaTitle: mongoDocument.metaTitle,
    metaDescription: mongoDocument.metaDescription,
    ogImageUrl: mongoDocument.ogImageUrl,
    tags: mongoDocument.tags,

    // Relations
    relatedPaperIds: mongoDocument.relatedPaperIds?.map((id: any) => 
      id.toString ? id.toString() : id
    ),

    // Base Fields
    createdAt: mongoDocument.createdAt,
    updatedAt: mongoDocument.updatedAt,
    isDeleted: mongoDocument.isDeleted || false,
    updatedBy: mongoDocument.updatedBy,
  };
}

/**
 * Map array of documents
 */
export function mapPreviousPapersToServerDTOs(
  mongoDocuments: any[],
  lang: Lang
): PreviousPaperServerDTO[] {
  return mongoDocuments.map(doc => mapPreviousPaperToServerDTO(doc, lang));
}
