# QuestionbankPro – Architecture Summary  
(Final, Corrected, Enforced & Schema-Accurate)

Status: Canonical source of truth  
Aligned with: Official exam PDFs (GATE / UPSC / SSC etc.)  
Locked: Yes

## 1. App Layer (Routing & UI)
<!-- src/app/ -->

```txt
src/app/
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

Rules:

No mongoose imports

No server DTO imports

UI DTOs only

UI hierarchy is a projection, not DB ownership



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

base.schema.ts:

createdAt

updatedAt

updatedBy

isDeleted

timestamps enabled


Rules:

Never imported in UI

Never returned directly from API

Used only in server services



---

3. Official Syllabus Hierarchy (Locked)

Exam
 └── SubExam                    (GATE 2026 – CS)
      └── OfficialSyllabus      (official PDF / version)
           └── SubjectMap
                └── Subject
                     └── ChapterMap
                          └── Chapter
                               └── TopicMap
                                    └── Topic

Core truth:

OfficialSyllabus is the single owner of syllabus content

SubExam does not own subjects

Course does not exist in syllabus ownership

Subjects, Chapters, Topics are canonical and reusable

Context is applied only via mapping tables



---

4. Collections & Responsibility (Authoritative)

Exam context:

Exam
SubExam
OfficialSyllabus

Canonical content (global, reusable):

Subject
Chapter
Topic

Contextual mapping (ordered):

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

Details:

Server DTOs define what API is allowed to expose

Mappers convert mongoose models to server DTOs

API never leaks DB structure



---

5.2 UI DTOs

<!-- src/dto/ -->src/dto/
├── Exam.dto.ts
├── SubExam.dto.ts
├── OfficialSyllabus.dto.ts
├── Subject.dto.ts
├── Chapter.dto.ts
└── Topic.dto.ts

Rules:

No mongoose imports

No server DTO imports

Used by pages, components, hooks only



---

6. Services Layer

<!-- src/services/ -->6.1 Server Services

<!-- src/services/server/ -->src/services/server/
├── exam.server.ts
├── subExam.server.ts
├── officialSyllabus.server.ts
├── subject.server.ts
└── *.server.ts

Rules:

Uses mongoose models

Uses server DTOs and mappers

Contains business logic

No request or response objects

Throws ApiError only



---

6.2 Client Services

<!-- src/services/client/ -->src/services/client/
├── exam.client.ts
├── subExam.client.ts
├── officialSyllabus.client.ts
└── *.client.ts

Rules:

Calls API routes

Consumes ApiResponse<T>

Returns UI DTOs only



---

7. API Response Contract (Mandatory)

interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
  statusCode: number
}

Rules:

No raw res.json or ad-hoc responses

Response creation only via response.util.ts



---

8. Error Handling Layer

<!-- src/lib/ -->src/lib/
├── apiError.ts        ← typed server errors with HTTP status
├── response.util.ts  ← centralized success / error formatter
├── validators.ts
└── constants.ts

Rules:

All server errors must be ApiError

API routes translate errors into ApiResponse



---

9. i18n Layer (Mandatory)

<!-- src/lib/i18n/ -->src/lib/i18n/
├── index.ts          ← getCurrentLang()
├── dictionaries/
│   ├── en.json
│   └── hi.json
└── types.ts

Rules:

Language resolved once per request

Server services receive lang

DTOs return localized strings

UI does not translate business data



---

10. Request–Response Flow (Strict)

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


---

11. Enforcement Rules (Non-Negotiable)

Forbidden:

Subject.examId

Subject.subExamId

Chapter.subjectId

Topic.chapterId

Course → syllabus linkage


Allowed:

Only mapping collections define hierarchy



---

12. Automation & Documentation Rules

Script must auto-create missing folders and files

Used during setup and CI

Every file must start with a top-level comment containing its full relative path


Example:

// src/services/server/officialSyllabus.server.ts






## Course (Commercial / Access Layer)

Course is not part of the official syllabus hierarchy.

Purpose:
- Commercial offering
- Access control
- Pricing, validity, and availability
- UI-level bundling

Relationship:
- One SubExam → many Courses
- Each Course belongs to exactly one SubExam
- Course never owns or maps syllabus data

Rules:
- Course must not reference OfficialSyllabus
- Course must not reference Subject, Chapter, Topic, or mapping tables
- Course may reference SubExam only

Example structure:
```txt
Course
 ├── subExamId
 ├── type (FULL | CRASH | TEST_SERIES)
 ├── name (localized)
 ├── slug
 ├── basePrice
 ├── salePrice
 ├── currency
 ├── validFrom
 ├── validTo
 ├── isActive
 └── metadata (createdAt, updatedAt, isDeleted)


---

Coupon (Commercial / Pricing Layer)

Coupon is a pricing modifier and not part of syllabus or course ownership.

Purpose:

Discount management

Promotional pricing

Controlled access benefits


Relationship:

Coupon may apply to:

One or more Courses

One or more SubExams


Coupon does not own or modify Course data


Rules:

Coupon must not reference OfficialSyllabus

Coupon must not reference Subject, Chapter, Topic, or mapping tables

Coupon affects price calculation only


Example structure:

Coupon
 ├── code
 ├── discountType (PERCENT | FLAT)
 ├── discountValue
 ├── applicableCourseIds[]
 ├── applicableSubExamIds[]
 ├── validFrom
 ├── validTo
 ├── usageLimit
 ├── isActive
 └── metadata (createdAt, updatedAt, isDeleted)
