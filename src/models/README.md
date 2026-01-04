Perfect. Below is a **single, well-structured `README.md`** you can place **inside `src/models/`**.
It contains:

* Clear explanation of **each model**
* **Metadata fields**
* **One consolidated model-linkage diagram**
* Design decisions (MongoDB + TS)
* Ready for long-term maintenance

You can copy-paste this **as-is**.

---

# 📘 `src/models/README.md`

```md
# Data Models – Academic Structure

This directory contains all core **TypeScript domain models** used in the platform.

The models are designed to support:
- Class 9–12 (School)
- Graduation (BSc)
- Post-Graduation (MSc)
- Competitive Exams (JEE, NEET, CUET, GATE, etc.)

The system is **syllabus-first**, **topic-centric**, and **MongoDB-backed**.

---

## 🔹 Design Principles

1. Topic is the smallest academic unit
2. Same topic can be reused across multiple exams
3. All deletes are **soft deletes**
4. MongoDB `_id` is mapped to `id: string` at app level
5. Models are independent of authentication
6. Strict hierarchy is enforced

---

## 🔁 Model Linkage Diagram

```

EducationLevel
│
▼
Course / Class
│
▼
Exam
│
▼
Syllabus
│
▼
Subject
│
▼
Chapter
│
▼
Topic
│
├───────────────┐
▼               ▼
Question     CompetitiveTopicMap
│               │
▼               ▼
Quiz          Competitive Exam

```

---

## 🔹 BaseEntity (Shared by All Models)

All models extend `BaseEntity`.

### Common Fields

| Field | Type | Description |
|------|-----|------------|
| id | string | MongoDB `_id` mapped to string |
| isDeleted | boolean | Soft delete flag |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |
| updatedBy | string? | UUID of user/admin |

---

## 📚 Model Descriptions

### 1. EducationLevel
Top-level academic grouping.

**Examples**
- Class 9
- Class 12
- Graduation
- Post-Graduation
- Competitive

**Links to:** Course

---

### 2. Course / Class
Represents a class or degree.

**Examples**
- Class 10
- Class 12 Science
- BSc Physics
- MSc Mathematics

**Links to:** Exam

---

### 3. Exam
Board, university, or competitive exam.

**Examples**
- CBSE
- ICSE
- JEE Main
- NEET
- GATE

**Links to:** Syllabus

---

### 4. Syllabus
Defines syllabus for a specific exam and course.

**Example**
- CBSE + Class 10 + 2024–25

**Links to:** Subject

---

### 5. Subject
Academic subject under a syllabus.

**Examples**
- Physics
- Chemistry
- Mathematics

**Links to:** Chapter

---

### 6. Chapter
Chapter inside a subject.

**Examples**
- Laws of Motion
- Trigonometry
- Electrochemistry

**Links to:** Topic

---

### 7. Topic (Atomic Unit)
Smallest reusable academic unit.

**Examples**
- Newton’s First Law
- Pythagoras Theorem
- Oxidation Number

**Used by**
- Questions
- Quizzes
- Competitive exam mapping

---

### 8. CompetitiveTopicMap
Maps topics to competitive exams.

**Purpose**
- Avoid topic duplication
- Allow different weightage per exam

**Links:** Topic ⇄ Exam

---

### 9. Question
Individual question linked strictly to a topic.

**Types**
- MCQ
- Numerical
- True/False

**Rule**
A question must belong to exactly one topic.

---

### 10. Quiz
Logical grouping of questions.

**Quiz Types**
- Topic-wise
- Chapter-wise
- Subject-wise
- Full syllabus
- Mock test

**Links to**
- Topic / Chapter / Subject / Syllabus

---

## 🧠 Architectural Notes

- MongoDB stores `_id` as `ObjectId`
- Application uses `id: string`
- All relations are stored as string IDs
- No hard deletes anywhere in the system
- Structure supports future additions:
  - Notes
  - Videos
  - AI recommendations
  - Analytics

---

## ✅ Summary

This model system is:
- Scalable
- Clean
- Future-proof
- Competitive-exam ready
- Easy to reason about

Any new feature **must align with this hierarchy**.
```

```
src/
├── lib/
│   └── mongodb.ts
│       └── MongoDB connection (Mongoose, cached)
│
├── models/
│   ├── BaseEntity.ts
│   │   └── TypeScript base interface (id, timestamps, soft delete)
│   │
│   ├── mongoose/
│   │   ├── base.schema.ts
│   │   │   └── Shared Mongoose fields (isDeleted, updatedBy, timestamps)
│   │   │
│   │   ├── EducationLevel.schema.ts
│   │   ├── Course.schema.ts
│   │   ├── Exam.schema.ts
│   │   ├── Syllabus.schema.ts
│   │   ├── Subject.schema.ts
│   │   ├── Chapter.schema.ts
│   │   ├── Topic.schema.ts
│   │   ├── CompetitiveTopicMap.schema.ts
│   │   ├── Question.schema.ts
│   │   ├── Quiz.schema.ts
│   │   │
│   │   ├── BestBook.schema.ts
│   │   ├── ContactUs.schema.ts
│   │   ├── GeolocationState.schema.ts
│   │   ├── GeolocationDistrict.schema.ts
│   │   ├── ResetToken.schema.ts
│   │   └── User.schema.ts
│   │
│   ├── dto/
│   │   ├── base.mapper.ts
│   │   │   └── Maps Mongo `_id` → `id`
│   │   │
│   │   ├── educationLevel.mapper.ts
│   │   ├── course.mapper.ts
│   │   ├── exam.mapper.ts
│   │   ├── syllabus.mapper.ts
│   │   ├── subject.mapper.ts
│   │   ├── chapter.mapper.ts
│   │   ├── topic.mapper.ts
│   │   ├── competitiveTopicMap.mapper.ts
│   │   ├── question.mapper.ts
│   │   ├── quiz.mapper.ts
│   │   │
│   │   ├── bestBook.mapper.ts
│   │   ├── contactUs.mapper.ts
│   │   ├── geolocation.mapper.ts
│   │   └── user.mapper.ts
│   │
│   └── index.ts
│       └── (optional) re-exports for models
│
├── validation/
│   ├── base.schema.ts
│   │   └── Common Zod fields
│   │
│   ├── educationLevel.schema.ts
│   ├── course.schema.ts
│   ├── exam.schema.ts
│   ├── syllabus.schema.ts
│   ├── subject.schema.ts
│   ├── chapter.schema.ts
│   ├── topic.schema.ts
│   ├── competitiveTopicMap.schema.ts
│   ├── question.schema.ts
│   ├── quiz.schema.ts
│   │
│   ├── bestBook.schema.ts
│   ├── contactUs.schema.ts
│   ├── geolocation.schema.ts
│   └── user.schema.ts
│
├── services/
│   ├── educationLevel.service.ts
│   ├── course.service.ts
│   ├── exam.service.ts
│   ├── syllabus.service.ts
│   ├── subject.service.ts
│   ├── chapter.service.ts
│   ├── topic.service.ts
│   ├── question.service.ts
│   ├── quiz.service.ts
│   │
│   ├── bestBook.service.ts
│   ├── contactUs.service.ts
│   └── user.service.ts
│
├── scripts/
│   ├── init-db.ts
│   │   └── TEMP: forces collection creation
│   │
│   └── seed/
│       ├── geolocation.seed.ts
│       ├── education.seed.ts
│       └── syllabus.seed.ts
│
└── app/ or pages/
    └── api/
        └── (routes use services + validation)

```

Understood. Below is a **clean, one-by-one explanation of every folder and file**, **excluding `app/` and `pages/`**, exactly aligned with a **Next.js + TypeScript + MongoDB (Mongoose)** architecture suitable for **QuestionBankPro**.

I will go **top-down**, **directory by directory**, and explain **purpose, responsibility, and typical contents**.

---

## 1. `src/lib/`

### `src/lib/mongodb.ts`

**Purpose:**
Centralized MongoDB connection using **Mongoose** with **connection caching** (critical for Next.js hot reload and serverless).

**Responsibilities:**

* Read `MONGODB_URI` from env
* Create a single reusable connection
* Prevent multiple connections in dev / API routes

**Contains:**

* Mongoose `connect`
* Global cache (`globalThis.mongoose`)
* No schemas or models

**Used by:**

* All services
* All API routes
* Scripts (`init-db.ts`, seeders)

---

## 2. `src/models/`

This folder defines **domain structure**, split into:

* **Pure TypeScript interfaces**
* **Mongoose schemas**
* **DTO mappers**

---

### 2.1 `src/models/BaseEntity.ts`

**Purpose:**
Base TypeScript interface shared by all entities.

**Defines common fields:**

* `id: string`
* `createdAt: Date`
* `updatedAt: Date`
* `isDeleted: boolean`
* `updatedBy?: string`

**Why it exists:**

* Ensures consistent typing across frontend & backend
* Mongo `_id` never leaks outside

---

### 2.2 `src/models/mongoose/`

This folder contains **ONLY MongoDB schemas** (no business logic).

---

#### 2.2.1 `base.schema.ts`

**Purpose:**
Reusable base fields for all schemas.

**Includes:**

* `isDeleted`
* `updatedBy`
* `timestamps: true`

**Used by:**

* Every other schema via `Schema.add()` or spread

---

#### 2.2.2 Academic hierarchy schemas

Each file = **1 Mongo collection**

| File                       | Responsibility                          |
| -------------------------- | --------------------------------------- |
| `EducationLevel.schema.ts` | Class / Grade (e.g. Class 9, Class 10)  |
| `Course.schema.ts`         | Board or Stream (ICSE, CBSE, JEE, NEET) |
| `Exam.schema.ts`           | Exam type (ICSE Class 9, JEE Main)      |
| `Syllabus.schema.ts`       | Exam syllabus version                   |
| `Subject.schema.ts`        | Physics, Chemistry, Maths               |
| `Chapter.schema.ts`        | Chapters inside a subject               |
| `Topic.schema.ts`          | Topics inside chapters                  |

Each schema:

* References parent via `ObjectId`
* Uses `base.schema.ts`
* Has proper indexes

---

#### 2.2.3 Mapping & content schemas

| File                            | Purpose                                  |
| ------------------------------- | ---------------------------------------- |
| `CompetitiveTopicMap.schema.ts` | Maps school topics ↔ competitive exams   |
| `Question.schema.ts`            | Actual questions (MCQ, subjective, etc.) |
| `Quiz.schema.ts`                | Quiz metadata (not questions themselves) |

---

#### 2.2.4 Other schemas

| File                            | Purpose                            |
| ------------------------------- | ---------------------------------- |
| `BestBook.schema.ts`            | Recommended books per topic/exam   |
| `ContactUs.schema.ts`           | User contact / enquiry submissions |
| `GeolocationState.schema.ts`    | Indian states                      |
| `GeolocationDistrict.schema.ts` | Districts linked to states         |
| `ResetToken.schema.ts`          | Password reset tokens              |
| `User.schema.ts`                | Application users                  |

---

### 2.3 `src/models/dto/`

**Purpose:**
Convert **Mongo documents → clean API response objects**.

Mongo uses `_id`, frontend uses `id`. DTOs fix that.

---

#### 2.3.1 `base.mapper.ts`

**Responsibility:**

* Convert `_id` → `id`
* Remove `__v`
* Normalize timestamps

Used by **all other mappers**.

---

#### 2.3.2 Entity-specific mappers

Each mapper:

* Takes a Mongoose document
* Returns a clean typed object

| Mapper                          | Maps             |
| ------------------------------- | ---------------- |
| `educationLevel.mapper.ts`      | EducationLevel   |
| `course.mapper.ts`              | Course           |
| `exam.mapper.ts`                | Exam             |
| `syllabus.mapper.ts`            | Syllabus         |
| `subject.mapper.ts`             | Subject          |
| `chapter.mapper.ts`             | Chapter          |
| `topic.mapper.ts`               | Topic            |
| `competitiveTopicMap.mapper.ts` | Topic mappings   |
| `question.mapper.ts`            | Questions        |
| `quiz.mapper.ts`                | Quiz             |
| `bestBook.mapper.ts`            | BestBook         |
| `contactUs.mapper.ts`           | Contact          |
| `geolocation.mapper.ts`         | State & District |
| `user.mapper.ts`                | User             |

---

### 2.4 `src/models/index.ts`

**Purpose (Optional):**

* Central export file
* Cleaner imports

Example:

```ts
export * from "./mongoose/Question.schema";
export * from "./dto/question.mapper";
```

---

## 3. `src/validation/`

**Purpose:**
Request validation using **Zod**.

Ensures:

* API safety
* No invalid DB writes
* Shared validation between API & services

---

### 3.1 `base.schema.ts`

**Defines:**

* `id`
* pagination
* soft delete flags
* common optional fields

Used by all entity schemas.

---

### 3.2 Entity validation schemas

Each file validates **request payloads**, not DB schema.

| File                            | Validates                     |
| ------------------------------- | ----------------------------- |
| `educationLevel.schema.ts`      | Create/update education level |
| `course.schema.ts`              | Course payload                |
| `exam.schema.ts`                | Exam payload                  |
| `syllabus.schema.ts`            | Syllabus payload              |
| `subject.schema.ts`             | Subject payload               |
| `chapter.schema.ts`             | Chapter payload               |
| `topic.schema.ts`               | Topic payload                 |
| `competitiveTopicMap.schema.ts` | Topic mapping                 |
| `question.schema.ts`            | Question creation             |
| `quiz.schema.ts`                | Quiz creation                 |
| `bestBook.schema.ts`            | Book recommendations          |
| `contactUs.schema.ts`           | Contact form                  |
| `geolocation.schema.ts`         | State/District                |
| `user.schema.ts`                | User input                    |

---

## 4. `src/services/`

**Purpose:**
Business logic layer (NO HTTP, NO validation).

Services:

* Talk to MongoDB
* Use schemas + mappers
* Return clean DTOs

---

### Core academic services

| Service                     | Responsibility        |
| --------------------------- | --------------------- |
| `educationLevel.service.ts` | CRUD education levels |
| `course.service.ts`         | CRUD courses          |
| `exam.service.ts`           | CRUD exams            |
| `syllabus.service.ts`       | Manage syllabus       |
| `subject.service.ts`        | Subject logic         |
| `chapter.service.ts`        | Chapter logic         |
| `topic.service.ts`          | Topic logic           |
| `question.service.ts`       | Question CRUD         |
| `quiz.service.ts`           | Quiz creation & fetch |

---

### Utility services

| Service                | Purpose               |
| ---------------------- | --------------------- |
| `bestBook.service.ts`  | Recommended books     |
| `contactUs.service.ts` | Save contact requests |
| `user.service.ts`      | User management       |

---

## 5. `src/scripts/`

Scripts are **NOT part of runtime**.

---

### 5.1 `init-db.ts`

**Purpose:**

* Force MongoDB to create collections
* Ensure indexes exist
* Used during setup or CI

Runs manually:

```bash
npx ts-node src/scripts/init-db.ts
```

---

### 5.2 `src/scripts/seed/`

**Purpose:**
Insert initial reference data.

| File                  | Seeds              |
| --------------------- | ------------------ |
| `geolocation.seed.ts` | States & districts |
| `education.seed.ts`   | Class 6–12         |
| `syllabus.seed.ts`    | Initial syllabus   |

---

## Final Architecture Principle

* **lib** → infrastructure
* **models** → structure
* **validation** → safety
* **services** → business logic
* **scripts** → setup only
