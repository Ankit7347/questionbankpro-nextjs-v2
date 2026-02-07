/**
 * Dashboard → Syllabus → Subjects
 * Server-side DTO (domain-owned)
 */
export interface SyllabusSubjectDTO {
  id: string
  title: string
  slug: string
  chaptersCount: number
}
