// # Quiz System Architecture

## Overview

The Quiz system has been completely redesigned to support a hierarchical structure:

```
Exam → SubExam → Subject → Chapter → Topic
              ↓
           Quiz
             ↓
       QuizSubmission (user attempts)
```

## Schemas

### 1. Quiz.schema.ts

**Purpose**: Core quiz definition linked at all levels (Exam to Topic)

**Key Fields**:
- `examId`, `subExamId`:  Parent exam/subexam
- `subjectId`, `chapterId`, `topicId`: Optional, depends on quiz type
- `quizType`: "topic" | "chapter" | "subject" | "full_syllabus" | "mock_test"
- `questionIds`: Array of question ObjectIds
- `totalQuestions`, `durationMinutes`, `totalMarks`: Metadata
- `marksPerQuestion`, `negativeMarking`: Scoring config
- `isPublished`, `publishedAt`, `startDate`, `endDate`: Availability control
- `allowMultipleAttempts`: Whether user can retry

**Indexes**:
```
{ examId: 1, subExamId: 1 }
{ subExamId: 1, subjectId: 1, chapterId: 1, topicId: 1 }
{ isPublished: 1, publishedAt: -1 }
```

### 2. QuizSubmission.schema.ts

**Purpose**: Track user quiz attempts and scores

**Key Fields**:
- `userId`, `quizId`: User + Quiz reference
- `attemptNumber`: Which attempt (1st, 2nd, etc.)
- `startedAt`, `submittedAt`: Timestamps
- `timeSpentSeconds`: Duration spent
- `answers[]`: Array of answered questions with marks
- `totalMarksObtained`, `totalMarksMaximum`: Final score
- `percentageScore`: Calculated percentage (0-100)
- `correctAnswersCount`, `wrongAnswersCount`, `unattemptedCount`: Breakdown
- `status`: "in_progress" | "submitted" | "evaluated"

**Indexes**:
```
{ userId: 1, quizId: 1 }
{ userId: 1, status: 1 }
{ quizId: 1, status: 1 }
{ submittedAt: -1 }
```

## Services

### quiz.service.ts

Functions:
```typescript
getQuizzesBySubExam(subExamId)        // Get all published quizzes
getQuizzesByType(subExamId, type, filterIds)  // Get by level
getQuizById(quizId)                   // Fetch single quiz with questions
createQuiz(payload)                   // Admin: create
updateQuiz(quizId, updates)           // Admin: update
```

### quizSubmission.service.ts

Functions:
```typescript
startQuizAttempt(userId, quizId, totalMarks)
submitQuizAnswers(submissionId, answers)
evaluateSubmission(submissionId)     // Auto-grade MCQs
getUserSubmissions(userId)            // All user's submissions
getQuizSubmissions(quizId)            // All submissions for a quiz
getSubmission(submissionId)           // Fetch one submission
```

## API Endpoints

### GET /api/dashboard/quiz
**Description**: List all quizzes for user's subexam + their submissions
**Auth**: Required (session/header)
**Response**:
```json
{
  "quizzes": [...],
  "submissions": [...],
  "stats": {
    "totalQuizzes": 15,
    "totalAttempts": 8,
    "averageScore": 72.5,
    "lastAttempt": "2025-02-14T10:30:00Z",
    "totalEvaluated": 8
  }
}
```

### POST /api/dashboard/quiz/[quizId]/start
**Description**: Start a new quiz attempt
**Auth**: Required
**Response**: QuizSubmission DTO with `status: "in_progress"`

### POST /api/dashboard/quiz/submission/[submissionId]/submit
**Description**: Submit answers and auto-evaluate
**Auth**: Required
**Body**:
```json
{
  "answers": [
    { "questionId": "...", "selectedOptionId": "..." },
    { "questionId": "...", "answerText": "..." }
  ]
}
```
**Response**: Evaluated QuizSubmission with scores

### GET /api/dashboard/quiz/submission/[submissionId]
**Description**: Fetch a specific submission result
**Auth**: Required
**Response**: QuizSubmission DTO

## DTOs

### QuizDTO
Maps Quiz.schema → client format
- All fields camelCase
- ObjectIds converted to strings
- Dates as ISO strings

### QuizSubmissionDTO  
Maps QuizSubmission.schema → client format
- Answers array with proper formatting
- Score calculations included
- Status and timestamps

## Usage Flow

### 1. User Starts a Quiz
```javascript
// Fetch available quizzes
GET /api/dashboard/quiz

// Start quiz attempt
POST /api/dashboard/quiz/63abc123/start
// Response: { id: "submissionId", status: "in_progress", ... }
```

### 2. User Answers Questions
```javascript
// UI tracks selected options/answers in memory
// On time limit or manual submit, send:
POST /api/dashboard/quiz/submission/submissionId/submit
Body: { answers: [...] }

// Response: { status: "evaluated", percentageScore: 75, ... }
```

### 3. User Reviews Results
```javascript
GET /api/dashboard/quiz/submission/submissionId
// Shows full breakdown: correct, wrong, unattempted, marks
```

## Dashboard Integration

The `/dashboard/quiz` page now displays:
- **Available Quizzes** (by type: topic, chapter, subject, full)
- **Recent Submissions** (with scores and dates)
- **Performance Stats** (total, average, last attempt)

## Admin Operations (Future)

```typescript
// Create topic-level quiz
POST /api/admin/quiz
Body: {
  title: { en: "Thermodynamics Basics" },
  quizType: "topic",
  subExamId: "...",
  subjectId: "...",
  chapterId: "...",
  topicId: "...",
  questionIds: ["...", "...", "..."],
  totalMarks: 10,
  durationMinutes: 15
}

// Publish quiz
PATCH /api/admin/quiz/quizId
Body: { isPublished: true, publishedAt: "2025-02-14T..." }
```

## Key Details

### Negative Marking
If `negativeMarking.enabled = true`:
- Wrong answer deducts `marksPerWrongAnswer`
- Only applies during evaluation in `evaluateSubmission()`

### Multiple Attempts
- If `allowMultipleAttempts = false` → Only 1 attempt per user
- If `true` → Unlimited; `attemptNumber` increments
- Dashboard shows best score or all attempts

### Time Tracking
`timeSpentSeconds` = submittedAt - startedAt (in seconds)
- Useful for analytics and identifying speed vs accuracy

### Question Population
Quiz.questionIds are referenced via populate()
- During evaluation, question.marks are used per answer
- Missing question marks default to 1

## Performance Considerations

1. **Quizzes are published separately** → Unpublished quizzes ignored in queries
2. **Answers are evaluated on-demand** → No batch background jobs needed (yet)
3. **Indexes on userId + status** → Fast submission lookup per user
4. **No denormalization**: All data source of truth in database

## Future Enhancements

- [ ] Batch evaluation for large quizzes
- [ ] Leaderboards via aggregation pipeline
- [ ] Timed auto-submit (timer expires)
- [ ] Partial credit for subjective questions
- [ ] Analytics: most-missed questions, time averages
- [ ] Randomized question order per attempt
