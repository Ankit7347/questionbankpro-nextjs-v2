// src/dto/solvedPaper.ui.dto.ts
/**
 * UI DTOs for Solved Papers
 * Client-facing, simplified data structures
 * Localization-ready, no mongoose imports
 */

/**
 * Solution step for UI (same as server but localized)
 */
export interface SolutionStepUIDTO {
  stepNumber: number;
  description: string;
  formula?: string;
  explanation?: string;
  imageUrl?: string;
}

/**
 * Full solved paper detail view
 */
export interface SolvedPaperUIDTO {
  id: string;
  title: string;
  code: string;
  year: number;
  session: string;
  subject: string;
  exam: string;
  totalMarks: number;
  difficulty: string;
  solutions: SolutionStepUIDTO[];
  solutionFileUrl?: string;
  description?: string;
  rating?: number;
  ratingCount?: number;
  isVerified: boolean;
  viewCount: number;
  downloadCount: number;
  tags?: string[];
}

/**
 * Card view (for grid/list display)
 */
export interface SolvedPaperCardUIDTO {
  id: string;
  title: string;
  code: string;
  year: number;
  subject: string;
  exam: string;
  totalMarks: number;
  difficulty: string;
  isVerified: boolean;
  rating?: number;
  downloadCount: number;
}

/**
 * Recent papers (minimal info)
 */
export interface RecentSolvedPaperUIDTO {
  id: string;
  title: string;
  code: string;
  year: number;
  session: string;
  subject: string;
  dateAdded: string;
  isVerified: boolean;
}

/**
 * Year data for browsing
 */
export interface YearDataUIDTO {
  year: number;
  paperCount: number;
}

/**
 * Dashboard stats
 */
export interface SolvedPapersStatsUIDTO {
  totalPapers: number;
  totalDownloads: number;
  activeYears: number;
}

/**
 * Paginated list response
 */
export interface SolvedPapersListUIDTO {
  papers: SolvedPaperCardUIDTO[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
