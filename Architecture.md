---

QuestionbankPro – Architecture Summary

(Final, Corrected, Enforced & Schema-Accurate)

> Status: Canonical source of truth
Aligned with: Official exam PDFs (GATE / UPSC / SSC etc.)
Locked: ✅ Yes




---

1. App Layer (Routing & UI)

<!-- src/app/ -->src/app/
├── layout.tsx                 ← Global providers (theme, i18n, auth)
├── page.tsx                   ← Landing
├── api/                       ← Thin API routes only
├── exams/
│   ├── layout.tsx             ← Exam shell (Navbar + Footer)
│   ├── page.tsx               ← Exam listing
│   └── [examSlug]/
│       ├── layout.tsx         ← Exam context
│       ├── page.tsx           ← Exam landing
│       └── [subExamSlug]/
│           ├── layout.tsx     ← SubExam shell (sidebar persists)
│           └── syllabus/
│               └── [syllabusSlug]/
│                   ├── page.tsx
│                   ├── subject/[subjectSlug]/page.tsx
│                   ├── chapter/[chapterSlug]/page.tsx
│                   └── topic/[topicSlug]/page.tsx

Rules

❌ No mongoose imports

❌ No server DTO imports

✅ UI DTOs only

✅ UI hierarchy is a projection, not DB ownership



---

2. Models Layer

<!-- src/models/ -->2.1 Mongoose Models (DB Only)

<!-- src/models/mongoose/ -->src/models/mongoose/
├── base.schema.ts
├── Exam.schema.ts
├── SubExam.schema.ts
├── OfficialSyllabus.schema.ts
├── Subject.schema.ts
├── Chapter.schema.ts
├── Topic.schema.ts
├── SubjectMap.schema.ts
├── ChapterMap.schema.ts
├── TopicMap.schema.ts

base.schema.ts

createdAt
updatedAt
updatedBy
isDeleted
timestamps: true

Rules

❌ Never used in UI

❌ Never returned directly from API

✅ Used only inside server services



---

3. The CORRECT Official Syllabus Hierarchy (LOCKED)

Exam
 └── SubExam                    (GATE 2026 – CS)
      └── OfficialSyllabus      (official PDF / version)
           └── SubjectMap
                └── Subject
                     └── ChapterMap
                          └── Chapter
                               └── TopicMap
                                    └── Topic

Core Truth

> OfficialSyllabus is the sole owner of syllabus content



SubExam ❌ does NOT own subjects

Course ❌ does NOT exist in syllabus ownership

Subjects / Chapters / Topics are canonical & reusable

Context is applied only via mapping tables



---

4. Collections & Responsibility (Authoritative)

Exam Context

Exam
SubExam
OfficialSyllabus

Canonical Content (Global)

Subject
Chapter
Topic

Contextual Mapping (Ordered)

SubjectMap   (officialSyllabusId + subjectId + order)
ChapterMap  (subjectMapId + chapterId + order)
TopicMap    (chapterMapId + topicId + order)


---

5. DTO Layers

5.1 Server DTOs

<!-- src/models/dto/ -->src/models/dto/
├── exam.dto.ts
├── subExam.dto.ts
├── officialSyllabus.dto.ts
├── subject.dto.ts
├── chapter.dto.ts
├── topic.dto.ts
├── apiResponse.dto.ts
└── *.mapper.ts

Mappers convert mongoose → server DTO

API never leaks DB shape



---

5.2 UI DTOs

<!-- src/dto/ -->src/dto/
├── Exam.dto.ts
├── SubExam.dto.ts
├── OfficialSyllabus.dto.ts
├── Subject.dto.ts
├── Chapter.dto.ts
└── Topic.dto.ts

❌ No mongoose

❌ No server DTO imports

✅ Used by pages, components, hooks



---

6. Services Layer

<!-- src/services/ -->6.1 Server Services

<!-- src/services/server/ -->src/services/server/
├── exam.server.ts
├── subExam.server.ts
├── officialSyllabus.server.ts
├── subject.server.ts
└── *.server.ts

Rules

✅ Uses mongoose + server DTOs

❌ No request / response objects

✅ Throws ApiError only



---

6.2 Client Services

<!-- src/services/client/ -->src/services/client/
├── exam.client.ts
├── subExam.client.ts
├── officialSyllabus.client.ts
└── *.client.ts

Calls API routes

Consumes ApiResponse<T>

Returns UI DTOs



---

7. API Response Contract (Mandatory)

interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
  statusCode: number
}

Rules

❌ No raw res.json

❌ No ad-hoc responses

✅ Only via response.util.ts



---

8. Error Handling

<!-- src/lib/ -->src/lib/
├── apiError.ts
├── response.util.ts
├── validators.ts
└── constants.ts

All server errors → ApiError

API routes translate → ApiResponse



---

9. i18n Layer (Mandatory)

<!-- src/lib/i18n/ -->src/lib/i18n/
├── index.ts          ← getCurrentLang()
├── dictionaries/
│   ├── en.json
│   └── hi.json
└── types.ts

Rules

Language resolved once

Server returns localized strings

❌ UI does not translate business data



---

10. Request → Response Lifecycle (Strict)

UI
 → client service
 → API route
 → server service
 → mongoose
 → mapper
 → server DTO
 → ApiResponse
 → client service
 → UI DTO
 → UI

Any shortcut = ❌ violation


---

11. HARD ENFORCEMENT RULES (NON-NEGOTIABLE)

❌ Forbidden

Subject.examId

Subject.subExamId

Chapter.subjectId

Topic.chapterId

Course → syllabus linkage


✅ Allowed

Only mapping collections define hierarchy



---

12. Automation & Documentation Rules

Auto-Scaffolding

Script must create:

All folders

Placeholder files


Used in setup / CI


File Header Rule

Every file starts with:

// src/services/server/officialSyllabus.server.ts


---

🔒 FINAL ONE-LINE TRUTH (PIN THIS)

> OfficialSyllabus is the single source of syllabus truth; everything else is context or projection
