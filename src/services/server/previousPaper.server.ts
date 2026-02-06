// src/services/server/previousPaper.server.ts
/**
 * Previous Papers Server Service
 * Business logic layer using Mongoose models and server DTOs
 * Never returns raw mongo documents, always maps to server DTO
 */

import PreviousPaper from '@/models/mongoose/PreviousPaper.schema';
import {
  PreviousPaperServerDTO,
  CreatePreviousPaperServerDTO,
  UpdatePreviousPaperServerDTO,
  PreviousPapersListResponseDTO,
  PreviousPapersStatsDTO,
} from '@/models/dto/previousPaper.dto';
import { mapPreviousPaperToServerDTO, mapPreviousPapersToServerDTOs } from '@/models/dto/previousPaper.mapper';
import { ApiError } from '@/lib/apiError';
import dbConnect from '@/lib/mongodb';

/**
 * Get all previous papers (paginated)
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
): Promise<PreviousPapersListResponseDTO> {
  try {
    const query: any = {
      status: 'PUBLISHED',
      isDeleted: false,
    };

    if (filters?.year) query.year = filters.year;
    if (filters?.examId) query.examId = filters.examId;
    if (filters?.subjectId) query.subjectId = filters.subjectId;
    if (filters?.difficulty) query.difficulty = filters.difficulty;

    const total = await PreviousPaper.countDocuments(query);
    const skip = (page - 1) * limit;

    const papers = await PreviousPaper.find(query)
      .sort({ year: -1, session: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    return {
      data: mapPreviousPapersToServerDTOs(papers),
      total,
      page,
      pageSize: limit,
      hasMore: skip + limit < total,
    };
  } catch (error: any) {
    throw new ApiError('Failed to fetch previous papers: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Get single previous paper by ID
 */
export async function getPreviousPaperById(id: string): Promise<PreviousPaperServerDTO> {
  try {
    await dbConnect();
    const paper = await PreviousPaper.findById(id)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    if (!paper || paper.isDeleted) {
      throw new ApiError('Previous paper not found', 404);
    }

    return mapPreviousPaperToServerDTO(paper);
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to fetch paper: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Get papers by year
 */
export async function getPreviousPapersByYear(year: number): Promise<PreviousPaperServerDTO[]> {
  try {
    const papers = await PreviousPaper.find({
      year,
      status: 'PUBLISHED',
      isDeleted: false,
    })
      .sort({ session: 1, createdAt: -1 })
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    return mapPreviousPapersToServerDTOs(papers);
  } catch (error: any) {
    throw new ApiError('Failed to fetch papers by year: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Get recently added papers
 */
export async function getRecentPreviousPapers(limit: number = 10): Promise<PreviousPaperServerDTO[]> {
  try {
    await dbConnect();
    const papers = await PreviousPaper.find({
      status: 'PUBLISHED',
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    return mapPreviousPapersToServerDTOs(papers);
  } catch (error: any) {
    throw new ApiError('Failed to fetch recent papers: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Get dashboard stats
 */
export async function getPreviousPapersStats(): Promise<PreviousPapersStatsDTO> {
  try {
    const totalPapers = await PreviousPaper.countDocuments({
      status: 'PUBLISHED',
      isDeleted: false,
    });

    const totalDownloads = await PreviousPaper.aggregate([
      {
        $match: {
          status: 'PUBLISHED',
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$downloads' },
        },
      },
    ]);

    const papersByYear = await PreviousPaper.aggregate([
      {
        $match: {
          status: 'PUBLISHED',
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    const recentPapers = await PreviousPaper.find({
      status: 'PUBLISHED',
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    return {
      totalPapers,
      totalDownloads: totalDownloads[0]?.total || 0,
      activeYears: papersByYear.length,
      papersByYear: papersByYear.map((item: any) => ({
        year: item._id,
        count: item.count,
      })),
      recentPapers: mapPreviousPapersToServerDTOs(recentPapers),
    };
  } catch (error: any) {
    throw new ApiError('Failed to fetch stats: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Create new previous paper (admin only)
 */
export async function createPreviousPaper(
  data: CreatePreviousPaperServerDTO,
  userId: string
): Promise<PreviousPaperServerDTO> {
  try {
    // Generate slug
    const slug = data.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    // Check for duplicate
    const existing = await PreviousPaper.findOne({ slug });
    if (existing) {
      throw new ApiError('Paper with this title already exists', 409);
    }

    const paper = new PreviousPaper({
      ...data,
      slug,
      createdBy: userId,
      status: 'DRAFT',
      searchText: `${data.title} ${data.paperCode} ${data.keywords?.join(' ') || ''}`,
    });

    await paper.save();

    const populated = await PreviousPaper.findById(paper._id)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    return mapPreviousPaperToServerDTO(populated);
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to create paper: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Update previous paper (admin only)
 */
export async function updatePreviousPaper(
  id: string,
  data: UpdatePreviousPaperServerDTO,
  userId: string
): Promise<PreviousPaperServerDTO> {
  try {
    const paper = await PreviousPaper.findById(id);
    if (!paper) {
      throw new ApiError('Paper not found', 404);
    }

    Object.assign(paper, data);
    paper.updatedBy = userId;

    await paper.save();

    const updated = await PreviousPaper.findById(id)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    return mapPreviousPaperToServerDTO(updated);
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to update paper: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Delete previous paper (soft delete)
 */
export async function deletePreviousPaper(id: string, userId: string): Promise<void> {
  try {
    const result = await PreviousPaper.findByIdAndUpdate(
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
export async function trackPreviousPaperView(id: string): Promise<void> {
  try {
    await PreviousPaper.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
  } catch (error: any) {
    throw new ApiError('Failed to track view: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Track download
 */
export async function trackPreviousPaperDownload(id: string): Promise<void> {
  try {
    await PreviousPaper.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
  } catch (error: any) {
    throw new ApiError('Failed to track download: ' + (error.message || 'Unknown error'), 500);
  }
}

/**
 * Search papers (full-text search)
 */
export async function searchPreviousPapers(
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<PreviousPapersListResponseDTO> {
  try {
    const searchQuery = {
      $text: { $search: query },
      status: 'PUBLISHED',
      isDeleted: false,
    };

    const total = await PreviousPaper.countDocuments(searchQuery);
    const skip = (page - 1) * limit;

    const papers = await PreviousPaper.find(searchQuery)
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .populate('examId', 'name slug')
      .populate('subjectId', 'name')
      .lean();

    return {
      data: mapPreviousPapersToServerDTOs(papers),
      total,
      page,
      pageSize: limit,
      hasMore: skip + limit < total,
    };
  } catch (error: any) {
    throw new ApiError('Failed to search papers: ' + (error.message || 'Unknown error'), 500);
  }
}
