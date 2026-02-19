// src/services/server/notes.server.ts
/**
 * Notes Server Service
 * ===================
 * Handles:
 * - User note overview (based on UserNoteActivity)
 * - Subject/Chapter/Topic notes
 * - Note activity tracking and management
 *
 * Pattern:
 * - Notes are admin-created (global)
 * - UserNoteActivity tracks per-user interaction
 */

import dbConnect from "@/lib/mongodb";
import Note from "@/models/mongoose/Note.schema";
import User from "@/models/mongoose/User.schema";
import Subject from "@/models/mongoose/Subject.schema";
import Chapter from "@/models/mongoose/Chapter.schema";
import Topic from "@/models/mongoose/Topic.schema";
import UserNoteActivity from "@/models/mongoose/UserNoteActivity.schema";
import { mapNoteToDTO } from "@/models/dto/note.mapper";
import { mapSubject } from "@/models/dto/subject.mapper";
import { mapChapter } from "@/models/dto/chapter.mapper";
import { mapTopic } from "@/models/dto/topic.mapper";
import { getCurrentLang } from "@/lib/i18n";
import { NotFound } from "@/lib/apiError";
import { Types } from "mongoose";

/**
 * Get user MongoDB ID from session UUID
 */
async function getUserIdFromSession(userUuid: string) {
  await dbConnect();
  const user = await User.findOne({ uuid: userUuid }).select("_id").lean();
  if (!user) {
    throw NotFound("User not found");
  }
  return user._id;
}

/**
 * Get notes overview for a user
 * =============================
 * Returns subjects the user has interacted with, stats, and recent note
 */
export async function getNotesOverview(userUuidFromSession: string) {
  await dbConnect();
  const lang = getCurrentLang();
  const userId = await getUserIdFromSession(userUuidFromSession);

  // Get user's note activities with populated note data
  const userActivities = await UserNoteActivity.aggregate([
    { $match: { userId } },
    {
      $lookup: {
        from: "notes",
        localField: "noteId",
        foreignField: "_id",
        as: "note",
      },
    },
    { $unwind: "$note" },
    {
      $match: { 
        "note.isDeleted": false,
      },
    },
    {
      $group: {
        _id: "$note.subjectId",
        totalNotes: { $sum: 1 },
        lastActive: { $max: "$lastActive" },
      },
    },
    { $sort: { lastActive: -1 } },
  ]);

  // Fetch subject details
  const subjectIds = userActivities.map((a) => new Types.ObjectId(a._id));
  const subjects = await Subject.find({
    _id: { $in: subjectIds },
    isDeleted: false,
  }).lean();

  // Calculate progress (notes interacted / total threshold)
  const subjectsWithProgress = userActivities.map((activity) => {
    const subjectDoc = subjects.find(
      (s) => s._id.toString() === activity._id.toString()
    );
    // Progress: (totalNotes / 50) * 100, capped at 100
    const progress = Math.min((activity.totalNotes / 50) * 100, 100);
    const subjectDTO = subjectDoc ? mapSubject(subjectDoc, lang) : null;

    return {
      id: activity._id.toString(),
      name: subjectDTO?.name || "Unknown",
      totalNotes: activity.totalNotes,
      progress: Math.round(progress),
    };
  });

  // Get most recent activity for "Continue Learning"
  const recentActivity = await UserNoteActivity.findOne({ userId })
    .sort({ lastActive: -1 })
    .populate({
      path: "noteId",
      select: "title subjectId chapterId topicId",
      populate: [
        { path: "subjectId", select: "name isDeleted" },
        { path: "chapterId", select: "name isDeleted" },
        { path: "topicId", select: "name isDeleted" },
      ],
    })
    .lean();

  const stats = {
    totalNotes: userActivities.reduce((sum, a) => sum + a.totalNotes, 0),
    totalSubjects: subjectsWithProgress.length,
  };

  let recentNoteData = undefined;
  if (recentActivity?.noteId) {
    const topicDTO = recentActivity.noteId.topicId ? mapTopic(recentActivity.noteId.topicId, lang) : null;
    const chapterDTO = recentActivity.noteId.chapterId ? mapChapter(recentActivity.noteId.chapterId, lang) : null;
    const subjectDTO = recentActivity.noteId.subjectId ? mapSubject(recentActivity.noteId.subjectId, lang) : null;

    recentNoteData = {
      topicId: topicDTO?.id || "",
      topicName: topicDTO?.name || "No Topic",
      chapterName: chapterDTO?.name || "No Chapter",
      subjectName: subjectDTO?.name || "Unknown",
      progress: Math.min((recentActivity.readCount / 10) * 100, 100),
      lastAccessed: getTimeAgo(recentActivity.lastActive),
    };
  }

  return {
    subjects: subjectsWithProgress,
    stats,
    recentNote: recentNoteData,
  };
}

/**
 * Get notes by subject for a user
 * ===============================
 */
export async function getNotesBySubject(
  userUuidFromSession: string,
  subjectId: string
) {
  await dbConnect();
  const lang = getCurrentLang();
  const userId = await getUserIdFromSession(userUuidFromSession);

  // Verify subject exists
  const subject = await Subject.findOne({
    _id: subjectId,
    isDeleted: false,
  }).lean();

  if (!subject) {
    throw NotFound("Subject not found");
  }

  // Get chapters in this subject that have notes
  const chaptersWithNotes = await UserNoteActivity.aggregate([
    { $match: { userId } },
    {
      $lookup: {
        from: "notes",
        localField: "noteId",
        foreignField: "_id",
        as: "note",
      },
    },
    { $unwind: "$note" },
    {
      $match: {
        "note.subjectId": new Types.ObjectId(subjectId),
        "note.isDeleted": false,
      },
    },
    {
      $group: {
        _id: "$note.chapterId",
        totalNotes: { $sum: 1 },
      },
    },
  ]);

  // Get chapter details
  const chapterIds = chaptersWithNotes.map((c) =>
    c._id ? new Types.ObjectId(c._id) : null
  ).filter(Boolean);

  const chapters = await Chapter.find({
    _id: { $in: chapterIds },
    isDeleted: false,
  }).lean();

  const chaptersWithProgress = chaptersWithNotes.map((chapterData) => {
    const chapter = chapters.find(
      (c) => c._id.toString() === chapterData._id?.toString()
    );
    const progress = Math.min((chapterData.totalNotes / 30) * 100, 100);
    const chapterDTO = chapter ? mapChapter(chapter, lang) : null;

    return {
      id: chapterData._id?.toString() || "",
      title: chapterDTO?.name || "Unknown",
      description: chapterDTO?.description || "",
      totalNotes: chapterData.totalNotes,
      totalTopics: 0,
      completedTopics: chapterData.totalNotes,
      progress: Math.round(progress),
    };
  });

  const totalNotes = chaptersWithNotes.reduce(
    (sum, c) => sum + c.totalNotes,
    0
  );

  const subjectDTO = mapSubject(subject, lang);

  return {
    subject: {
      id: subjectDTO.id,
      name: subjectDTO.name,
    },
    chapters: chaptersWithProgress,
    stats: {
      totalNotes,
      totalChapters: chaptersWithProgress.length,
    },
  };
}

/**
 * Get notes by chapter for a user
 * ===============================
 */
export async function getNotesByChapter(
  userUuidFromSession: string,
  subjectId: string,
  chapterId: string
) {
  await dbConnect();
  const lang = getCurrentLang();
  const userId = await getUserIdFromSession(userUuidFromSession);

  const chapter = await Chapter.findOne({
    _id: chapterId,
    isDeleted: false,
  }).lean();

  if (!chapter) {
    throw NotFound("Chapter not found");
  }

  // Get user's activities for notes in this chapter
  const notesInChapter = await UserNoteActivity.aggregate([
    { $match: { userId } },
    {
      $lookup: {
        from: "notes",
        localField: "noteId",
        foreignField: "_id",
        as: "note",
      },
    },
    { $unwind: "$note" },
    {
      $match: {
        "note.chapterId": new Types.ObjectId(chapterId),
        "note.subjectId": new Types.ObjectId(subjectId),
        "note.isDeleted": false,
      },
    },
    {
      $group: {
        _id: "$note.topicId",
        totalNotes: { $sum: 1 },
        lastActive: { $max: "$lastActive" },
      },
    },
  ]);

  // Fetch topic details
  const topicIds = notesInChapter.map((n) =>
    n._id ? new Types.ObjectId(n._id) : null
  ).filter(Boolean);

  const topics = await Topic.find({
    _id: { $in: topicIds },
    isDeleted: false,
  }).lean();

  const topicsWithNotes = notesInChapter.map((topicData) => {
    const topic = topics.find(
      (t) => t._id.toString() === topicData._id?.toString()
    );
    const topicDTO = topic ? mapTopic(topic, lang) : null;

    return {
      id: topicData._id?.toString() || "",
      title: topicDTO?.name || "Unknown",
      notesCount: topicData.totalNotes,
      progress: topicData.totalNotes > 0 ? 100 : 0,
      lastNoteTime: topicData.lastActive
        ? getTimeAgo(topicData.lastActive)
        : undefined,
    };
  });

  const chapterDTO = mapChapter(chapter, lang);

  return {
    chapter: {
      id: chapterDTO.id,
      title: chapterDTO.name,
    },
    topics: topicsWithNotes,
    stats: {
      totalNotes: notesInChapter.reduce((sum, n) => sum + n.totalNotes, 0),
      totalTopics: topicsWithNotes.length,
    },
  };
}

/**
 * Get notes for a specific topic
 * ==============================
 */
export async function getNotesByTopic(
  userUuidFromSession: string,
  subjectId: string,
  chapterId: string,
  topicId: string
) {
  await dbConnect();
  const userId = await getUserIdFromSession(userUuidFromSession);

  // Get notes for this topic
  const notes = await Note.find({
    subjectId: new Types.ObjectId(subjectId),
    chapterId: new Types.ObjectId(chapterId),
    topicId: new Types.ObjectId(topicId),
    isDeleted: false,
  })
    .sort({ isPinned: -1, createdAt: -1 })
    .lean();

  if (notes.length === 0) {
    return { notes: [], stats: { totalNotes: 0 } };
  }

  // Get user activities for these notes to include user interactions
  const noteIds = notes.map((n) => n._id);
  const activities = await UserNoteActivity.find({
    userId,
    noteId: { $in: noteIds },
  }).lean();

  const activitiesMap = new Map(
    activities.map((a) => [a.noteId.toString(), a])
  );

  return {
    notes: notes.map((note) => {
      const activity = activitiesMap.get(note._id.toString());
      return {
        ...mapNoteToDTO(note),
        userActivity: activity
          ? {
              timeSpent: activity.timeSpent,
              readCount: activity.readCount,
              isBookmarked: activity.isBookmarked,
              lastActive: activity.lastActive,
            }
          : null,
      };
    }),
    stats: {
      totalNotes: notes.length,
    },
  };
}

/**
 * Get or create user note activity
 * ================================
 */
async function getOrCreateUserNoteActivity(
  userId: Types.ObjectId,
  noteId: Types.ObjectId
) {
  let activity = await UserNoteActivity.findOne({
    userId,
    noteId,
  });

  if (!activity) {
    activity = await UserNoteActivity.create({
      userId,
      noteId,
      readCount: 0,
      timeSpent: 0,
    });
  }

  return activity;
}

/**
 * Track note access (called when user opens/reads a note)
 * =======================================================
 */
export async function trackNoteAccess(
  userUuidFromSession: string,
  noteId: string
) {
  await dbConnect();
  const userId = await getUserIdFromSession(userUuidFromSession);

  // Verify note exists
  const note = await Note.findOne({
    _id: noteId,
    isDeleted: false,
  }).lean();

  if (!note) {
    throw NotFound("Note not found");
  }

  // Get or create activity
  const activity = await getOrCreateUserNoteActivity(
    userId,
    new Types.ObjectId(noteId)
  );

  // Update activity
  await UserNoteActivity.updateOne(
    { _id: activity._id },
    {
      $set: { lastActive: new Date() },
      $inc: { readCount: 1 },
    }
  );

  return { success: true };
}

/**
 * Update note time spent
 * ======================
 */
export async function updateNoteTimeSpent(
  userUuidFromSession: string,
  noteId: string,
  timeSpentInSeconds: number
) {
  await dbConnect();
  const userId = await getUserIdFromSession(userUuidFromSession);

  const activity = await getOrCreateUserNoteActivity(
    userId,
    new Types.ObjectId(noteId)
  );

  await UserNoteActivity.updateOne(
    { _id: activity._id },
    {
      $set: { lastActive: new Date() },
      $inc: { timeSpent: timeSpentInSeconds },
    }
  );

  return { success: true };
}

/**
 * Create a note (Admin only)
 * ==========================
 */
export async function createNote(payload: any) {
  await dbConnect();

  const note = await Note.create({
    ...payload,
    views: 0,
  });

  return mapNoteToDTO(note.toObject());
}

/**
 * Update a note (Admin only)
 * ==========================
 */
export async function updateNote(noteId: string, payload: any) {
  await dbConnect();

  const note = await Note.findOneAndUpdate(
    { _id: noteId, isDeleted: false },
    { ...payload },
    { new: true }
  ).lean();

  if (!note) {
    throw NotFound("Note not found");
  }

  return mapNoteToDTO(note);
}

/**
 * Delete a note (Admin only) - soft delete
 * ========================================
 */
export async function deleteNote(noteId: string) {
  await dbConnect();

  const note = await Note.findOneAndUpdate(
    { _id: noteId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  ).lean();

  if (!note) {
    throw NotFound("Note not found");
  }

  return { success: true };
}

/**
 * Helper: Get time ago string
 * ===========================
 */
function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const minutes = Math.floor((now.getTime() - then.getTime()) / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}
