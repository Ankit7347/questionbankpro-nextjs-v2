# Subject Folder (Syllabus)

Authored by: Architect Pro

This folder contains UI for a single subject inside an exam. Files:

- `page.tsx` — Subject Syllabus page with progress tracking, list of chapters, and badges (High Yield / Prerequisite).
- API: `src/app/api/dashboard/syllabus/[examId]/[subjectId]/route.ts` — returns chapter list and progress merged from user data.

Design notes:
- Show progress as a small progress bar and provide clear call-to-actions to open a chapter.
- Use badges and subtle color accents for high-value topics.
