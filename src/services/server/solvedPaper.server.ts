// src/services/server/solvedPaper.server.ts
/**
 * Server Service for Solved Papers
 * Business logic layer
 * Only this layer imports Mongoose
 */

import SolvedPaper from '@/models/mongoose/SolvedPaper.schema';
import "@/models/mongoose/Exam.schema";
import "@/models/mongoose/Subject.schema";
import "@/models/mongoose/Course.schema";
import "@/models/mongoose/SubExam.schema";
import "@/models/mongoose/Chapter.schema";

import {
  SolvedPaperServerDTO,
  CreateSolvedPaperServerDTO,
  UpdateSolvedPaperServerDTO,
  SolvedPapersListResponseDTO,
  SolvedPapersStatsDTO,
} from '@/models/dto/solvedPaper.dto';
import { mapSolvedPaperToServerDTO, mapSolvedPapersToServerDTOs } from '@/models/dto/solvedPaper.mapper';
import { ApiError } from '@/lib/apiError';

/**
 * Utility: Generate URL-friendly slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

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
): Promise<SolvedPapersListResponseDTO> {
  try {
    const skip = (page - 1) * limit;

    // Build filter query
    const query: any = { isDeleted: false, status: 'PUBLISHED' };
    if (filters?.year) query.year = filters.year;
    if (filters?.examId) query.examId = filters.examId;
    if (filters?.subjectId) query.subjectId = filters.subjectId;
    if (filters?.difficulty) query.difficulty = filters.difficulty;
    if (filters?.isVerified !== undefined) query.isVerified = filters.isVerified;

    const papers: any[] = await SolvedPaper.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();
    
    const total: number = await SolvedPaper.countDocuments(query);

    return {
      data: mapSolvedPapersToServerDTOs(papers),
      total,
      page,
      pageSize: limit,
      hasMore: skip + limit < total,
    };
  } catch (error: any) {
    throw new ApiError('Failed to fetch solved papers: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Get single solved paper by ID
 */
export async function getSolvedPaperById(id: string): Promise<SolvedPaperServerDTO> {
  try {
    const paper: any = await SolvedPaper.findById(id)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    if (!paper || (paper && paper.isDeleted)) {
      throw new ApiError('Solved paper not found', 404);
    }

    return mapSolvedPaperToServerDTO(paper);
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to fetch paper: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Get solved papers by year
 */
export async function getSolvedPapersByYear(year: number): Promise<SolvedPaperServerDTO[]> {
  try {
    const papers: any[] = await SolvedPaper.find({ year, isDeleted: false, status: 'PUBLISHED' })
      .sort({ createdAt: -1 })
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    return mapSolvedPapersToServerDTOs(papers);
  } catch (error: any) {
    throw new ApiError('Failed to fetch papers by year: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Get recent solved papers
 */
export async function getRecentSolvedPapers(limit: number = 4): Promise<SolvedPaperServerDTO[]> {
  try {
    const papers: any[] = await SolvedPaper.find({ isDeleted: false, status: 'PUBLISHED' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    return mapSolvedPapersToServerDTOs(papers);
  } catch (error: any) {
    throw new ApiError('Failed to fetch recent papers: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Get dashboard stats
 */
export async function getSolvedPapersStats(): Promise<SolvedPapersStatsDTO> {
  try {
    const [totalDocs, stats, recent] = await Promise.all([
      SolvedPaper.countDocuments({ isDeleted: false, status: 'PUBLISHED' }),
      SolvedPaper.aggregate([
        { $match: { isDeleted: false, status: 'PUBLISHED' } },
        {
          $group: {
            _id: '$year',
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
      ]),
      SolvedPaper.find({ isDeleted: false, status: 'PUBLISHED' })
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('examId', 'name slug')
        .populate('subjectId', 'name')
        .lean(),
    ]);

    const totalDownloads = recent.reduce((sum: number, paper: any) => sum + (paper.downloads || 0), 0);

    return {
      totalPapers: totalDocs,
      totalDownloads,
      activeYears: stats.length,
      papersByYear: stats.map((item: any) => ({ year: item._id, count: item.count })),
      recentPapers: mapSolvedPapersToServerDTOs(recent),
    };
  } catch (error: any) {
    throw new ApiError('Failed to fetch stats: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Create solved paper (admin/uploader only)
 */
export async function createSolvedPaper(
  data: CreateSolvedPaperServerDTO,
  userId: string
): Promise<SolvedPaperServerDTO> {
  try {
    const slug = generateSlug(data.title);

    // Check for duplicate
    const existing = await SolvedPaper.findOne({ slug });
    if (existing) {
      throw new ApiError('Paper with this title already exists', 409);
    }

    const paper = new SolvedPaper({
      ...data,
      slug,
      createdBy: userId,
      status: 'DRAFT',
    });

    await paper.save();

    const populated = await SolvedPaper.findById(paper._id)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    return mapSolvedPaperToServerDTO(populated);
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to create paper: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Update solved paper (admin only)
 */
export async function updateSolvedPaper(
  id: string,
  data: UpdateSolvedPaperServerDTO,
  userId: string
): Promise<SolvedPaperServerDTO> {
  try {
    const paper = await SolvedPaper.findById(id);
    if (!paper) {
      throw new ApiError('Paper not found', 404);
    }

    Object.assign(paper, data);
    paper.updatedBy = userId;

    await paper.save();

    const updated = await SolvedPaper.findById(id)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    return mapSolvedPaperToServerDTO(updated);
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to update paper: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Delete solved paper (soft delete)
 */
export async function deleteSolvedPaper(id: string, userId: string): Promise<void> {
  try {
    const result = await SolvedPaper.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        updatedBy: userId,
      },
      { new: true }
    );

    if (!result) {
      throw new ApiError('Paper not found', 404);
    }
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to delete paper: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Track view (increment counter)
 */
export async function trackSolvedPaperView(id: string): Promise<void> {
  try {
    await SolvedPaper.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
  } catch (error: any) {
    throw new ApiError('Failed to track view: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Track download (increment counter)
 */
export async function trackSolvedPaperDownload(id: string): Promise<void> {
  try {
    await SolvedPaper.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
  } catch (error: any) {
    throw new ApiError('Failed to track download: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Search solved papers
 */
export async function searchSolvedPapers(
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<SolvedPapersListResponseDTO> {
  try {
    const skip = (page - 1) * limit;

    // Execute text search with proper model
    const papers: any[] = await SolvedPaper.find(
      { $text: { $search: query }, isDeleted: false, status: 'PUBLISHED' },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    const total = await SolvedPaper.countDocuments({
      $text: { $search: query },
      isDeleted: false,
      status: 'PUBLISHED',
    });

    return {
      data: mapSolvedPapersToServerDTOs(papers),
      total,
      page,
      pageSize: limit,
      hasMore: skip + limit < total,
    };
  } catch (error: any) {
    throw new ApiError('Failed to search papers: ' + (error.message || 'Unknown error'), 500);
  }
}
