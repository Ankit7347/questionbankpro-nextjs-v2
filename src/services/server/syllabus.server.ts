// src/services/server/syllabus.server.ts

/**
 * Dashboard → Syllabus Service
 * ===========================
 *
 * Responsibility:
 * - Resolve academic syllabus structure for logged-in user
 *
 * Resolution chain:
 * session.user.subExamId
 *   → OfficialSyllabus
 *     → SubjectMap
 *       → Subject
 *
 * Returns:
 * - SyllabusSubjectDTO[]
 */

import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"

import { BadRequest, NotFound } from "@/lib/apiError"

import OfficialSyllabus from "@/models/mongoose/OfficialSyllabus.schema"
import SubjectMap from "@/models/mongoose/SubjectMap.schema"
import Subject from "@/models/mongoose/Subject.schema"
import ChapterMap from "@/models/mongoose/ChapterMap.schema"

import { SyllabusSubjectDTO } from "@/models/dto/syllabusSubject.dto"
import { mapToSyllabusSubjectDTO } from "@/models/dto/syllabusSubject.mapper"

export async function getDashboardSyllabus(): Promise<
  SyllabusSubjectDTO[]
> {
  await dbConnect()
  const session = await auth()

  const subExamId = session?.user?.subExamId
  if (!subExamId) {
    throw BadRequest("Invalid session: subExamId missing")
  }

  /* --------------------------------
     Resolve Official Syllabus
  --------------------------------- */
  const syllabus = await OfficialSyllabus.findOne({
    subExamId,
    isActive: true,
    isDeleted: false,
  }).lean()

  if (!syllabus) {
    throw NotFound("Official syllabus not found")
  }

  /* --------------------------------
     Resolve Syllabus → Subject Map
  --------------------------------- */
  const maps = await SubjectMap.find({
    syllabusId: syllabus._id,
    isDeleted: false,
  })
    .sort({ order: 1 })
    .lean()

  if (!maps.length) {
    return []
  }

  /* --------------------------------
     Fetch Subjects
  --------------------------------- */
  const subjectIds = maps.map(m => m.subjectId)

  const subjects = await Subject.find({
    _id: { $in: subjectIds },
    isDeleted: false,
  }).lean()

  const subjectById = new Map(
    subjects.map(s => [s._id.toString(), s])
  )
  /* --------------------------------
   Resolve Chapter counts per subject
--------------------------------- */
  const chapterCounts = await ChapterMap.aggregate([
    {
      $match: {
        subjectMapId: { $in: maps.map(m => m._id) },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$subjectMapId",
        count: { $sum: 1 },
      },
    },
  ])

  const chapterCountMap = new Map(
    chapterCounts.map(c => [c._id.toString(), c.count])
  )


  /* --------------------------------
     Map → SyllabusSubjectDTO
     (intentionally skips broken mappings)
  --------------------------------- */
  const result: SyllabusSubjectDTO[] = []

  for (const map of maps) {
    const subject = subjectById.get(map.subjectId.toString())
    if (!subject) continue

    result.push(
      mapToSyllabusSubjectDTO(
        subject,
        chapterCountMap.get(map._id.toString()) ?? 0
      )
    )

  }

  return result
}
