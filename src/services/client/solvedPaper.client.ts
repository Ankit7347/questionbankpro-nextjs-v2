// src/services/client/solvedPaper.client.ts
/**
 * Client Service for Solved Papers
 * Runs in browser/client
 * Calls API endpoints
 * Returns UI DTOs only
 */

import { ApiResponse } from '@/models/dto/apiResponse.dto';
import {
  SolvedPaperUIDTO,
  SolvedPaperCardUIDTO,
  RecentSolvedPaperUIDTO,
  YearDataUIDTO,
  SolvedPapersStatsUIDTO,
  SolvedPapersListUIDTO,
} from '@/dto/solvedPaper.ui.dto';
import {
  mapServerToUIDTO,
  mapToCardUIDTO,
  mapToRecentUIDTO,
  mapYearData,
  mapServerListToUIList,
} from '@/dto/solvedPaper.ui.mapper';
import { SolvedPaperServerDTO, SolvedPapersStatsDTO } from '@/models/dto/solvedPaper.dto';

/**
 * Get all solved papers with filters
 */
export async function getSolvedPapers(
  page: number = 1,
  limit: number = 20,
  filters?: {
    year?: number;
    examId?: string;
    subjectId?: string;
    difficulty?: string;
    isVerified?: boolean;
  }
): Promise<SolvedPapersListUIDTO> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  if (filters?.year) params.append('year', filters.year.toString());
  if (filters?.examId) params.append('examId', filters.examId);
  if (filters?.subjectId) params.append('subjectId', filters.subjectId);
  if (filters?.difficulty) params.append('difficulty', filters.difficulty);
  if (filters?.isVerified !== undefined) params.append('isVerified', filters.isVerified.toString());

  const response = await fetch(`/api/solved-papers?${params.toString()}`);
  const data: ApiResponse<any> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch papers');
  }

  return mapServerListToUIList(data.data);
}

/**
 * Get single solved paper by ID
 */
export async function getSolvedPaperById(id: string): Promise<SolvedPaperUIDTO> {
  const response = await fetch(`/api/solved-papers/${id}`);
  const data: ApiResponse<SolvedPaperServerDTO> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch paper');
  }

  return mapServerToUIDTO(data.data);
}

/**
 * Get solved papers by year
 */
export async function getSolvedPapersByYear(year: number): Promise<SolvedPaperCardUIDTO[]> {
  const response = await fetch(`/api/solved-papers/year/${year}`);
  const data: ApiResponse<SolvedPaperServerDTO[]> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch papers');
  }

  return data.data.map((dto: SolvedPaperServerDTO) => mapToCardUIDTO(dto));
}

/**
 * Get recent solved papers
 */
export async function getRecentSolvedPapers(limit: number = 4): Promise<RecentSolvedPaperUIDTO[]> {
  const response = await fetch(`/api/solved-papers/recent?limit=${limit}`);
  const data: ApiResponse<SolvedPaperServerDTO[]> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch recent papers');
  }

  // Map with subject names (would be populated from server)
  return data.data.map((dto: SolvedPaperServerDTO) =>
    mapToRecentUIDTO(dto, (dto as any).subjectId?.name || 'Subject')
  );
}

/**
 * Get dashboard stats
 */
export async function getSolvedPapersStats(): Promise<SolvedPapersStatsUIDTO> {
  const response = await fetch('/api/solved-papers/stats');
  const data: ApiResponse<SolvedPapersStatsDTO> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch stats');
  }

  return {
    totalPapers: data.data.totalPapers,
    totalDownloads: data.data.totalDownloads,
    activeYears: data.data.activeYears,
  };
}

/**
 * Search solved papers
 */
export async function searchSolvedPapers(
  query: string,
  page: number = 1
): Promise<SolvedPapersListUIDTO> {
  const params = new URLSearchParams();
  params.append('q', query);
  params.append('page', page.toString());

  const response = await fetch(`/api/solved-papers/search?${params.toString()}`);
  const data: ApiResponse<any> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Search failed');
  }

  return mapServerListToUIList(data.data);
}

/**
 * Track view
 */
export async function trackSolvedPaperView(id: string): Promise<void> {
  try {
    await fetch(`/api/solved-papers/${id}/track-view`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Failed to track view:', error);
    // Silent fail - don't break UI for analytics
  }
}

/**
 * Track download
 */
export async function trackSolvedPaperDownload(id: string): Promise<void> {
  try {
    await fetch(`/api/solved-papers/${id}/track-download`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Failed to track download:', error);
    // Silent fail
  }
}

/**
 * Get year list for browsing
 * (Derived from stats data)
 */
export async function getYearsList(): Promise<YearDataUIDTO[]> {
  const response = await fetch('/api/solved-papers/stats');
  const data: ApiResponse<SolvedPapersStatsDTO> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch years');
  }

  return data.data.papersByYear.map((item: { year: number; count: number }) =>
    mapYearData(item.year, item.count)
  );
}
