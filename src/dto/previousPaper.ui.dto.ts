// src/dto/previousPaper.ui.dto.ts
/**
 * UI Data Transfer Objects for Previous Papers
 * What the UI components actually work with
 * No server DTOs, no mongoose imports
 * Localized, simplified, focused on presentation
 */

export interface PreviousPaperUIDTO {
  id: string;
  title: string;
  slug: string;
  paperCode: string;

  // Paper Details
  year: number;
  session: string;
  duration?: number;
  totalMarks?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Mixed';

  // Content
  paperUrl: string;
  markingSchemeUrl?: string;
  solutionUrl?: string;

  // Display Data
  description?: string; // Already localized from server
  
  // Quality Indicators
  isVerified: boolean;
  isPremium: boolean;

  // Analytics
  views: number;
  downloads: number;
  averageRating: number;
  totalRatings: number;
  totalComments: number;

  // Relations
  examId: string;
  examName?: string;
  subjectId: string;
  subjectName?: string;
}

/**
 * For dashboard previous papers listing
 */
export interface PreviousPaperCardUIDTO {
  id: string;
  title: string;
  paperCode: string;
  year: number;
  session: string;
  views: number;
  downloads: number;
  isVerified: boolean;
  isPremium: boolean;
  difficulty?: string;
}

/**
 * Recently Added Papers (dashboard)
 */
export interface RecentPreviousPaperUIDTO {
  id: string;
  subject: string;
  code: string;
  year: string;
  session: string;
  dateAdded: string; // Human-readable format "2 days ago"
}

/**
 * Year grouping for browsing
 */
export interface YearDataUIDTO {
  year: string;
  paperCount: number;
  isActive: boolean;
}

/**
 * Dashboard stats
 */
export interface PreviousPapersStatsUIDTO {
  totalPapers: number;
  totalDownloads: number;
  activeYears: number;
}

/**
 * Paginated response for UI
 */
export interface PreviousPapersListUIDTO {
  papers: PreviousPaperUIDTO[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
