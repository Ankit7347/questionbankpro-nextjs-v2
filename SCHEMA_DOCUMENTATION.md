# Schema Documentation for Previous Papers & Solved Papers

## Overview
This document outlines the comprehensive MongoDB schemas for **Previous Papers** and **Solved Papers** modules. Both schemas are designed to be future-proof with all necessary fields for current functionality and anticipated growth.

---

## 1. PreviousPaper.schema.ts

### Purpose
Stores examination papers from previous years/sessions with metadata, verification status, and access controls.

### Fields Breakdown

#### **Primary Identifiers**
- `title` (String, Required): Display name of the paper
- `slug` (String, Required, Unique): URL-friendly identifier
- `paperCode` (String, Required): Exam code (e.g., CS302, MAT401)

#### **Relations**
- `examId` (ObjectId, Required): Reference to Exam
- `subExamId` (ObjectId): Reference to SubExam
- `courseId` (ObjectId): Reference to Course
- `subjectId` (ObjectId, Required): Reference to Subject
- `chapterId` (ObjectId): Reference to Chapter (future use)

#### **Paper Details**
- `year` (Number, Required): Examination year
- `session` (String, Required): Spring/Summer/Fall/Winter or Monthly
- `duration` (Number): Paper duration in minutes
- `totalMarks` (Number): Maximum marks for the paper

#### **Content Files**
- `paperUrl` (String, Required): S3/CDN URL to PDF
- `markingSchemeUrl` (String): URL to marking scheme
- `solutionUrl` (String): URL to solution document
- `additionalResourcesUrls` (Array): Supporting materials

#### **Quality & Rights**
- `isVerified` (Boolean): Verified by admin/expert
- `verifiedBy` (String): UUID of verifying user
- `verifiedAt` (Date): Verification timestamp
- `isCopyrighted` (Boolean): Copyright status
- `copyrightHolder` (String): Copyright owner name
- `copyrightLicense` (String): CC_BY, CC_BY_SA, PROPRIETARY, etc.

#### **Access Control**
- `visibility` (String): PUBLIC / INTERNAL / PREMIUM / RESTRICTED
- `isPremium` (Boolean): Premium content flag
- `accessLevel` (String): FREE / PREMIUM / BETA / INTERNAL
- `validFrom` & `validTo` (Date): Availability window

#### **Engagement & Analytics**
- `views` (Number): Total views count
- `downloads` (Number): Download count
- `prints` (Number): Print count
- `shares` (Number): Share count
- `averageRating` (Number, 0-5): Average user rating
- `totalRatings` (Number): Total ratings received
- `totalComments` (Number): Comment count
- `totalBookmarks` (Number): Bookmark count

#### **Administrative**
- `status` (String): DRAFT / PUBLISHED / ARCHIVED / DELETED
- `priority` (Number): Display priority (higher = more prominent)
- `displayOrder` (Number): Custom display order
- `createdBy` (String, Required): Creator UUID
- `publishedAt` (Date): Publication date
- `lastSyncedAt` (Date): Last update from source

#### **SEO & Discoverability**
- `metaTitle`, `metaDescription`: SEO tags
- `ogImageUrl`: Open Graph image for sharing
- `keywords` (Array): Search keywords
- `tags` (Array): Categorization tags
- `searchText` (String): Denormalized search field for full-text search

#### **Related Content**
- `relatedPaperIds` (Array of ObjectId): Links to similar papers

#### **Base Fields** (from BaseSchema)
- `createdAt`, `updatedAt` (Date): Timestamps
- `isDeleted` (Boolean): Soft delete flag
- `updatedBy` (String): UUID of last updater

### Indexes
- `examId + year + session`: Common filtering
- `subjectId + year`: Subject-year browse
- `courseId + year`: Course-based access
- `status + visibility`: Admin filtering
- `createdAt` (desc): Recent papers
- `views` (desc): Trending papers

### Use Cases
- Display papers by year (year index)
- Filter by subject (subjectId index)
- Find recent additions (createdAt)
- Track engagement metrics (views, downloads)
- Content moderation (status, isVerified)

---

## 2. SolvedPaper.schema.ts

### Purpose
Stores expert-created solutions with step-by-step explanations, quality ratings, and comprehensive engagement tracking.

### Fields Breakdown

#### **Primary Identifiers**
- `title` (String, Required): Solution title
- `slug` (String, Required, Unique): URL-friendly identifier

#### **Relations**
- `examId` (ObjectId, Required): Reference to Exam
- `subExamId` (ObjectId): Reference to SubExam
- `courseId` (ObjectId): Reference to Course
- `subjectId` (ObjectId, Required): Reference to Subject
- `chapterId` (ObjectId): Reference to Chapter
- `previousPaperId` (ObjectId): Link to original paper

#### **Paper Details**
- `year` (Number, Required): Exam year
- `session` (String): Exam session
- `questionCount` (Number, Required): Number of questions
- `totalMarks` (Number): Maximum marks
- `estimatedDuration` (Number): Time to solve (minutes)
- `difficulty` (String, Required): Easy / Medium / Hard / Mixed

#### **Content & Solutions**
- `shortDescription` (i18n Object): Brief overview
- `fullDescription` (i18n Object): Detailed description
- `solutions` (Array of SolutionStep):
  - `stepNumber` (Number): Sequential order
  - `title` (String): Step label
  - `body` (String): Step content (supports LaTeX: $...$ or $$...$$)
  - `hasLatex` (Boolean): LaTeX indicator
  - `conceptTags` (Array): Related concepts
  - `isVerified` (Boolean): Step verification
  - `difficulty` (String): Step difficulty level
  - `alternativeExplanations` (Array): Multiple approaches
  - `commonMistakes` (Array): Typical errors
  - `relatedTopicIds` (Array of ObjectId): Topic references
  - `helpfulCount`, `unhelpfulCount`: User feedback counts

#### **Quality & Verification**
- `isVerified` (Boolean): Solution verified by expert
- `verifiedBy` (String): Verifying user UUID
- `verifiedAt` (Date): Verification timestamp
- `solutionQuality` (String): DRAFT / BASIC / COMPLETE / EXPERT_VERIFIED
- `creatorExpertiseLevel` (String): COMMUNITY / CONTRIBUTOR / EXPERT / VERIFIED_EXPERT

#### **Creator Information**
- `createdBy` (String, Required): Expert UUID
- `creatorExpertiseLevel` (String): Creator credentials

#### **Access Control**
- `visibility` (String): PUBLIC / INTERNAL / PREMIUM / RESTRICTED
- `isPremium` (Boolean): Premium content
- `accessLevel` (String): FREE / PREMIUM / BETA / INTERNAL
- `validFrom` & `validTo` (Date): Availability window

#### **Engagement & Analytics**
- `views` (Number): View count
- `downloads` (Number): Download count
- `prints` (Number): Print count
- `shares` (Number): Share count
- `averageRating` (Number, 0-5): Solution rating
- `totalRatings` (Number): Number of ratings
- `totalComments` (Number): Comment count
- `totalLikes` (Number): Like count
- `totalBookmarks` (Number): Bookmark count
- `averageTimeSpent` (Number): Avg reading time (seconds)
- `completionRate` (Number, 0-100): % users completing it

#### **Administrative**
- `status` (String): DRAFT / PUBLISHED / FEATURED / ARCHIVED / DELETED
- `isFeatured` (Boolean): Featured on homepage
- `priority` (Number): Display priority
- `displayOrder` (Number): Custom ordering
- `publishedAt` (Date): Publication date
- `featuredAt` (Date): Featured date

#### **SEO & Discoverability**
- `metaTitle`, `metaDescription`: SEO tags
- `ogImageUrl`: Share image
- `canonicalUrl`: SEO canonical URL
- `keywords` (Array): Search terms
- `tags` (Array): Categories
- `searchText` (String): Full-text search field

#### **Accessibility**
- `hasEnglishSolution` (Boolean): English version available
- `hasHindiSolution` (Boolean): Hindi version available
- `hasVideoSolution` (Boolean): Video explanation exists
- `videoUrl` (String): Video link
- `topicsCosineCovered` (Array): Topics covered with names

#### **Community Features**
- `relatedPaperIds` (Array): Related solutions
- `communityNotes` (Array): User annotations
  - `userId` (String)
  - `note` (String)
  - `createdAt` (Date)

#### **Base Fields**
- `createdAt`, `updatedAt` (Date): Timestamps
- `isDeleted` (Boolean): Soft delete
- `updatedBy` (String): Last updater UUID

### Indexes
- `examId + year`: Year browsing
- `subjectId + year`: Subject filtering
- `createdBy + status`: Creator's drafts
- `status + visibility`: Publishing control
- `createdAt` (desc): Recent solutions
- `views` (desc): Trending solutions
- `totalRatings` (desc): Best-rated solutions
- `isFeatured + publishedAt` (desc): Featured section

### Use Cases
- Display trending papers (views index)
- Best-rated solutions (totalRatings)
- Expert contributions (createdBy index)
- Quality filtering (solutionQuality)
- Multi-language support (hasEnglishSolution, hasHindiSolution)
- Featured section (isFeatured)

---

## Comparison with Current Page Requirements

### Previous Papers Page (page.tsx)
✅ Current fields used:
- `year`, `paperCount`, `isActive` → Now `year`, `views`, `status`
- `subject`, `code`, `year`, `session`, `dateAdded` → All present
- `totalPapers`, `totalDownloads`, `activeYears` → Can aggregate from DB

✨ Future-proof additions:
- Copyright tracking (isCopyrighted, copyrightLicense)
- Rating system (averageRating, totalRatings)
- Premium support (isPremium, accessLevel)
- Multi-language descriptions
- SEO optimization
- Engagement analytics (shares, comments)

### Solved Papers Page (page.tsx)
✅ Current fields used:
- `id`, `title`, `subject`, `year`, `difficulty`, `views`, `isVerified`, `isPremium` → All present
- `shortDescription`, `questionCount` → All present
- `sampleSteps` (SolutionStep) → Fully implemented

✨ Future-proof additions:
- Solution quality levels (DRAFT, BASIC, COMPLETE, EXPERT_VERIFIED)
- Multi-language solutions (English, Hindi)
- Video solutions support
- Alternative explanations per step
- Common mistakes tracking
- Learning analytics (timeSpent, completionRate)
- Community notes
- Featured papers capability
- Expert verification badge system

---

## Migration Notes

### Creating Indexes
Run these after schema creation:
```javascript
// Previous Papers
db.previous_papers.createIndex({ examId: 1, year: 1, session: 1 })
db.previous_papers.createIndex({ subjectId: 1, year: 1 })
db.previous_papers.createIndex({ createdAt: -1 })
db.previous_papers.createIndex({ views: -1 })

// Solved Papers
db.solved_papers.createIndex({ examId: 1, year: 1 })
db.solved_papers.createIndex({ subjectId: 1, year: 1 })
db.solved_papers.createIndex({ createdBy: 1, status: 1 })
db.solved_papers.createIndex({ views: -1 })
db.solved_papers.createIndex({ totalRatings: -1 })
```

### Sample Data Structure
```javascript
// Previous Paper
{
  title: "Mathematics - Final Exam 2024",
  slug: "mathematics-final-exam-2024",
  paperCode: "MAT401",
  year: 2024,
  session: "Summer",
  examId: ObjectId("..."),
  subjectId: ObjectId("..."),
  paperUrl: "s3://bucket/papers/mat401-2024.pdf",
  difficulty: "Hard",
  isVerified: true,
  views: 1250,
  downloads: 450
}

// Solved Paper
{
  title: "Advanced Mathematics Complete Solutions 2024",
  slug: "advanced-math-solutions-2024",
  year: 2024,
  questionCount: 50,
  difficulty: "Hard",
  examId: ObjectId("..."),
  subjectId: ObjectId("..."),
  isVerified: true,
  isPremium: true,
  solutions: [
    {
      stepNumber: 1,
      title: "Question 1 - Linear Equations",
      body: "Given $ax + b = c$, solve for $x$...",
      hasLatex: true,
      conceptTags: ["linear-equations", "algebra"]
    }
  ],
  createdBy: "expert-user-uuid",
  views: 2300,
  averageRating: 4.8
}
```

---

## Best Practices

1. **Always use slug for URLs** - Never expose MongoDB ObjectId in URLs
2. **Soft delete with isDeleted** - Don't physically delete for audit trails
3. **Index frequently searched fields** - Add new indexes as query patterns emerge
4. **Denormalize searchText** - Store concatenated searchable content for better FTS
5. **Update updatedBy and timestamp** - Track changes for audit
6. **Use transactions for multi-document operations** - When updating related records
7. **Cache aggregations** - Counts (totalComments, views) are written frequently
8. **Handle LaTeX in solutions** - Client must render with KaTeX/MathJax

---

## Future Enhancements

- **Variants**: Multiple versions of same paper (encrypted, printed, etc.)
- **Feedback System**: Detailed error reports per solution
- **AI Analysis**: Difficulty score computed by ML
- **Recommendations**: Collaborative filtering for personalization
- **Translations**: Full multi-language support
- **Whiteboard**: Handwritten solutions capture
- **Discussion Threads**: Per-step conversations
- **Performance Tracking**: User attempt history linking

