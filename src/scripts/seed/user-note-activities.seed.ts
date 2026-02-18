/**
 * Seed user note activities for GATE 2026 CS & IT
 * Creates user interactions with notes
 */

import { initSeed, closeSeed } from "./_helpers";
import User from "../../models/mongoose/User.schema";
import Note from "../../models/mongoose/Note.schema";
import UserNoteActivity from "../../models/mongoose/UserNoteActivity.schema";

interface UserActivityData {
  userEmail: string;
  noteTitle: string;
  readCount: number;
  timeSpent: number; // in seconds
  isBookmarked?: boolean;
  rating?: number;
}

const activitiesData: UserActivityData[] = [
  {
    userEmail: "qrnotes2020@gmailc.com",
    noteTitle: "Process States Explained",
    readCount: 5,
    timeSpent: 1200, // 20 minutes
    isBookmarked: true,
    rating: 5,
  },
  {
    userEmail: "qrnotes2020@gmailc.com",
    noteTitle: "PCB Structure and Usage",
    readCount: 3,
    timeSpent: 900, // 15 minutes
    isBookmarked: false,
    rating: 4,
  },
  {
    userEmail: "qrnotes2020@gmailc.com",
    noteTitle: "Database Keys Types",
    readCount: 4,
    timeSpent: 1500, // 25 minutes
    isBookmarked: true,
    rating: 5,
  },
  {
    userEmail: "student2@example.com",
    noteTitle: "FCFS Scheduling",
    readCount: 2,
    timeSpent: 600, // 10 minutes
    isBookmarked: false,
    rating: 3,
  },
  {
    userEmail: "student2@example.com",
    noteTitle: "First Normal Form (1NF)",
    readCount: 3,
    timeSpent: 800, // 13 minutes
    isBookmarked: true,
    rating: 4,
  },
  {
    userEmail: "student3@example.com",
    noteTitle: "Process States Explained",
    readCount: 2,
    timeSpent: 480, // 8 minutes
    isBookmarked: false,
    rating: 3,
  },
  {
    userEmail: "student3@example.com",
    noteTitle: "FCFS Scheduling",
    readCount: 4,
    timeSpent: 1200, // 20 minutes
    isBookmarked: true,
    rating: 4,
  },
  {
    userEmail: "student3@example.com",
    noteTitle: "Database Keys Types",
    readCount: 6,
    timeSpent: 2400, // 40 minutes
    isBookmarked: true,
    rating: 5,
  },
];

export async function seedUserNoteActivities() {
  console.log("🚀 Seeding user note activities");

  await initSeed();

  let activitiesCreated = 0;
  let activitiesFailed = 0;

  for (const actData of activitiesData) {
    try {
      // Find user
      const user = await User.findOne({
        email: actData.userEmail,
        isDeleted: false,
      });

      if (!user) {
        console.warn(`User not found: ${actData.userEmail}`);
        activitiesFailed++;
        continue;
      }

      // Find note
      const note = await Note.findOne({
        title: actData.noteTitle,
        isDeleted: false,
      });

      if (!note) {
        console.warn(`Note not found: ${actData.noteTitle}`);
        activitiesFailed++;
        continue;
      }

      // Create or update activity
      const activity = await UserNoteActivity.findOneAndUpdate(
        {
          userId: user._id,
          noteId: note._id,
        },
        {
          userId: user._id,
          noteId: note._id,
          readCount: actData.readCount,
          timeSpent: actData.timeSpent,
          isBookmarked: actData.isBookmarked || false,
          rating: actData.rating || 0,
          isRead: true,
          lastActive: new Date(),
          totalSessions: Math.ceil(actData.readCount / 2),
          isDeleted: false,
        },
        { upsert: true, new: true }
      );

      activitiesCreated++;
      console.log(
        `✓ Created activity for ${actData.userEmail} → "${actData.noteTitle}" (read: ${actData.readCount}x, time: ${actData.timeSpent}s)`
      );
    } catch (error) {
      console.error(`Error creating activity for ${actData.userEmail}:`, error);
      activitiesFailed++;
    }
  }

  await closeSeed();
  console.log(
    `🏁 User note activities seed completed - ${activitiesCreated} created, ${activitiesFailed} failed`
  );
}

seedUserNoteActivities().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
