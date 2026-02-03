# Syllabus Module (Dashboard)

Authored by: Architect Pro

This folder contains the top-level Syllabus UI and related resources. Files:

- `page.tsx` — Mobile-first dashboard page listing exams, search, pinning, and download catalog action.
- `route.ts` (in `src/app/api/dashboard/syllabus`) — API surface for listing exams and toggling pins.

Design guidelines:
- Mobile-first, touch-friendly (48px minimum targets)
- Dark theme: `bg-slate-950`, cards `bg-slate-900/40`
- Uses TailwindCSS and Lucide icons

Notes:
- Replace mocked API logic with production DB calls and proper auth checks.
