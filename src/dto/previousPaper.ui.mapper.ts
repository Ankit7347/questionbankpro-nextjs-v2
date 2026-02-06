// src/dto/previousPaper.ui.mapper.ts
/**
 * Mapper: Server DTO → UI DTO
 * Transforms server data into UI-friendly format
 * Handles localization, formatting, etc.
 */

import { PreviousPaperServerDTO } from '@/models/dto/previousPaper.dto';
import {
  PreviousPaperUIDTO,
  PreviousPaperCardUIDTO,
  RecentPreviousPaperUIDTO,
  YearDataUIDTO,
  PreviousPapersListUIDTO,
} from './previousPaper.ui.dto';

/**
 * Map server DTO to UI DTO
 */
export function mapServerToUIDTO(
  serverDTO: PreviousPaperServerDTO,
  examName?: string,
  subjectName?: string
): PreviousPaperUIDTO {
  return {
    id: serverDTO._id,
    title: serverDTO.title,
    slug: serverDTO.slug,
    paperCode: serverDTO.paperCode,

    // Paper Details
    year: serverDTO.year,
    session: serverDTO.session,
    duration: serverDTO.duration,
    totalMarks: serverDTO.totalMarks,
    difficulty: serverDTO.difficulty,

    // Content
    paperUrl: serverDTO.paperUrl,
    markingSchemeUrl: serverDTO.markingSchemeUrl,
    solutionUrl: serverDTO.solutionUrl,

    // Display Data
    description: serverDTO.description?.en,

    // Quality Indicators
    isVerified: serverDTO.isVerified,
    isPremium: serverDTO.isPremium,

    // Analytics
    views: serverDTO.views,
    downloads: serverDTO.downloads,
    averageRating: serverDTO.averageRating,
    totalRatings: serverDTO.totalRatings,
    totalComments: serverDTO.totalComments,

    // Relations
    examId: serverDTO.examId,
    examName,
    subjectId: serverDTO.subjectId,
    subjectName,
  };
}

/**
 * Map to card format for dashboard
 */
export function mapToCardUIDTO(serverDTO: PreviousPaperServerDTO): PreviousPaperCardUIDTO {
  return {
    id: serverDTO._id,
    title: serverDTO.title,
    paperCode: serverDTO.paperCode,
    year: serverDTO.year,
    session: serverDTO.session,
    views: serverDTO.views,
    downloads: serverDTO.downloads,
    isVerified: serverDTO.isVerified,
    isPremium: serverDTO.isPremium,
    difficulty: serverDTO.difficulty,
  };
}

/**
 * Map to recent papers format
 * lang parameter for localization
 */
export function mapToRecentUIDTO(
  serverDTO: PreviousPaperServerDTO,
  subjectName: string
): RecentPreviousPaperUIDTO {
  // Calculate human-readable time difference
  const now = new Date();
  const createdDate = new Date(serverDTO.createdAt);
  const diff = now.getTime() - createdDate.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  let dateAdded = '';
  if (minutes < 60) {
    dateAdded = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    dateAdded = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (days < 7) {
    dateAdded = `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (days < 30) {
    dateAdded = `${Math.floor(days / 7)} week${Math.floor(days / 7) !== 1 ? 's' : ''} ago`;
  } else {
    dateAdded = createdDate.toLocaleDateString();
  }

  return {
    id: serverDTO._id,
    subject: subjectName,
    code: serverDTO.paperCode,
    year: serverDTO.year.toString(),
    session: serverDTO.session,
    dateAdded,
  };
}

/**
 * Map multiple server DTOs to UI list
 */
export function mapServerListToUIList(
  listResponse: any,
  populateNames?: boolean
): PreviousPapersListUIDTO {
  return {
    papers: listResponse.data.map((dto: PreviousPaperServerDTO) =>
      mapServerToUIDTO(dto)
    ),
    total: listResponse.total,
    page: listResponse.page,
    pageSize: listResponse.pageSize,
    hasMore: listResponse.hasMore,
  };
}

/**
 * Map year data for browsing
 */
export function mapYearData(year: number, count: number): YearDataUIDTO {
  return {
    year: year.toString(),
    paperCount: count,
    isActive: count > 0,
  };
}
