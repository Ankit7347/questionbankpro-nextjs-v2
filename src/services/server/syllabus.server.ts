// src/services/server/syllabus.server.ts
/**
 * Dashboard → Syllabus Service
 * ===========================
 *
 * Responsibility:
 * - Resolve FULL syllabus structure for logged-in user
 *
 * Returns:
 * - SyllabusDTO
 */

import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"
import { BadRequest, NotFound } from "@/lib/apiError"
import "@/models/mongoose/Exam.schema"
import SubExam from "@/models/mongoose/SubExam.schema"
import "@/models/mongoose/OfficialSyllabus.schema"
import "@/models/mongoose/SubjectMap.schema"
import "@/models/mongoose/Subject.schema"
import "@/models/mongoose/ChapterMap.schema"
import "@/models/mongoose/Chapter.schema"
import "@/models/mongoose/TopicMap.schema"
import "@/models/mongoose/Topic.schema"
import { mapSyllabusDTO } from "@/models/dto/syllabus.mapper"
import { getCurrentLang } from "@/lib/i18n"

export async function getDashboardSyllabus() {
  await dbConnect();
  const lang = getCurrentLang();

  const session = await auth();
  const subExamId = session?.user?.subExamId;
  if (!subExamId) throw BadRequest("Invalid session: subExamId missing");

  const subExamObjectId = new mongoose.Types.ObjectId(subExamId);

  /* --------------------------------
     Single Aggregation Pipeline
  --------------------------------- */
  const results = await SubExam.aggregate([
    // 1. Get SubExam & Join Exam info
    { $match: { _id: subExamObjectId, isDeleted: false } },
    {
      $lookup: {
        from: "exams",
        localField: "examId",
        foreignField: "_id",
        as: "exam"
      }
    },
    { $unwind: "$exam" },

    // 2. Join Official Syllabus
    {
      $lookup: {
        from: "officialsyllabuses",
        let: { sid: "$_id" },
        pipeline: [
          { $match: { $expr: { $and: [
            { $eq: ["$subExamId", "$$sid"] },
            { $eq: ["$isActive", true] },
            { $eq: ["$isDeleted", false] }
          ] } } }
        ],
        as: "syllabus"
      }
    },
    { $unwind: "$syllabus" },

    // 3. Join SubjectMaps -> Subjects
    {
      $lookup: {
        from: "subjectmaps",
        let: { syllabusId: "$syllabus._id" },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ["$syllabusId", "$$syllabusId"] }, { $eq: ["$isDeleted", false] }] } } },
          { $sort: { order: 1 } },
          {
            $lookup: {
              from: "subjects",
              localField: "subjectId",
              foreignField: "_id",
              as: "details"
            }
          },
          { $unwind: "$details" },
          
          // 4. Join ChapterMaps -> Chapters (Nested inside Subject)
          {
            $lookup: {
              from: "chaptermaps",
              let: { smId: "$_id" },
              pipeline: [
                { $match: { $expr: { $and: [{ $eq: ["$subjectMapId", "$$smId"] }, { $eq: ["$isDeleted", false] }] } } },
                { $sort: { order: 1 } },
                {
                  $lookup: {
                    from: "chapters",
                    localField: "chapterId",
                    foreignField: "_id",
                    as: "details"
                  }
                },
                { $unwind: "$details" },

                // 5. Join TopicMaps -> Topics (Nested inside Chapter)
                {
                  $lookup: {
                    from: "topicmaps",
                    let: { cmId: "$_id" },
                    pipeline: [
                      { $match: { $expr: { $and: [{ $eq: ["$chapterMapId", "$$cmId"] }, { $eq: ["$isDeleted", false] }] } } },
                      { $sort: { order: 1 } },
                      {
                        $lookup: {
                          from: "topics",
                          localField: "topicId",
                          foreignField: "_id",
                          as: "details"
                        }
                      },
                      { $unwind: "$details" }
                    ],
                    as: "topics"
                  }
                }
              ],
              as: "chapters"
            }
          }
        ],
        as: "subjects"
      }
    },

    // 6. Project Final Clean Structure
    {
      $project: {
        _id:0,
        examName: "$exam.name",
        examSlug: "$exam.slug",
        subExamName: "$name",
        subExamSlug: "$slug",
        subjects: {
          $map: {
            input: "$subjects",
            as: "s",
            in: {
              title: "$$s.details.name",
              slug: "$$s.details.slug",
              chapters: {
                $map: {
                  input: "$$s.chapters",
                  as: "c",
                  in: {
                    id: "$$c.details._id",
                    title: "$$c.details.name",
                    slug: "$$c.details.slug",
                    topics: {
                      $map: {
                        input: "$$c.topics",
                        as: "t",
                        in: {
                          id: "$$t.details._id",
                          title: "$$t.details.name",
                          // Generate URL directly in DB
                          url: { 
                            $concat: [
                              "/exams/", "$exam.slug", "/", "$slug", "/", 
                              "$$s.details.slug", "/", "$$c.details.slug", "/", "$$t.details.slug"
                            ] 
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  ]);

  const data = results[0];
  if (!data) throw NotFound("Syllabus structure not found");
  /* --------------------------------
     Final DTO 
  --------------------------------- */
  return mapSyllabusDTO(
    {
      exam: { title: data.examName },
      subExam: { title: data.subExamName },
      subjects: data.subjects, 
    },
    lang
  );
}