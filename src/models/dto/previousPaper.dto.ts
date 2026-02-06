// src/models/dto/previousPaper.dto.ts
/**
 * Server Data Transfer Objects for Previous Papers
 * Used internally by server services
 * Never exposed to UI, transformed to UI DTOs before returning
 */

export interface PreviousPaperServerDTO {
  _id: string;
  title: string;
  slug: string;
  paperCode: string;

  // Relations
  examId: string;
  subExamId?: string;
  courseId?: string;
  subjectId: string;
  chapterId?: string;

  // Paper Details
  year: number;
  session: string;
  duration?: number;
  totalMarks?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Mixed';

  // Content Files
  paperUrl: string;
  markingSchemeUrl?: string;
  solutionUrl?: string;
  additionalResourcesUrls?: string[];

  // Metadata
  description?: {
    en?: string;
    hi?: string;
  };
  keywords?: string[];
  searchText?: string;

  // Quality
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  isCopyrighted: boolean;
  copyrightHolder?: string;
  copyrightLicense?: string;

  // Access Control
  visibility: 'PUBLIC' | 'INTERNAL' | 'PREMIUM' | 'RESTRICTED';
  isPremium: boolean;
  accessLevel: 'FREE' | 'PREMIUM' | 'BETA' | 'INTERNAL';
  validFrom?: Date;
  validTo?: Date;

  // Analytics
  views: number;
  downloads: number;
  prints: number;
  shares: number;
  averageRating: number;
  totalRatings: number;
  totalComments: number;
  totalBookmarks: number;

  // Admin
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
  priority: number;
  displayOrder: number;
  createdBy: string;
  publishedAt?: Date;
  lastSyncedAt?: Date;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  tags?: string[];

  // Relations
  relatedPaperIds?: string[];

  // Base Fields
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  updatedBy?: string;
}

/**
 * DTO for creating a new Previous Paper (request from API)
 */
export interface CreatePreviousPaperServerDTO {
  title: string;
  paperCode: string;
  examId: string;
  subjectId: string;
  year: number;
  session: string;
  paperUrl: string;

  // Optional
  subExamId?: string;
  courseId?: string;
  chapterId?: string;
  duration?: number;
  totalMarks?: number;
  difficulty?: string;
  markingSchemeUrl?: string;
  solutionUrl?: string;
  additionalResourcesUrls?: string[];
  description?: {
    en?: string;
    hi?: string;
  };
  keywords?: string[];
  tags?: string[];
  isPremium?: boolean;
  accessLevel?: string;
  visibility?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
}

/**
 * DTO for updating a Previous Paper
 */
export interface UpdatePreviousPaperServerDTO {
  title?: string;
  paperCode?: string;
  year?: number;
  session?: string;
  duration?: number;
  totalMarks?: number;
  difficulty?: string;
  paperUrl?: string;
  markingSchemeUrl?: string;
  solutionUrl?: string;
  additionalResourcesUrls?: string[];
  description?: {
    en?: string;
    hi?: string;
  };
  keywords?: string[];
  tags?: string[];
  isPremium?: boolean;
  accessLevel?: string;
  visibility?: string;
  status?: string;
  priority?: number;
  displayOrder?: number;
  isVerified?: boolean;
  verifiedBy?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  relatedPaperIds?: string[];
}

/**
 * API Response DTO (paginated list)
 */
export interface PreviousPapersListResponseDTO {
  data: PreviousPaperServerDTO[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Stats DTO for dashboard
 */
export interface PreviousPapersStatsDTO {
  totalPapers: number;
  totalDownloads: number;
  activeYears: number;
  papersByYear: {
    year: number;
    count: number;
  }[];
  recentPapers: PreviousPaperServerDTO[];
}
