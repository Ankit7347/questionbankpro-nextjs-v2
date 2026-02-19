# Data Models – Academic Structure

This directory contains all core **TypeScript domain models** used in the platform.

The models are designed to support:
- School: Class 9–12 (CBSE, ICSE, State Board)
- Graduation: BSc courses
- Post-Graduation: MSc courses
- Competitive Exams: JEE, NEET, CUET, GATE, CAT, etc.

The system is **exam-first**, **topic-centric**, and **MongoDB-backed**.

---

## 🔹 Design Principles

1. **Exam-first hierarchy:** Exam → SubExam → Course → User access
2. **Topic is atomic:** Reusable across exams, questions, and quizzes
3. **Multilingual core:** en/hi support on name/description fields
4. **Soft deletes only:** Data preservation, no hard deletes
5. **Service layer pattern:** All DB access controlled via services
6. **DTO mappers:** Clean API responses with language resolution
7. **Strict indexes:** Foreign keys and unique constraints enforced
8. **Activity auditing:** Track who changed what, when

---

## 🔁 Complete Model Hierarchy

```
EducationLevel (top-level academic classification)
│
▼
Exam (board/competitive exam)
├────────────────────────────────────────┐
│                                        │
▼                                        ▼
SubExam (yearly variant)          OfficialSyllabus
│                                  (curriculum for year)
├─────────────────┐                │
▼                 ▼                ▼
Course    UserCourseAccess   Subject
(product)  (purchase/access)    │
                                ▼
                           (SubjectMap)
                                │
                                ▼
                           Chapter
                           (ChapterMap)
                                │
                                ▼
                              Topic
                        (atomic unit)
                    ┌─────────┬────────┬──────────────┐
                    ▼         ▼        ▼              ▼
                 Question   Quiz    Note      CompetitiveTopicMap
                 (content)  (group) (material) (importance)
                    │         │
                    ├─▶ QuizSubmission
                    │   (user attempt)
                    │
                    ▼
            PreviousPaper ◀─── SolvedPaper
            (past papers)      (solutions)

User
├──▶ UserCourseAccess (course license)
├──▶ UserNoteActivity (engagement)
├──▶ Progress (learning stats)
├──▶ Bookmark (saved items)
└──▶ QuizSubmission (attempts)

Support Models:
├──▶ ActivityLog (audit trail)
├──▶ BestBook (book recommendations)
├──▶ Coupon & CourseCouponMap (discounts)
├──▶ GeolocationState & District (location)
├──▶ ResetToken (password reset)
└──▶ ContactUs (support tickets)
```

---

## 🔹 BaseEntity (Shared by All Models)

All models inherit common fields via base.schema.ts.

| Field | Type | Description |
|-------|------|------------|
| _id | ObjectId | MongoDB auto ID (mapped to `id: string` in DTOs) |
| isDeleted | boolean | Soft delete flag (default: false) |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |
| updatedBy | string? | UUID of user/admin who updated |

---

## 📚 CORE ACADEMIC HIERARCHY

### 1. EducationLevel
Top-level academic grouping.

**Schema:** `name` (en/hi), `slug` (unique), `description` (en/hi), `icon`, `order`, `isActive`

**Examples:** Class 9, Class 10, Class 12, UG, PG, JEE, NEET

**Links to:** Exam

---

### 2. Exam
Represents a board, university, or competitive exam.

**Schema:** `name` (en/hi), `shortName` (en/hi), `slug` (unique), `educationLevelId` (ref), `description` (en/hi), `icon`, `bannerImage`, `order`, `isActive`

**Examples:** CBSE Board, JEE Main, NEET, GATE, ICSE

**Links to:** EducationLevel, SubExam, OfficialSyllabus, CompetitiveTopicMap, PreviousPaper

---

### 3. SubExam
Yearly variant or sub-category of an exam.

**Schema:** `name` (en/hi), `slug` (unique), `examId` (ref), `year` (optional)

**Purpose:** Track exam variants by year (JEE Main 2024 vs 2025)

**Examples:** JEE Main 2025, NEET UG 2025, CBSE Class 12 2024-25

**Links to:** Exam, Course, UserCourseAccess, OfficialSyllabus, PreviousPaper

---

### 4. OfficialSyllabus
Official curriculum specification for an exam variant.

**Schema:** `subExamId` (ref), `year`, `version` (default: 1), `validFrom`, `validTo`, `isActive`, `unique: (subExamId, version)`

**Purpose:** Track syllabus versions over time with validity periods

**Example:** CBSE + 2025 + Version 1 (validFrom: 2025-01-01, validTo: 2025-12-31)

**Links to:** SubExam, SubjectMap

---

### 5. Subject
Academic subject within a curriculum.

**Schema:** `name` (en/hi), `slug` (unique), `description` (plain string, non-i18n)

**Examples:** Physics, Chemistry, Mathematics, Biology, English

**Links to:** SubjectMap, Question, CourseSubjectAccessMap, Bookmark

---

### 6. Chapter
Chapter/Unit within a subject.

**Schema:** `name` (en/hi), `slug` (unique), `description` (plain string, non-i18n)

**Examples:** Laws of Motion, Trigonometry, Electrochemistry, Photosynthesis

**Links to:** ChapterMap, Question, Bookmark

---

### 7. Topic ⭐ (Atomic Unit - CORE)
Smallest reusable academic unit in the system.

**Schema:** `name` (en/hi), `slug` (unique), `description` (plain string, non-i18n), `difficulty` (easy|medium|hard, default: medium)

**Key Property:** Standalone in schema — linked to hierarchy via SubjectMap → ChapterMap → TopicMap

**Examples:** Newton's First Law, Pythagoras Theorem, Oxidation Numbers

**Used by:** Question, Quiz (references), CompetitiveTopicMap, TopicMap

**Links to:** TopicMap, CompetitiveTopicMap, Question

---

## 📚 MAPPING MODELS (Curriculum Structure)

These models define versioned curriculum structure with temporal validity.

### 8. SubjectMap
Maps subjects to official syllabus.

**Schema:** `syllabusId` (ref OfficialSyllabus), `subjectId` (ref), `order`, `isOptional`, `isRemoved`, `validFrom`, `validTo`, `unique: (syllabusId, subjectId)`

**Purpose:** Define which subjects are in a specific syllabus version

**Links to:** OfficialSyllabus, Subject, ChapterMap

---

### 9. ChapterMap
Maps chapters to subject within syllabus.

**Schema:** `subjectMapId` (ref), `chapterId` (ref), `order`, `isOptional`, `isRemoved`, `validFrom`, `validTo`

**Purpose:** Define chapter sequence and optionality within syllabus

**Links to:** SubjectMap, Chapter, TopicMap

---

### 10. TopicMap
Maps topics to chapter within syllabus.

**Schema:** `chapterMapId` (ref), `topicId` (ref), `order`, `isOptional`, `isRemoved`, `validFrom`, `validTo`

**Purpose:** Define topic sequence and optionality within syllabus

**Links to:** ChapterMap, Topic

---

### 11. CompetitiveTopicMap
Maps topics to competitive exams with weightage and importance.

**Schema:** `examId` (ref), `topicId` (ref), `weightage` (%), `priority` (low|medium|high), `unique: (examId, topicId)`

**Purpose:** Track topic importance for competitive exams without duplicating topics

**Example:** "Newton's First Law = HIGH priority, 10% weightage for JEE Main"

**Links to:** Exam, Topic

---

## 📚 COURSE & COMMERCE MODELS

### 12. Course
Purchasable/enrollable course product.

**Schema:** `subExamId` (ref), `type` (FULL|CRASH|TEST_SERIES), `name` (en/hi), `slug` (unique), `basePrice`, `salePrice`, `currency` (INR|USD), `validFrom`, `validTo`, `isActive`, `visibility`

**Types:**
- FULL: Complete course with all subjects/chapters
- CRASH: Quick revision course (1-2 months)
- TEST_SERIES: Only mock tests/papers

**Links to:** SubExam, UserCourseAccess, CourseSubjectAccessMap, CourseCouponMap

---

### 13. UserCourseAccess
Source of truth for course purchase & user access rights.

**Schema:** `userId` (ref), `courseId` (ref), `subExamId` (ref), `accessType` (FREE|PAID), `pricePaid`, `couponId` (ref, nullable), `enrolledAt`, `accessValidTill`, `status` (ACTIVE|EXPIRED|REVOKED), `unique: (userId, courseId)`

**Purpose:** Track who can access what course and until when

**Links to:** User, Course, SubExam, Coupon

---

### 14. CourseSubjectAccessMap
Maps which subjects are included in a course.

**Schema:** `courseId` (ref), `subjectId` (ref), `isIncluded` (boolean), `unique: (courseId, subjectId)`

**Purpose:** Define course curriculum (which subjects included)

**Links to:** Course, Subject

---

### 15. Coupon
Discount codes for courses.

**Schema:** `code` (unique uppercase), `discountType` (FLAT|PERCENT), `discountValue`, `maxDiscount` (for PERCENT), `minOrderAmount`, `validFrom`, `validTo`, `usageLimit`, `perUserLimit` (default: 1), `isActive`

**Examples:** SUMMER50 (50% off, max ₹2000), NEWUSER500 (₹500 flat, min ₹1000)

**Links to:** CourseCouponMap, UserCourseAccess

---

### 16. CourseCouponMap
Associates coupons with courses.

**Schema:** `courseId` (ref), `couponId` (ref), `isActive`, `unique: (courseId, couponId)`

**Purpose:** Define which coupons apply to which courses

**Links to:** Course, Coupon

---

## 📚 ASSESSMENT & CONTENT MODELS

### 17. Question
Individual assessment item.

**Schema:** `content` (en/hi), `type` (MCQ|SUBJECTIVE|TRUE_FALSE), `options` (array: {text (en/hi), isCorrect}), `explanation` (en/hi), `marks`, `difficulty` (Easy|Medium|Hard), `displayOrder`, `subjectId` (ref), `chapterId` (ref), `topicId` (ref), `images` (array: URLs)

**Rule:** Always belongs to exactly one topic

**Links to:** Topic, Chapter, Subject, Question, Bookmark

---

### 18. Quiz
Logical grouping and assessment of questions.

**Schema:** `title` (en/hi), `description` (en/hi), `quizType` (topic|chapter|subject|full_syllabus|mock_test), `examId` (ref), `subExamId` (ref), `subjectId` (ref, optional), `chapterId` (ref, optional), `topicId` (ref, optional), `questionCount`, `timeLimit` (minutes), `shuffleQuestions`, `passingScore` (%), `isPublished`, `index: (examId, quizType)`

**Quiz Types:**
- topic: Single topic practice
- chapter: Entire chapter assessment
- subject: Full subject exam
- full_syllabus: Complete mock
- mock_test: Full exam simulation

**Links to:** Exam, SubExam, Subject, Chapter, Topic, QuizSubmission

---

### 19. QuizSubmission
Tracks user's quiz attempt and performance.

**Schema:** `userId` (ref), `quizId` (ref), `attemptNumber`, `startedAt`, `submittedAt`, `score`, `totalMarks`, `answers` (array: {questionId, selectedAnswer, isCorrect}), `timeSpent` (seconds)

**Purpose:** Analytics, progress tracking, leaderboards

**Links to:** User, Quiz

---

### 20. Note
Supplementary study material for topics.

**Schema:** `title`, `description`, `content`, `subject`, `chapter`, `topic`, `isPinned`, `isPublic`, `views`, `tags`, `attachments`, `createdBy`, `updatedBy`

**Purpose:** Admin-created or user-created study notes

**Examples:** "Tricks for quadratic equations", "NEET Biology photosynthesis summary"

**Links to:** Topic, UserNoteActivity, Bookmark

---

### 21. UserNoteActivity
Tracks user engagement with notes.

**Schema:** `userId` (ref), `noteId` (ref), `readCount`, `timeSpent` (seconds), `isBookmarked`, `lastActive`

**Purpose:** Understand engagement and recommend content

**Links to:** User, Note

---

### 22. PreviousPaper
Previous year exam papers.

**Schema:** `title` (en/hi), `slug` (unique), `paperCode` (unique uppercase), `examId` (ref), `subExamId` (ref), `subjectId` (ref), `year`, `session` (semester1|semester2|annual), `contentType` (PDF|DIGITAL|BOTH), `paperUrl`, `questions` (ref array), `displayOrder`, `isPremium`, `isVerified`, `status` (DRAFT|PUBLISHED|ARCHIVED), `views`, `downloads`, `prints`, `shares`, `totalRatings`, `relatedPaperIds` (ref array), `metaTitle`, `metaDescription`, `keywords`, `tags`, `createdBy`, `index: (examId, year, subjectId)`

**Purpose:** Practice with actual past papers

**Links to:** Exam, SubExam, Subject, Question, SolvedPaper, Bookmark

---

### 23. SolvedPaper
Detailed solution for a previous paper.

**Schema:** `previousPaperId` (ref, unique), `fullExplanation` (en/hi), `solutionPdfUrl`, `videoSolutionUrl`, `isPremium`, `solutionQuality` (BASIC|EXPERT_VERIFIED), `views`, `totalLikes`, `averageRating` (0-5), `totalRatings`

**Purpose:** Provide detailed solutions with video explanations

**Links to:** PreviousPaper

---

## 📚 USER & ENGAGEMENT MODELS

### 24. User
Application user account.

**Schema:** `uuid` (unique), `name`, `email` (unique lowercase), `phone`, `passwordHash`, `role` (student|contentadmin|superadmin), `uiMode` (light|dark), `preferences` ({theme, notifications, language}), `dashboard` ({notes, bookmarks, history, performance}), `stateName`, `districtName`, `geolocationStateId` (ref)

**Links to:** UserCourseAccess, UserNoteActivity, Progress, Bookmark, QuizSubmission, ActivityLog, ResetToken

---

### 25. Progress
Track user's learning progress.

**Schema:** `userId` (ref), `subjectId` (string), `chapterId` (string), `topicId` (string), `progress` (percentage), `lastAccessed`

**Purpose:** Learning analytics and progress visualization

**Links to:** User

---

### 26. Bookmark
User bookmarks for quick access.

**Schema:** `userId` (ref), `itemType` (topic|chapter|subject|paper|note|other), `itemId` (string)

**Purpose:** Personal collections for revision

**Links to:** User, Topic/Chapter/Subject/PreviousPaper/Note

---

### 27. ActivityLog
Audit trail of system activities.

**Schema:** `userId` (ref), `type` (string: e.g., 'note_view', 'quiz_attempt', 'page_visit'), `payload` (mixed object), `index: (userId, type)`

**Purpose:** Security audit and usage analytics

**Links to:** User

---

## 📚 REFERENCE & SUPPORT MODELS

### 28. BestBook
Curated textbook recommendations.

**Schema:** `title`, `author`, `subject`, `className` (e.g., "Class 10", "BSc Physics"), `board` (CBSE|ICSE|JEE), `competitive` (boolean), `imageUrl`, `description`, `tags`, `rating`, `isbn`, `amazonUrl`

**Purpose:** Book recommendations for deeper learning

**Examples:** "NCERT Physics Class 12", "IIT JEE Solutions by Arihant"

---

### 29. GeolocationState
Indian states.

**Schema:** `stateName` (unique), `stateCode` (e.g., UP, MH)

---

### 30. GeolocationDistrict
Districts within states.

**Schema:** `districtName`, `geolocationStateId` (ref), `unique: (districtName, geolocationStateId)`

**Links to:** GeolocationState

---

### 31. ResetToken
Password reset tokens.

**Schema:** `email` (lowercase, index), `token` (unique), `createdAt` (expires: 30 minutes)

**Purpose:** Secure password reset flow

---

### 32. ContactUs
Support/enquiry submissions.

**Schema:** `name`, `email` (lowercase), `phone`, `message`

**Purpose:** Collect user feedback and support requests

---

## 🧠 Multilingual Support

**Pattern:** Fields with multilingual content use:

```typescript
name: {
  en: string;  // English (required)
  hi?: string; // Hindi (optional)
}
```

**Applied to models:**
- EducationLevel, Exam, SubExam
- Subject, Chapter, Topic
- Course, Quiz, Note, PreviousPaper, SolvedPaper
- Question, BestBook
- User (name only)
- GeolocationState, GeolocationDistrict (no i18n, actual names)

**Resolution:** Via `resolveI18nField(value, lang)` helper in mappers that returns `value[lang]` or falls back to `value.en`.

---

## 🔗 Actual File Structure

```
src/models/
├── README.md (this file)
├── BaseEntity.ts
│
├── mongoose/ (32 collections)
│   ├── base.schema.ts (shared fields)
│   ├── EducationLevel.schema.ts
│   ├── Exam.schema.ts
│   ├── SubExam.schema.ts
│   ├── OfficialSyllabus.schema.ts
│   ├── Subject.schema.ts
│   ├── Chapter.schema.ts
│   ├── Topic.schema.ts
│   ├── SubjectMap.schema.ts
│   ├── ChapterMap.schema.ts
│   ├── TopicMap.schema.ts
│   ├── CompetitiveTopicMap.schema.ts
│   ├── Course.schema.ts
│   ├── UserCourseAccess.schema.ts
│   ├── CourseSubjectAccessMap.schema.ts
│   ├── Coupon.schema.ts
│   ├── CourseCouponMap.schema.ts
│   ├── Question.schema.ts
│   ├── Quiz.schema.ts
│   ├── QuizSubmission.schema.ts
│   ├── Note.schema.ts
│   ├── UserNoteActivity.schema.ts
│   ├── PreviousPaper.schema.ts
│   ├── SolvedPaper.schema.ts
│   ├── User.schema.ts
│   ├── Progress.schema.ts
│   ├── Bookmark.schema.ts
│   ├── ActivityLog.schema.ts
│   ├── BestBook.schema.ts
│   ├── GeolocationState.schema.ts
│   ├── GeolocationDistrict.schema.ts
│   ├── ResetToken.schema.ts
│   └── ContactUs.schema.ts
│
├── dto/ (Data Transfer Objects)
│   ├── base.mapper.ts (ObjectId → id, timestamps)
│   ├── *.mapper.ts (one per model)
│   └── *.dto.ts (TypeScript interfaces)
│
└── index.ts (optional re-exports)
```

---

## 📋 Quick Reference

- **32 MongoDB collections** matching actual mongoose folder
- **Multilingual support:** English + Hindi on all name/description fields
- **Soft deletes:** All models support `isDeleted` flag
- **Timestamps:** `createdAt`, `updatedAt` on all models
- **Audit trail:** `updatedBy` on all models
- **Indexes:** Foreign keys and unique constraints properly indexed
- **Service layer:** Every model has dedicated service functions
- **DTOs:** Clean API contracts via mappers
- **Versioning:** OfficialSyllabus tracks curriculum versions with validFrom/validTo

---

## ✅ Architecture Strengths

- ✅ **Topic reuse:** No duplication across exams via CompetitiveTopicMap
- ✅ **Syllabus versioning:** Track curriculum changes with OfficialSyllabus
- ✅ **Validity periods:** validFrom/validTo on maps allow temporal queries
- ✅ **Optional content:** Mark chapters/topics as optional per syllabus
- ✅ **Soft deletes:** No data loss, full audit trail
- ✅ **Commerce:** Course, pricing, coupons, access control fully supported
- ✅ **Analytics:** Activity logging, progress tracking, engagement metrics
- ✅ **Future-proof:** Extensible for videos, assignments, AI recommendations

---

## 🎯 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Exam-first hierarchy | Most queries start from exam selection |
| Topic independence | Topics reusable without duplication across exams |
| Mapping tables | Allows versioning and temporal queries |
| Soft deletes only | Audit trail and data recovery |
| Multilingual core | Not bolted-on later |
| Service layer | Centralized business logic |
| DTOs with mappers | Clean API contracts |
| Activity logging | Full audit trail required |
| UUID for users | Privacy-compliant identifiers |
| Question always has topicId | Ensures proper classification |
| SubjectMap → ChapterMap → TopicMap | Enforces strict hierarchy |
| validFrom/validTo on maps | Curriculum changes traceable |

---

## 📞 Documentation Guidelines

1. All schema files include comments explaining relationships
2. Each model has a corresponding DTO and mapper
3. Service layer wraps all model access
4. API routes validate with Zod schemas
5. Updates to models must maintain backward compatibility
