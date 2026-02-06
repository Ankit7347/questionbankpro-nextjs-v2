// src/models/dto/solvedPaper.dto.ts
/**
 * Server DTOs for Solved Papers
 * Only used internally between server layers
 * Never exposed to client/UI directly
 */

/**
 * Solution step sub-document
 */
export interface SolutionStepServerDTO {
  stepNumber: number;
  description: string;
  formula?: string;
  explanation?: string;
  imageUrl?: string;
}

/**
 * Main solved paper DTO from Mongoose
 */
export interface SolvedPaperServerDTO {
  id: string;
  title: string;
  paperCode: string;
  year: number;
  session: 'WINTER' | 'SUMMER' | 'ANNUAL';
  slug: string;
  examId: string;
  subjectId: string;
  totalMarks: number;
  solutions: SolutionStepServerDTO[];
  solutionFileUrl?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  
  // Analytics
  viewCount: number;
  downloadCount: number;
  
  // Quality indicators
  isVerified: boolean;
  rating?: number;
  ratingCount?: number;
  
  // Metadata
  submittedBy?: string;
  verifiedBy?: string;
  keywords?: string[];
  description?: string;
  tags?: string[];
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Access control
  isPublic: boolean;
  isDeleted: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

/**
 * Create solved paper DTO
 */
export interface CreateSolvedPaperServerDTO {
  title: string;
  paperCode: string;
  year: number;
  session: 'WINTER' | 'SUMMER' | 'ANNUAL';
  examId: string;
  subjectId: string;
  totalMarks: number;
  solutions: SolutionStepServerDTO[];
  solutionFileUrl?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  keywords?: string[];
  description?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Update solved paper DTO
 */
export interface UpdateSolvedPaperServerDTO {
  title?: string;
  paperCode?: string;
  year?: number;
  session?: 'WINTER' | 'SUMMER' | 'ANNUAL';
  examId?: string;
  subjectId?: string;
  totalMarks?: number;
  solutions?: SolutionStepServerDTO[];
  solutionFileUrl?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  rating?: number;
  keywords?: string[];
  description?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Response DTOs
 */
export interface SolvedPapersListResponseDTO {
  data: SolvedPaperServerDTO[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SolvedPapersStatsDTO {
  totalPapers: number;
  totalDownloads: number;
  activeYears: number;
  papersByYear: {
    year: number;
    count: number;
  }[];
  recentPapers: SolvedPaperServerDTO[];
}
