// src/models/dto/previousPaper.mapper.ts
/**
 * Mapper: Mongoose Model → Server DTO
 * Converts raw database documents to server DTOs
 */

import { PreviousPaper } from '@/models/mongoose/PreviousPaper.schema';
import { PreviousPaperServerDTO } from './previousPaper.dto';

export function mapPreviousPaperToServerDTO(
  mongoDocument: any
): PreviousPaperServerDTO {
  return {
    _id: mongoDocument._id?.toString() || '',
    title: mongoDocument.title,
    slug: mongoDocument.slug,
    paperCode: mongoDocument.paperCode,

    // Relations
    examId: mongoDocument.examId?.toString() || '',
    subExamId: mongoDocument.subExamId?.toString(),
    courseId: mongoDocument.courseId?.toString(),
    subjectId: mongoDocument.subjectId?.toString() || '',
    chapterId: mongoDocument.chapterId?.toString(),

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
  mongoDocuments: any[]
): PreviousPaperServerDTO[] {
  return mongoDocuments.map(mapPreviousPaperToServerDTO);
}
