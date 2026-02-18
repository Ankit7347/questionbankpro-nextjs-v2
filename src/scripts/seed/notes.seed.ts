/**
 * Seed notes for GATE 2026 CS & IT
 * Admin-created notes linked to topics
 */

import { initSeed, closeSeed } from "./_helpers";
import Note from "../../models/mongoose/Note.schema";
import SubExam from "../../models/mongoose/SubExam.schema";
import Subject from "../../models/mongoose/Subject.schema";
import Chapter from "../../models/mongoose/Chapter.schema";
import Topic from "../../models/mongoose/Topic.schema";

const EXAM_SLUG = "gate-2026-cs-it";

interface NoteData {
  subjectSlug: string;
  chapterSlug: string;
  topicSlug: string;
  title: string;
  description: string;
  content: string;
  isPinned?: boolean;
}

const notesData: NoteData[] = [
  // Operating Systems - Processes
  {
    subjectSlug: "operating-systems",
    chapterSlug: "processes",
    topicSlug: "process-states",
    title: "Process States Explained",
    description: "Comprehensive guide to process states in OS",
    content: `
# Process States

## Overview
A process can exist in several states during its lifetime.

### States
1. **New**: Process is being created
2. **Ready**: Process is ready to run
3. **Running**: Process is currently executing
4. **Blocked**: Process is waiting for I/O
5. **Terminated**: Process has finished

## State Transitions
- New → Ready (admitted)
- Ready → Running (scheduled)
- Running → Blocked (I/O request)
- Blocked → Ready (I/O complete)
- Running → Terminated (exit)
    `,
    isPinned: true,
  },
  {
    subjectSlug: "operating-systems",
    chapterSlug: "processes",
    topicSlug: "process-control-block",
    title: "PCB Structure and Usage",
    description: "Understanding Process Control Block",
    content: `
# Process Control Block (PCB)

## Definition
PCB is a data structure for each process in the OS.

## Contents
- Process ID (PID)
- Program Counter (PC)
- CPU Registers
- Memory Limits
- Process State
- Priority

## Purpose
Stores all information about a process needed for context switching.
    `,
  },
  {
    subjectSlug: "operating-systems",
    chapterSlug: "cpu-scheduling",
    topicSlug: "fcfs",
    title: "First Come First Serve Scheduling",
    description: "FCFS algorithm tutorial",
    content: `
# FCFS Scheduling

## Algorithm
Processes are executed in the order they arrive.

## Characteristics
- Non-preemptive
- Fair allocation
- Simple to implement
- Poor average wait time

## Example
P1(24) → P2(3) → P3(3)
Average Wait Time = (0 + 24 + 27) / 3 = 17
    `,
  },
  // DBMS Topics
  {
    subjectSlug: "dbms",
    chapterSlug: "relational-model",
    topicSlug: "keys",
    title: "Database Keys Types",
    description: "Understanding primary, foreign, and candidate keys",
    content: `
# Database Keys

## Types of Keys

### Primary Key
- Uniquely identifies a record
- Cannot be NULL
- One per relation

### Foreign Key
- Links two relations
- References primary key in another table

### Candidate Key
- Could be a primary key
- Multiple per relation

### Unique Key
- Ensures uniqueness
- Can be NULL (except Primary Key)
    `,
    isPinned: true,
  },
  {
    subjectSlug: "dbms",
    chapterSlug: "normalization",
    topicSlug: "1nf",
    title: "First Normal Form (1NF)",
    description: "Understanding 1NF requirements",
    content: `
# First Normal Form (1NF)

## Definition
A relation is in 1NF if all attributes contain atomic (indivisible) values.

## Requirements
- No repeating groups
- All attributes must be atomic
- All records must have the same number of fields

## Example
NOT 1NF: A phone table with multiple phone numbers in one field
1NF: Each phone number in a separate row
    `,
  },
];

export async function seedNotes() {
  console.log("🚀 Seeding notes for GATE 2026 CS & IT");

  await initSeed();

  const subExam = await SubExam.findOne({
    slug: EXAM_SLUG,
    isActive: true,
    isDeleted: false,
  });

  if (!subExam) throw new Error(`SubExam not found: ${EXAM_SLUG}`);

  let notesCreated = 0;

  for (const noteData of notesData) {
    const subject = await Subject.findOne({
      slug: noteData.subjectSlug,
      isDeleted: false,
    });

    if (!subject) {
      console.warn(`Subject not found: ${noteData.subjectSlug}`);
      continue;
    }

    const chapter = await Chapter.findOne({
      slug: noteData.chapterSlug,
      isDeleted: false,
    });

    if (!chapter) {
      console.warn(`Chapter not found: ${noteData.chapterSlug}`);
      continue;
    }

    const topic = await Topic.findOne({
      slug: noteData.topicSlug,
      isDeleted: false,
    });

    if (!topic) {
      console.warn(`Topic not found: ${noteData.topicSlug}`);
      continue;
    }

    // Create or update note
    const note = await Note.findOneAndUpdate(
      {
        subExamId: subExam._id,
        subjectId: subject._id,
        chapterId: chapter._id,
        topicId: topic._id,
        title: noteData.title,
      },
      {
        subExamId: subExam._id,
        subjectId: subject._id,
        chapterId: chapter._id,
        topicId: topic._id,
        title: noteData.title,
        description: noteData.description,
        content: noteData.content,
        isPinned: noteData.isPinned || false,
        isPublic: true,
        isDeleted: false,
        tags: [noteData.subjectSlug, noteData.chapterSlug, noteData.topicSlug],
      },
      { upsert: true, new: true }
    );

    notesCreated++;
    console.log(`✓ Created note: ${noteData.title}`);
  }

  await closeSeed();
  console.log(`🏁 Notes seed completed - ${notesCreated} notes created`);
}

seedNotes().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
