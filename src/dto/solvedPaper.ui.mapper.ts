// src/dto/solvedPaper.ui.mapper.ts
/**
 * Mapper: Server DTO → UI DTO
 * Handles localization, formatting, human-readable text
 */

import {
  SolvedPaperUIDTO,
  SolvedPaperCardUIDTO,
  RecentSolvedPaperUIDTO,
  SolvedPapersListUIDTO,
  YearDataUIDTO,
} from './solvedPaper.ui.dto';
import { SolvedPaperServerDTO, SolvedPapersListResponseDTO } from '@/models/dto/solvedPaper.dto';

/**
 * Format date as "X days ago"
 */
function formatDateAdded(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

/**
 * Server DTO → Full UI DTO
 */
export function mapServerToUIDTO(
  dto: SolvedPaperServerDTO,
  subjectName?: string,
  examName?: string
): SolvedPaperUIDTO {
  return {
    id: dto.id,
    title: dto.title,
    code: dto.paperCode,
    year: dto.year,
    session: dto.session,
    subject: subjectName || 'Subject',
    exam: examName || 'Exam',
    totalMarks: dto.totalMarks,
    difficulty: dto.difficulty || 'MEDIUM',
    solutions: dto.solutions || [],
    solutionFileUrl: dto.solutionFileUrl,
    description: dto.description,
    rating: dto.rating,
    ratingCount: dto.ratingCount,
    isVerified: dto.isVerified,
    viewCount: dto.viewCount,
    downloadCount: dto.downloadCount,
    tags: dto.tags,
  };
}

/**
 * Server DTO → Card UI DTO
 */
export function mapToCardUIDTO(
  dto: SolvedPaperServerDTO,
  subjectName?: string,
  examName?: string
): SolvedPaperCardUIDTO {
  return {
    id: dto.id,
    title: dto.title,
    code: dto.paperCode,
    year: dto.year,
    session: dto.session,
    subject: subjectName || 'Subject',
    exam: examName || 'Exam',
    totalMarks: dto.totalMarks,
    difficulty: dto.difficulty || 'MEDIUM',
    isVerified: dto.isVerified,
    rating: dto.rating,
    downloadCount: dto.downloadCount,
    views: dto.viewCount || 0,
  };
}

/**
 * Server DTO → Recent UI DTO
 */
export function mapToRecentUIDTO(
  dto: SolvedPaperServerDTO,
  subjectName?: string
): RecentSolvedPaperUIDTO {
  return {
    id: dto.id,
    title: dto.title,
    code: dto.paperCode,
    year: dto.year,
    session: dto.session,
    subject: subjectName || 'Subject',
    dateAdded: formatDateAdded(dto.createdAt),
    isVerified: dto.isVerified,
  };
}

/**
 * Server list response → UI list response
 */
export function mapServerListToUIList(
  response: SolvedPapersListResponseDTO
): SolvedPapersListUIDTO {
  return {
    papers: response.data.map((dto) => mapToCardUIDTO(dto)),
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    hasMore: response.hasMore,
  };
}

/**
 * Map year data
 */
export function mapYearData(year: number, count: number): YearDataUIDTO {
  return {
    year,
    paperCount: count,
  };
}
