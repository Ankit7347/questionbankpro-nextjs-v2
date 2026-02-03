# Chapter Folder (Syllabus)

Authored by: Architect Pro

This folder contains the most granular UI for a chapter. Files:

- `page.tsx` — Chapter Detail with checklist mode, resource shortcuts (Notes, Quiz), revision counter and a cheat sheet.
- API: `src/app/api/dashboard/syllabus/[examId]/[subjectId]/[chapterId]/route.ts` — serves topics, resources, and handles small write operations (toggle topic status, increment revision).

Development notes:
- Keep interactive logic client-side; server routes should perform permission checks and data merge.
- Ensure accessibility and touch-size targets (48px minimum on actionable buttons).
