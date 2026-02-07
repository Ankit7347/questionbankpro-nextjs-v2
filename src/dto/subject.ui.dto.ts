/**
 * UI DTO for Dashboard → Syllabus → Subjects
 * Academic-only view (NOT discovery / catalog)
 */
export interface SubjectUIDTO {
  /** Subject ID (stable, internal) */
  id: string

  /** Display name (e.g. "Data Structures & Algorithms") */
  name: string

  /** URL-safe identifier used for routing */
  slug: string

  /** Number of chapters under this subject */
  chaptersCount: number
}
