// src/services/client/previousPaper.client.ts
/**
 * Client Service for Previous Papers
 * Runs in browser/client
 * Calls API endpoints
 * Returns UI DTOs only
 */

import { ApiResponse } from '@/models/dto/apiResponse.dto';
import {
  PreviousPaperUIDTO,
  PreviousPaperCardUIDTO,
  RecentPreviousPaperUIDTO,
  YearDataUIDTO,
  PreviousPapersStatsUIDTO,
  PreviousPapersListUIDTO,
} from '@/dto/previousPaper.ui.dto';
import {
  mapServerToUIDTO,
  mapToCardUIDTO,
  mapToRecentUIDTO,
  mapYearData,
  mapServerListToUIList,
} from '@/dto/previousPaper.ui.mapper';
import { PreviousPaperServerDTO, PreviousPapersStatsDTO } from '@/models/dto/previousPaper.dto';

/**
 * Get all previous papers with filters
 */
export async function getPreviousPapers(
  page: number = 1,
  limit: number = 20,
  filters?: {
    year?: number;
    examId?: string;
    subjectId?: string;
    difficulty?: string;
  }
): Promise<PreviousPapersListUIDTO> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  if (filters?.year) params.append('year', filters.year.toString());
  if (filters?.examId) params.append('examId', filters.examId);
  if (filters?.subjectId) params.append('subjectId', filters.subjectId);
  if (filters?.difficulty) params.append('difficulty', filters.difficulty);

  const response = await fetch(`/api/previous-papers?${params.toString()}`);
  const data: ApiResponse<any> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch papers');
  }

  return mapServerListToUIList(data.data);
}

/**
 * Get single paper by ID
 */
export async function getPreviousPaperById(id: string): Promise<PreviousPaperUIDTO> {
  const response = await fetch(`/api/previous-papers/${id}`);
  const data: ApiResponse<PreviousPaperServerDTO> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch paper');
  }

  return mapServerToUIDTO(data.data);
}

/**
 * Get papers by year
 */
export async function getPreviousPapersByYear(year: number): Promise<PreviousPaperCardUIDTO[]> {
  const response = await fetch(`/api/previous-papers/year/${year}`);
  const data: ApiResponse<PreviousPaperServerDTO[]> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch papers');
  }

  return data.data.map(mapToCardUIDTO);
}

/**
 * Get recent papers
 */
export async function getRecentPreviousPapers(limit: number = 4): Promise<RecentPreviousPaperUIDTO[]> {
  const response = await fetch(`/api/previous-papers/recent?limit=${limit}`);
  const data: ApiResponse<PreviousPaperServerDTO[]> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch recent papers');
  }

  // Map with subject names (would be populated from server)
  return data.data.map((dto: PreviousPaperServerDTO) =>
    mapToRecentUIDTO(dto, (dto as any).subjectId?.name || 'Subject')
  );
}

/**
 * Get dashboard stats
 */
export async function getPreviousPapersStats(): Promise<PreviousPapersStatsUIDTO> {
  const response = await fetch('/api/previous-papers/stats');
  const data: ApiResponse<PreviousPapersStatsDTO> = await response.json();

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
 * Search papers
 */
export async function searchPreviousPapers(
  query: string,
  page: number = 1
): Promise<PreviousPapersListUIDTO> {
  const params = new URLSearchParams();
  params.append('q', query);
  params.append('page', page.toString());

  const response = await fetch(`/api/previous-papers/search?${params.toString()}`);
  const data: ApiResponse<any> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Search failed');
  }

  return mapServerListToUIList(data.data);
}

/**
 * Track view
 */
export async function trackPreviousPaperView(id: string): Promise<void> {
  try {
    await fetch(`/api/previous-papers/${id}/track-view`, {
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
export async function trackPreviousPaperDownload(id: string): Promise<void> {
  try {
    await fetch(`/api/previous-papers/${id}/track-download`, {
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
  const response = await fetch('/api/previous-papers/stats');
  const data: ApiResponse<PreviousPapersStatsDTO> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch years');
  }

  return data.data.papersByYear.map((item: { year: number; count: number }) =>
    mapYearData(item.year, item.count)
  );
}
