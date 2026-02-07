import { SyllabusSubjectDTO } from "./syllabusSubject.dto"

type Lang = "en" | "hi";

/**
 * Resolves multilingual text (consistent with course.mapper.ts)
 */
function resolveText(
  text: { en: string; hi?: string },
  lang: Lang
): string {
  return text?.[lang] ?? text?.en ?? "";
}

/**
 * Maps Subject + chapter count → SyllabusSubjectDTO
 * FIXED: now uses language-specific title
 */
export function mapToSyllabusSubjectDTO(
  subject: any,
  chaptersCount: number,
  lang: Lang = "en"
): SyllabusSubjectDTO {
  return {
    id: subject._id.toString(),
    title: resolveText(subject.name, lang),  // FIXED ✔
    slug: subject.slug,
    chaptersCount,
  };
}
