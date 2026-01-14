Below is a **single Markdown document** you can keep and share.
It explains **your final data structure** clearly, with **one concrete example (Class 6)**.

---

```md
# QuestionbankPro – Final Data Structure Guide

This document defines the **locked, final structure** of the QuestionbankPro data model.
It explains **what each layer represents**, **where validity applies**, and **how data flows**
from database → DTO → API.

---

## 1. Identity Layer (NO validity)

These define *who the exam is*, not *what is taught*.

They are **stable** and never versioned.

Hierarchy:
```

EducationLevel → Exam → Course

```

Examples:
- EducationLevel: `School`
- Exam: `CBSE`
- Course: `Class 6`

Rules:
- ❌ No `validFrom / validTo`
- ❌ No syllabus changes here
- ✅ Used only for identity & navigation

---

## 2. Content Layer (WITH validity)

These define *what is taught*.
They **change over time**, so they carry validity.

Hierarchy:
```

Course
└── Syllabus
└── Subject
└── Chapter
└── Topic

```

Validity rules:
- `validFrom: number` (e.g. 2024)
- `validTo: number | null`
- **Active = `validTo === null`**
- Only the changed entity is closed

---

## 3. Entity Responsibilities

### Syllabus
- Course-level structure
- Changes only for **major syllabus revisions**

Fields (key):
- courseId
- validFrom / validTo

---

### Subject
- Major academic areas
- Medium-frequency changes

Example:
- Mathematics
- Science

---

### Chapter
- Structured units inside a subject
- Fine-grained changes

Example:
- Motion
- Algebra

---

### Topic (MOST granular)
- Atomic learning unit
- Changes most frequently

Extra metadata:
- `difficulty`: easy | medium | hard
- `isCoreTopic`: true | false

---

## 4. Example – Class 6 (CBSE)

### Identity
```

EducationLevel: School
Exam: CBSE
Course: Class 6

````

---

### Syllabus
```json
{
  "courseId": "class6-id",
  "validFrom": 2024,
  "validTo": null
}
````

---

### Subject

```json
{
  "syllabusId": "syllabus-2024-id",
  "name": "Science",
  "slug": "science",
  "validFrom": 2024,
  "validTo": null
}
```

---

### Chapter

```json
{
  "subjectId": "science-id",
  "name": "Motion and Measurement",
  "slug": "motion-measurement",
  "validFrom": 2024,
  "validTo": null
}
```

---

### Topic

```json
{
  "chapterId": "motion-measurement-id",
  "name": "Types of Motion",
  "slug": "types-of-motion",
  "difficulty": "medium",
  "isCoreTopic": true,
  "validFrom": 2024,
  "validTo": null
}
```

---

## 5. Change Scenarios (IMPORTANT)

### Removing one topic (safe)

* Set `validTo` on **Topic only**
* Syllabus, Subject, Chapter remain active

### Changing a chapter

* Close only the Chapter
* Topics under it may be reattached to a new Chapter

### Major syllabus overhaul

* Close Syllabus
* Create new Syllabus
* Reuse Subjects/Chapters where applicable

---

## 6. Query Rules (MANDATORY)

Every content query must include:

```ts
{
  validTo: null,
  isDeleted: false
}
```

Validity is checked **per entity**, not globally.

---

## 7. DTO & Mapper Rule

* DTOs are **pure transport**
* Mappers:

  * Convert `_id → id`
  * Do NOT apply filters
* Filtering happens in repository/service layer

---

## 8. Final Lock

* Identity ≠ Content
* Validity only on content
* Partial changes never break parents
* Supports:

  * Class 6 → Class 12
  * SSC / CBSE / ICSE
  * GATE / JEE / NEET
  * Year-wise syllabus history

This structure is FINAL and production-safe.

```

---

If you want, next I can:
- shrink this to a **1-page quick reference**
- add **diagram-style ASCII**
- or create a **developer onboarding version**

Just say.
```
