# Quiz System Architecture

## Overview

The Quiz system supports multilevel assessment grouped by hierarchy:

```
Exam → SubExam → Subject → Chapter → Topic
                    ↓
                 Quiz (quizType determines level)
                    ↓
            QuizSubmission (user attempts)
```

**Quiz Types:**
- `topic` - Single topic practice
- `chapter` - Full chapter assessment
- `subject` - Complete subject exam
- `full_syllabus` - Entire syllabus mock
- `mock_test` - Full exam simulation

## Schemas

### 1. Quiz.schema.ts

**Purpose**: Core quiz definition - tracks assessment metadata and hierarchy

**Key Fields**:
- `title` (en/hi): Quiz title
- `description` (en/hi): Quiz description
- `quizType`: Type of quiz (topic|chapter|subject|full_syllabus|mock_test)
- `examId` (ref): Parent exam
- `subExamId` (ref): Parent subexam (required)
- `subjectId` (ref, optional): Subject (required if topic/chapter/subject quiz)
- `chapterId` (ref, optional): Chapter (required if topic/chapter quiz)
- `topicId` (ref, optional): Topic (required if topic quiz)
- `questionCount`: Number of questions in quiz
- `timeLimit` (minutes): Time allowed to complete
- `shuffleQuestions` (boolean): Whether to randomize question order
- `passingScore` (%): Minimum percentage to pass
- `isPublished` (boolean): Whether quiz is live
- `isDeleted` (boolean): Soft delete flag
- `createdBy` (optional): User UUID who created
- `updatedBy` (optional): User UUID who updated

**Indexes**:
```typescript
{ examId: 1, quizType: 1 }              // List quizzes by exam
{ subExamId: 1 }                        // Find all quizzes for subexam
{ isPublished: 1 }                      // Find published quizzes
```

### 2. Question.schema.ts

**Purpose**: Individual assessment items linked to topics

**Key Fields**:
- `content` (en/hi): Question text (HTML)
- `type` (MCQ|SUBJECTIVE|TRUE_FALSE): Question format
- `options` (array): For MCQ - [{text (en/hi), isCorrect}]
- `explanation` (en/hi): Explanation for answer
- `marks`: Points for this question
- `difficulty` (Easy|Medium|Hard): Difficulty level
- `displayOrder`: Position in quiz
- `subjectId` (ref): Subject
- `chapterId` (ref): Chapter
- `topicId` (ref): Topic (required - rule: one topic per question)
- `images` (array): URLs to images

**Key Rule:** Each question belongs to exactly ONE topic.

---

### 3. QuizSubmission.schema.ts

**Purpose**: Track user quiz attempts and performance

**Key Fields**:
- `userId` (ref): User taking quiz
- `quizId` (ref): Quiz being taken
- `attemptNumber` (integer): Attempt number (1st, 2nd, 3rd...)
- `startedAt` (Date): When user started
- `submittedAt` (Date): When user submitted
- `score` (number): Points obtained
- `totalMarks` (number): Total possible points
- `answers` (array): [{questionId, selectedAnswer, isCorrect}]
- `timeSpent` (seconds): Duration from start to submit
- `isDeleted`, `createdAt`, `updatedAt`: Base fields

**Calculation Fields** (derived on submit):
- `percentageScore = (score / totalMarks) * 100`
- `passStatus = percentageScore >= quiz.passingScore`

**Indexes**:
```typescript
{ userId: 1, quizId: 1 }    // Find user's submissions for a quiz
{ userId: 1 }               // All submissions by user
{ quizId: 1 }               // All submissions for a quiz
{ submittedAt: -1 }         // Recent submissions
```

## Services

### quiz.service.ts

Typical functions (add via services/server/quiz.server.ts):
```typescript
listQuizzesByExam(examId, lang)         // Get all published quizzes for exam
listQuizzesBySubExam(subExamId, lang)   // Get quizzes by subexam
listQuizzesByType(subExamId, type, lang) // Filter by quizType
getQuizById(quizId, lang)                // Fetch quiz details
createQuiz(payload)                      // Admin: create
updateQuiz(quizId, payload)              // Admin: update
```

### quizSubmission.service.ts

Typical functions (add via services/server/quizSubmission.server.ts):
```typescript
startQuiz(userUuid, quizId)              // Create new QuizSubmission with status in_progress
submitQuiz(submissionId, answers)        // Submit answers + auto-evaluate MCQs
getSubmission(submissionId, userUuid)    // Fetch one submission (security check)
getUserSubmissions(userUuid)              // All submissions for user
getQuizSubmissions(quizId)               // All submissions for a quiz
getUserQuizStats(userUuid, quizId)       // Stats for user on specific quiz
```

**Note:** Mappers apply language resolution (resolveI18nField) via getCurrentLang()

## API Endpoints (Typical)

### GET /api/dashboard/quiz
**Description**: List available quizzes and user's submission history
**Auth**: Required (session UUID)
**Query Params:**
- `quizType` (optional): Filter by type (topic|chapter|subject|full_syllabus|mock_test)
- `subExamId` (optional): Filter by subexam

**Response**:
```json
{
  "availableQuizzes": [
    { "id": "quiz123", "title": "Newton's Laws", "quizType": "topic", "timeLimit": 15, "isPublished": true }
  ],
  "submissions": [
    { "id": "submission456", "quizId": "quiz123", "score": 8, "totalMarks": 10, "percentageScore": 80 }
  ],
  "stats": {
    "totalAttempts": 5,
    "averageScore": 75,
    "bestScore": 90
  }
}
```

### POST /api/dashboard/quiz/[quizId]/start
**Description**: Start a new quiz attempt
**Auth**: Required
**Response**: QuizSubmissionDTO
```json
{
  "id": "submission789",
  "quizId": "quiz123",
  "attemptNumber": 1,
  "startedAt": "2025-02-19T10:00:00Z",
  "timeLimit": 15
}
```

### POST /api/dashboard/quiz/submission/[submissionId]/submit
**Description**: Submit answers and auto-evaluate
**Auth**: Required
**Body**:
```json
{
  "answers": [
    { "questionId": "q1", "selectedOption": "A" },
    { "questionId": "q2", "selectedOption": "C" },
    { "questionId": "q3", "answerText": "Sample answer" }
  ]
}
```
**Response**: Evaluated QuizSubmissionDTO
```json
{
  "id": "submission789",
  "score": 7,
  "totalMarks": 10,
  "percentageScore": 70,
  "passingScore": 60,
  "passed": true,
  "submittedAt": "2025-02-19T10:15:00Z",
  "timeSpent": 900
}
```

### GET /api/dashboard/quiz/submission/[submissionId]
**Description**: Fetch submission details with answers and explanation
**Auth**: Required
**Response**: QuizSubmissionDTO with detailed answers

## DTOs

### QuizDTO
**Mapper:** `src/models/dto/quiz.mapper.ts`

Maps Quiz.schema → client format:
```typescript
interface QuizDTO {
  id: string;
  title: string;                    // Resolved via resolveI18nField(quiz.title, lang)
  description: string;              // Resolved
  quizType: string;
  questionCount: number;
  timeLimit: number;
  passingScore: number;
  shuffleQuestions: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### QuizSubmissionDTO
**Mapper:** `src/models/dto/quizSubmission.mapper.ts`

Maps QuizSubmission.schema → client format:
```typescript
interface QuizSubmissionDTO {
  id: string;
  quizId: string;
  userId: string;
  attemptNumber: number;
  startedAt: Date;
  submittedAt: Date | null;
  score: number;
  totalMarks: number;
  percentageScore: number;          // Calculated: (score/totalMarks)*100
  passingScore: number;             // From quiz
  passed: boolean;                  // percentageScore >= passingScore
  timeSpent: number;                // In seconds
  answers: Array<{                  // Detailed answer breakdown
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    marksObtained: number;
  }>;
}
```

## Usage Flow

### 1. User Views Available Quizzes
```typescript
// Frontend calls:
GET /api/dashboard/quiz?quizType=topic

// Response contains:
// - availableQuizzes: List of published quizzes
// - submissions: User's previous submission history
// - stats: Average score, total attempts, etc.
```

### 2. User Starts a Quiz
```typescript
// Frontend calls:
POST /api/dashboard/quiz/[quizId]/start

// Backend:
// - Creates QuizSubmission with status "in_progress"
// - Returns submission ID and time limit
// - Frontend starts timer
```

### 3. User Answers Questions
```typescript
// Frontend:
// - Displays questions from quiz (fetched separately or embedded)
// - Tracks selected answers in memory
// - Shows time remaining

// On submit (manual or time limit):
POST /api/dashboard/quiz/submission/[submissionId]/submit
Body: {
  answers: [
    { questionId: "q1", selectedOption: "A", answerText: "" },
    { questionId: "q2", selectedOption: "", answerText: "Answer here" }
  ]
}

// Backend:
// - Auto-evaluates MCQs
// - Stores answers in QuizSubmission
// - Returns score, percentage, pass status
```

### 4. User Reviews Results
```typescript
// Frontend calls:
GET /api/dashboard/quiz/submission/[submissionId]

// Response shows:
// - Detailed scores
// - Correct/incorrect answers with explanations
// - Performance breakdown
```

## Dashboard Integration

The `/dashboard` page quiz section displays:
- **Available Quizzes** (filtered by type: topic, chapter, subject, full_syllabus, mock_test)
- **Recent Submissions** (with scores, dates, and pass status)
- **Performance Stats** (total attempts, average score, best score)
- **Next Quiz to Attempt** (suggested based on learning progress)

## Admin Operations

**Create Quiz:**
```typescript
POST /api/admin/quiz
Body: {
  title: { en: "Thermodynamics Basics", hi: "थर्मोडायनामिक्स ..." },
  description: { en: "... " },
  quizType: "topic",           // topic | chapter | subject | full_syllabus | mock_test
  examId: "exam123",
  subExamId: "subexam456",
  subjectId: "subject789",      // Required for topic/chapter/subject quiz
  chapterId: "chapter101",      // Required for topic/chapter quiz
  topicId: "topic202",          // Required for topic quiz
  questionCount: 10,
  timeLimit: 15,                // Minutes
  passingScore: 60,             // Percentage
  shuffleQuestions: true,
  isPublished: false
}
```

**Publish Quiz:**
```typescript
PATCH /api/admin/quiz/quizId
Body: { isPublished: true }
```

**Note:** Questions are created separately via question.service.ts and linked via questionId references during quiz submission evaluation.

## Key Implementation Details

### Multilingual Support
- `title` and `description` fields are `{ en: string; hi?: string }`
- In DTOs, resolved via `resolveI18nField(quiz.title, lang)` where `lang = getCurrentLang()`
- Mappers apply this transformation automatically

### Quiz Types & Levels
- **topic:** Single topic quiz — must have `topicId`
- **chapter:** Chapter assessment — must have `chapterId`
- **subject:** Subject exam — must have `subjectId`
- **full_syllabus:** Complete syllabus mock — covers all subjects
- **mock_test:** Full exam simulation — same structure as full_syllabus

### Scoring
```typescript
// During submission evaluation:
let totalScore = 0;
for (const questionId of submittedAnswers) {
  const question = await Question.findById(questionId);
  if (isCorrectAnswer(submittedAnswer, question)) {
    totalScore += question.marks;  // Default: 1 if not set
  }
}

quizSubmission.score = totalScore;
quizSubmission.percentageScore = (totalScore / totalMarks) * 100;
quizSubmission.passed = percentageScore >= quiz.passingScore;
```

### Time Tracking
```typescript
timeSpent = (submittedAt - startedAt) / 1000  // Convert ms to seconds
```
Useful for analytics: identify speed vs accuracy correlations

### Multilevel Querying
```typescript
// Get all topic quizzes for a subject:
Quiz.find({ 
  isPublished: true, 
  quizType: 'topic',
  subjectId: subjectId
})

// Get all quizzes for a subexam (any level):
Quiz.find({ 
  isPublished: true, 
  subExamId: subExamId 
}).sort({ createdAt: -1 })
```

### Question Relationship
- Questions are independent documents linked by ID
- Quiz stores `questionCount` (metadata only)
- Actual question list fetched on quiz view
- During submission, question.marks used for evaluation

## Performance Notes

1. **Indexing:** `{ examId: 1, quizType: 1 }` speeds up filtered queries
2. **Soft deletes:** `isDeleted` flag ensures data preservation
3. **On-demand evaluation:** No batch jobs; answers evaluated on submit
4. **Language resolution:** Applied in mappers, not in queries
5. **Activity audit:** `createdBy`, `updatedBy` track ownership

## Future Enhancements

- [ ] Negative marking for wrong answers
- [ ] Allow multiple attempts with best score tracking
- [ ] Randomized question order per attempt
- [ ] Timed auto-submit (timer expires)
- [ ] Partial credit for subjective questions
- [ ] Analytics: most-missed questions, time averages
- [ ] Leaderboards via aggregation pipeline
- [ ] Question bank management UI
