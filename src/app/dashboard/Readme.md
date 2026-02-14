
---

# Student Dashboard – Route Interconnectivity

This document explains how each dashboard route is connected,
how users navigate between pages, and where actions originate.

This is **navigation logic**, not UI design.

---

## 1. `/dashboard` (Dashboard Home)

**Role**
- Entry point after login
- Summary / overview page

**Links TO**
- `/dashboard/courses`
- `/dashboard/quiz`
- `/dashboard/notes`
- `/dashboard/profile`

**Linked FROM**
- Login redirect
- Sidebar (Dashboard)

---

## 2. `/dashboard/courses` (Courses List)

**Role**
- Shows enrolled + available courses

**Links TO**
- `/dashboard/courses/[courseId]`
- `/dashboard/courses/checkout`

**Linked FROM**
- Sidebar → Courses
- Dashboard Home

---

## 3. `/dashboard/courses/[courseId]` (Course Home)

**Role**
- Central hub for a single course

**Links TO**
- `/dashboard/courses/[courseId]/syllabus`
- `/dashboard/courses/[courseId]/notes`
- `/dashboard/courses/[courseId]/quiz`
- `/dashboard/courses/[courseId]/previous-papers`
- `/dashboard/courses/[courseId]/solved-papers`
- `/dashboard/courses/[courseId]/progress`

**Linked FROM**
- `/dashboard/courses`

---

## 4. `/dashboard/notes`

**Role**
- Global notes browser (all courses)

**Links TO**
- `/dashboard/notes/[subjectId]`
- `/dashboard/notes/[subjectId]/[chapterId]`
- `/dashboard/notes/[subjectId]/[chapterId]/[topicId]`

**Linked FROM**
- Sidebar → Notes
- Course Home → Notes

---

## 5. `/dashboard/bookmarks`

**Role**
- List items the user has bookmarked for later review

**Links TO**
- (depending on itemType) corresponding notes/quiz/paper pages

**Linked FROM**
- Header/bookmark buttons throughout the app
- Dashboard home tile

---

## 6. `/dashboard/history`

**Role**
- Chronological view of user activity (notes viewed, quizzes taken)

**Links TO**
- Relevant content pages based on activity entries

**Linked FROM**
- Dashboard home tile

---

## 7. `/dashboard/performance`

**Role**
- Show quiz attempt summaries and trends

**Links TO**
- Individual quiz result pages

**Linked FROM**
- Dashboard home tile

---

## 8. `/dashboard/settings`

**Role**
- Preferences, account management, theme selection

**Links TO**
- Sub‑routes for notifications, password, etc.

**Linked FROM**
- Sidebar → Settings
- Profile dropdown


---

## 5. `/dashboard/quiz`

**Role**
- Practice & test landing page

**Links TO**
- `/dashboard/quiz/upcoming`
- `/dashboard/quiz/history`
- `/dashboard/quiz/[quizId]`

**Linked FROM**
- Sidebar → Quiz
- Course Home → Quiz

---

## 6. `/dashboard/quiz/[quizId]`

**Role**
- Quiz instructions / start page

**Links TO**
- `/dashboard/quiz/[quizId]/attempt`
- `/dashboard/quiz/[quizId]/result`

**Linked FROM**
- Quiz list
- Upcoming quizzes

---

## 7. `/dashboard/previous-papers`

**Role**
- Year-wise question papers

**Links TO**
- `/dashboard/previous-papers/[year]`
- `/dashboard/previous-papers/[year]/[paperId]`

**Linked FROM**
- Sidebar → Previous Papers
- Course Home

---

## 8. `/dashboard/solved-papers`

**Role**
- Solutions for previous papers

**Links TO**
- `/dashboard/solved-papers/[year]`
- `/dashboard/solved-papers/[year]/[paperId]`

**Linked FROM**
- Sidebar → Solved Papers
- Previous Papers

---

## 9. `/dashboard/syllabus`

**Role**
- Exam / course syllabus view

**Links TO**
- `/dashboard/syllabus/[examId]`
- `/dashboard/syllabus/[examId]/[subjectId]`
- `/dashboard/syllabus/[examId]/[subjectId]/[chapterId]`

**Linked FROM**
- Sidebar → Syllabus
- Course Home

---

## 10. `/dashboard/profile`

**Role**
- User account overview

**Links TO**
- `/dashboard/profile/edit`
- `/dashboard/profile/security`

**Linked FROM**
- Sidebar → Profile

---

## 11. `/dashboard/settings`

**Role**
- Account & preference management

**Links TO**
- `/dashboard/settings/password`
- `/dashboard/settings/notifications`

**Linked FROM**
- Sidebar → Settings
- Profile page

---

## Navigation Rules (Hard Rules)

1. Sidebar links ONLY point to **top-level routes**
2. Sub-routes are accessed **contextually**
3. Course-specific pages always require `[courseId]`
4. Quiz result pages are **never in sidebar**
5. Sidebar should remain stable and small

---

## Mental Model

- **Sidebar** → Where am I?
- **Buttons / Tabs** → What can I do here?
- **Dynamic routes** → Which entity am I working on?

---

## Summary Flow
```
Dashboard └── Courses └── Course Home ├── Syllabus ├── Notes ├── Quiz ├── Previous Papers └── Solved Papers

```
