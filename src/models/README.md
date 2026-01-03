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
 ├── models/
 │   ├── dto/
 │   │   ├── base.mapper.ts
 │   │   └── exam.mapper.ts
 │   └── mongoose/
 │       └── helpers/
 │           └── softDelete.ts
 ├── validation/
 │   ├── base.schema.ts
 │   └── exam.schema.ts
```



```

src/
 ├── models/
 │   ├── mongoose/
 │   │   ├── BestBook.schema.ts
 │   │   ├── ContactUs.schema.ts
 │   │   ├── GeolocationState.schema.ts
 │   │   ├── GeolocationDistrict.schema.ts
 │   │   ├── ResetToken.schema.ts
 │   │   └── User.schema.ts
 │   └── dto/
 │       ├── bestBook.mapper.ts
 │       ├── contactUs.mapper.ts
 │       ├── geolocation.mapper.ts
 │       ├── user.mapper.ts
 └── validation/
     ├── bestBook.schema.ts
     ├── contactUs.schema.ts
     ├── geolocation.schema.ts
     └── user.schema.ts

```