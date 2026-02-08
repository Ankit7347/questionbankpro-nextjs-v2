// src/models/dto/syllabus.mapper.ts

import { SyllabusDTO } from "./syllabus.dto";

type Lang = "en" | "hi";

function resolveText(
  text: { en: string; hi?: string } | string,
  lang: Lang
): string {
  if (typeof text === "string") return text;
  if (!text) return "Untitled";
  return text[lang] ?? text.en;
}

/**
 * Syllabus-domain → SyllabusDTO (UI)
 * Now handles a multi-subject structure
 */
export function mapSyllabusDTO(
  data: any,
  lang: Lang
): SyllabusDTO {
  return {
    exam: {
      title: resolveText(data.exam?.title ?? "Unknown Exam", lang),
    },

    subExam: {
      title: resolveText(data.subExam?.title ?? "Unknown Sub-Exam", lang),
    },

    // Map through the array of subjects returned by the aggregation
    subjects: (data.subjects ?? []).map((subject: any) => ({
      title: resolveText(subject.title, lang),
      slug: subject.slug,
      chapters: (subject.chapters ?? []).map((chapter: any) => ({
        id: chapter.id?.toString(), // Ensure it's a string
        title: resolveText(chapter.title, lang),
        slug: chapter.slug,
        topics: (chapter.topics ?? []).map((topic: any) => ({
          id: topic.id?.toString(),
          title: resolveText(topic.title, lang),
          url: topic.url ?? "",
        })),
      })),
    })),
  };
}