# Exam Folder (Syllabus)

Authored by: Architect Pro

This folder contains the UI and metadata for a single exam (e.g., `JEE`, `NEET`). Files:

- `page.tsx` — Exam Overview UI with subject distribution, metadata and download link.
- API: `src/app/api/dashboard/syllabus/[examId]/route.ts` — returns aggregated exam data and merges user progress.

Notes:
- Keep data retrieval on the server component (for SEO & performance) and use client components for interactive bits.
- Design: Mobile-first, dark theme, glassmorphic sidebar for metadata.
