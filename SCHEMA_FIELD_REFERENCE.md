# Field Mapping & Quick Reference Guide

## Previous Papers - Schema Field Reference

### Required Fields (Must be populated)
| Field | Type | From Page | Notes |
|-------|------|-----------|-------|
| `title` | String | ✅ (subject) | Display name for paper |
| `slug` | String | ✅ Generated from title | URL-friendly identifier |
| `paperCode` | String | ✅ (code in page) | Exam code (CS302, MAT401) |
| `examId` | ObjectId | ✅ Derived | Reference to Exam record |
| `subjectId` | ObjectId | ✅ (subject field) | Reference to Subject record |
| `year` | Number | ✅ (year in page) | Paper year (2024, 2023, etc) |
| `session` | String | ✅ (session in page) | Spring/Summer/Fall/Winter |
| `paperUrl` | String | ✅ Required | S3/CDN URL to PDF |
| `createdBy` | String | ✅ Required | Admin/User UUID creating it |

### Optional But Recommended Fields
| Field | Type | From Page | Purpose |
|-------|------|-----------|---------|
| `duration` | Number | ❌ New | Paper duration in minutes |
| `totalMarks` | Number | ❌ New | Max marks for paper |
| `difficulty` | String | ❌ New | Easy/Medium/Hard classification |
| `markingSchemeUrl` | String | ❌ New | URL to marking scheme |
| `solutionUrl` | String | ❌ New | Link to solutions |
| `description` | i18n Object | ❌ New | Multi-language descriptions |
| `keywords` | Array | ❌ New | Search keywords |
| `tags` | Array | ❌ New | Categorization tags |

### Analytics & Engagement Fields (Auto-populated)
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `views` | Number | 0 | Track popularity |
| `downloads` | Number | 0 | Download count |
| `prints` | Number | 0 | Print count |
| `shares` | Number | 0 | Share count |
| `averageRating` | Number | 0 | User rating (0-5) |
| `totalRatings` | Number | 0 | Number of ratings |
| `totalComments` | Number | 0 | Comment count |
| `totalBookmarks` | Number | 0 | Bookmark count |

### Quality Control Fields
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `isVerified` | Boolean | false | Admin verified |
| `verifiedBy` | String | null | UUID of verifier |
| `verifiedAt` | Date | null | When verified |
| `status` | String | DRAFT | DRAFT/PUBLISHED/ARCHIVED |
| `visibility` | String | PUBLIC | Control who can see |

### Administrative & SEO Fields
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `isPremium` | Boolean | false | Premium content flag |
| `priority` | Number | 0 | Display priority |
| `metaTitle` | String | - | SEO page title |
| `metaDescription` | String | - | SEO description |
| `ogImageUrl` | String | - | Share preview image |

---

## Solved Papers - Schema Field Reference

### Required Fields (Must be populated)
| Field | Type | From Page | Notes |
|-------|------|-----------|-------|
| `title` | String | ✅ (title in page) | Solution title |
| `slug` | String | ✅ Generated | URL identifier |
| `examId` | ObjectId | ✅ Derived | Reference to Exam |
| `subjectId` | ObjectId | ✅ (subject) | Reference to Subject |
| `year` | Number | ✅ (year) | Paper year |
| `difficulty` | String | ✅ (difficulty) | Easy/Medium/Hard |
| `questionCount` | Number | ✅ (questionCount) | Number of questions |
| `solutions` | Array | ✅ (sampleSteps) | Array of solution steps |
| `createdBy` | String | ✅ Required | Expert/Creator UUID |

### Solution Steps Structure
```typescript
{
  stepNumber: 1,              // Sequential number
  title?: "Question 1 Title",  // Optional step title
  body: "Solution text...",    // Required solution content
  hasLatex?: true,             // LaTeX indicator
  conceptTags?: ["algebra"],   // Related concepts
  isVerified?: true,           // Expert verified
  difficulty?: "Medium",       // Step difficulty
  alternativeExplanations?: [], // Other approaches
  commonMistakes?: [],         // Typical errors
  relatedTopicIds?: [],        // Topic references
  helpfulCount: 0,             // User feedback
  unhelpfulCount: 0            // User feedback
}
```

### Optional But Recommended Fields
| Field | Type | From Page | Purpose |
|-------|------|-----------|---------|
| `shortDescription` | i18n Object | ✅ (shortDescription) | Brief overview |
| `fullDescription` | i18n Object | ❌ New | Detailed description |
| `session` | String | ❌ New | Exam session |
| `totalMarks` | Number | ❌ New | Max marks |
| `estimatedDuration` | Number | ❌ New | Time to solve |
| `previousPaperId` | ObjectId | ❌ New | Link to original paper |

### Quality & Verification Fields
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `isVerified` | Boolean | ✅ (isVerified) | Expert verified |
| `solutionQuality` | String | BASIC | DRAFT/BASIC/COMPLETE/EXPERT_VERIFIED |
| `verifiedBy` | String | null | Verifying expert UUID |
| `verifiedAt` | Date | null | When verified |
| `creatorExpertiseLevel` | String | COMMUNITY | Creator credentials |

### Analytics & Engagement Fields (Auto-populated)
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `views` | Number | ✅ (views) | View count |
| `downloads` | Number | 0 | Download count |
| `prints` | Number | 0 | Print count |
| `shares` | Number | 0 | Share count |
| `averageRating` | Number | 0 | Solution rating (0-5) |
| `totalRatings` | Number | 0 | Number of ratings |
| `totalComments` | Number | 0 | Comment count |
| `totalLikes` | Number | 0 | Like count |
| `totalBookmarks` | Number | 0 | Bookmark count |
| `averageTimeSpent` | Number | 0 | Avg reading time (seconds) |
| `completionRate` | Number | 0 | % users completing (0-100) |

### Administrative Fields
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `status` | String | DRAFT | DRAFT/PUBLISHED/FEATURED/ARCHIVED |
| `isPremium` | Boolean | ✅ (isPremium) | Premium content |
| `isFeatured` | Boolean | false | Featured on homepage |
| `priority` | Number | 0 | Display priority (higher = more featured) |
| `displayOrder` | Number | 0 | Custom ordering |

### Accessibility & Localization Fields
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `hasEnglishSolution` | Boolean | true | English version available |
| `hasHindiSolution` | Boolean | false | Hindi version available |
| `hasVideoSolution` | Boolean | false | Video explanation exists |
| `videoUrl` | String | null | Video tutorial link |

### SEO & Discoverability Fields
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `metaTitle` | String | - | SEO title |
| `metaDescription` | String | - | SEO description |
| `ogImageUrl` | String | - | Share preview |
| `canonicalUrl` | String | - | Canonical URL for SEO |
| `keywords` | Array | [] | Search terms |
| `tags` | Array | [] | Categories |
| `searchText` | String | - | Full-text search field |

---

## Data Entry Checklist

### Creating a Previous Paper Entry
- [ ] Source paper PDF and upload to S3 → Get `paperUrl`
- [ ] Fill `title` (display name)
- [ ] Set `paperCode` (e.g., CS302)
- [ ] Select `examId` from dropdown
- [ ] Select `subjectId` from dropdown
- [ ] Set `year` (e.g., 2024)
- [ ] Set `session` (Spring/Summer/Fall/Winter)
- [ ] Set `status` to DRAFT initially
- [ ] (Optional) Set `difficulty` level
- [ ] (Optional) Upload marking scheme → `markingSchemeUrl`
- [ ] (Optional) Add `description`, `keywords`, `tags`
- [ ] (Optional) Set `isPremium` and `accessLevel`
- [ ] Review and set `status` to PUBLISHED
- [ ] Admin reviews and sets `isVerified` = true

### Creating a Solved Paper Entry
- [ ] Set `title` (solution title)
- [ ] Select `examId` and `subjectId`
- [ ] Set `year` and optionally `session`
- [ ] Set `difficulty` level
- [ ] Set `questionCount`
- [ ] (Optional) Link to `previousPaperId`
- [ ] Add `solutions` array with steps:
  - Each step: `stepNumber`, `title`, `body` (with LaTeX if needed)
  - Mark `hasLatex` = true if solution contains $...$
  - Add `conceptTags` for searchability
- [ ] Set `shortDescription` and `fullDescription`
- [ ] Set `status` to DRAFT
- [ ] (Optional) Add `keywords` and `tags`
- [ ] (Optional) Set `isPremium` and access control
- [ ] Submit for expert review
- [ ] Expert verifies: sets `isVerified` = true, `creatorExpertiseLevel` = EXPERT
- [ ] Publish: `status` = PUBLISHED

---

## Query Examples

### Previous Papers
```javascript
// Find all papers by exam and year
db.previous_papers.find({ examId: ObjectId("..."), year: 2024 })

// Find verified public papers
db.previous_papers.find({ isVerified: true, status: "PUBLISHED" })

// Sort papers by popularity
db.previous_papers.find({ status: "PUBLISHED" }).sort({ views: -1 })

// Filter by subject and difficulty
db.previous_papers.find({ subjectId: ObjectId("..."), difficulty: "Hard" })
```

### Solved Papers
```javascript
// Find trending solutions
db.solved_papers.find({ status: "PUBLISHED" }).sort({ views: -1 }).limit(10)

// Find papers for specific exam year
db.solved_papers.find({ examId: ObjectId("..."), year: 2024 })

// Find premium expert solutions
db.solved_papers.find({ isPremium: true, isVerified: true, status: "PUBLISHED" })

// Find papers by creator
db.solved_papers.find({ createdBy: "user-uuid", status: "PUBLISHED" })

// Find featured solutions
db.solved_papers.find({ isFeatured: true, status: "PUBLISHED" }).sort({ featuredAt: -1 })
```

---

## Page Module Updates Needed

### For `/src/app/dashboard/previous-papers/page.tsx`
- Change from mock data to fetch from API
- API should query with: exam, year filters
- Update interface to include `difficulty`, `viewCount`, `downloadCount`
- Add pagination for large datasets

### For `/src/app/dashboard/solved-papers/page.tsx`
- Add API endpoint: `/api/dashboard/solved-papers`
- Return: `{ stats: {...}, subjects: SubjectGroup[], trending: SolvedPaper[] }`
- Stats should include: `totalSolved`, counts by difficulty
- Trending should sort by `views` descending, limit to 5-10
- Filter implementation: by subject, by difficulty, by premium status

---

## API Endpoint Examples Needed

```typescript
// GET /api/dashboard/previous-papers
// Query params: ?year=2024&subject=CS&limit=20&offset=0
// Returns: PreviousPaper[]

// GET /api/dashboard/solved-papers
// Returns: { stats: {...}, subjects: SubjectGroup[], trending: SolvedPaper[] }

// POST /api/previous-papers/[id]/download
// Increments downloads count

// POST /api/solved-papers/[id]/view
// Increments views count and tracks user analytics
```
