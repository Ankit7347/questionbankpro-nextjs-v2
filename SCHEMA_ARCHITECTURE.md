# Schema Architecture & Relationships

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          QUESTION BANK DATABASE SCHEMA                        │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌────────┐
                                    │  Exam  │
                                    └───┬────┘
                                        │ 1
                          ┌─────────────┼──────────────┐
                          │             │              │
                          │             │              │
                          ▼ N           ▼ N            ▼ N
                    ┌────────────┐ ┌──────────┐ ┌────────────┐
                    │  SubExam   │ │ Subject  │ │   Course   │
                    └────┬───────┘ └────┬─────┘ └────┬───────┘
                         │             │            │
                    ┌────┴─────────────┴────────────┴────┐
                    │                                    │
                    ▼                                    ▼
            ┌──────────────────┐            ┌──────────────────┐
            │  PREVIOUS PAPER  │            │  SOLVED PAPER    │
            ├──────────────────┤            ├──────────────────┤
            │                  │            │                  │
            │ • title          │            │ • title          │
            │ • paperCode      │            │ • questionCount  │
            │ • year           │            │ • difficulty     │
            │ • session        │            │ • solutions[]    │
            │ • paperUrl       │            │ • isVerified     │
            │ • views          │            │ • views          │
            │ • downloads      │            │ • averageRating  │
            │ • isVerified     │            │ • createdBy      │
            │ • status         │            │ • status         │
            │ • isPremium      │            │ • isPremium      │
            │                  │            │                  │
            └────┬─────────────┘            └────┬─────────────┘
                 │                              │
                 └──────────────┬────────────────┘
                                │
                        ┌───────▼────────┐
                        │   relatedIds   │
                        │   (linking)    │
                        └────────────────┘
```

---

## Data Structure Flowchart

```
┌─────────────────────────────────────────────────────────┐
│  ADMIN / CONTENT CREATOR WORKFLOW                         │
└─────────────────────────────────────────────────────────┘

  Upload PDF         Create metadata         Verify
      ↓                    ↓                   ↓
  [S3 Storage]    [Create DB Record]    [Expert Review]
      ↓                    ↓                   ↓
   paperUrl         { title, code, ... }  isVerified=true
                     status=DRAFT           verifiedBy=UUID
                                           status=PUBLISHED
                                                ↓
                                         Available to Users

┌─────────────────────────────────────────────────────────┐
│  USER INTERACTION WORKFLOW                               │
└─────────────────────────────────────────────────────────┘

  Browse Papers       View Solutions        Submit Feedback
       ↓                    ↓                      ↓
  [Exam/Year]      [Read + View Tracking]  [Rating/Comment]
       ↓                    ↓                      ↓
  List Display      Increment views        +totalRatings
  Sort by Views     Show solutions[]       +totalComments
  Filter Params     Render LaTeX           Update average
                    Track time              Rating
```

---

## Previous Paper Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│  PREVIOUS PAPER LIFECYCLE                                     │
└──────────────────────────────────────────────────────────────┘

1. CREATION (Admin)
   ┌─────────────────────────────────────┐
   │ Create for exam + subject + year    │
   │ Upload to S3                        │
   │ Store metadata                      │
   │ Set status=DRAFT                    │
   └────────┬────────────────────────────┘
            │
2. VERIFICATION
   ┌────────▼────────────────────────────┐
   │ Expert reviews content              │
   │ Sets isVerified=true                │
   │ Adds to verifiedBy + verifiedAt     │
   └────────┬────────────────────────────┘
            │
3. PUBLISHING
   ┌────────▼────────────────────────────┐
   │ Admin publishes                     │
   │ Sets status=PUBLISHED               │
   │ Sets visibility=PUBLIC/PREMIUM      │
   │ Now visible to users                │
   └────────┬────────────────────────────┘
            │
4. USER ENGAGEMENT
   ┌────────▼────────────────────────────┐
   │ Users view, download, bookmark      │
   │ Analytics tracked:                  │
   │ · views++                           │
   │ · downloads++                       │
   │ · totalBookmarks++                  │
   │ · leaves comments/ratings           │
   └────────┬────────────────────────────┘
            │
5. MAINTENANCE
   ┌────────▼────────────────────────────┐
   │ Archive if year too old             │
   │ Delete if not verified (30 days)    │
   │ Soft delete with isDeleted flag     │
   │ Can be restored if needed           │
   └──────────────────────────────────────┘
```

---

## Solved Paper Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│  SOLVED PAPER LIFECYCLE                                       │
└──────────────────────────────────────────────────────────────┘

1. CREATION (Expert)
   ┌─────────────────────────────────────┐
   │ Create with solutions[]             │
   │ Add step-by-step explanations       │
   │ Include LaTeX for math              │
   │ Add concept tags                    │
   │ Status=DRAFT                        │
   └────────┬────────────────────────────┘
            │
2. ENHANCEMENT
   ┌────────▼────────────────────────────┐
   │ Add common mistakes                 │
   │ Add alternative explanations        │
   │ Verify each solution step           │
   │ Link to topics                      │
   │ Status=BASIC/COMPLETE               │
   └────────┬────────────────────────────┘
            │
3. REVIEW & VERIFICATION
   ┌────────▼────────────────────────────┐
   │ Admin/Expert reviews                │
   │ Sets isVerified=true                │
   │ Sets solutionQuality=EXPERT_VERIFIED│
   │ Adds to featured if excellent       │
   └────────┬────────────────────────────┘
            │
4. PUBLISHING
   ┌────────▼────────────────────────────┐
   │ Status=PUBLISHED                    │
   │ Sets publishedAt timestamp          │
   │ Visible to users                    │
   │ Can be featured=true                │
   └────────┬────────────────────────────┘
            │
5. USER INTERACTION
   ┌────────▼────────────────────────────┐
   │ Students read solutions             │
   │ Analytics tracked:                  │
   │ · views++                           │
   │ · averageTimeSpent += timeOnPage    │
   │ · completionRate tracked            │
   │ · Step feedback (helpful/unhelpful) │
   │ · Ratings and comments              │
   │ · Bookmarks                         │
   │ · Test performance correlated       │
   └────────┬────────────────────────────┘
            │
6. ANALYTICS & OPTIMIZATION
   ┌────────▼────────────────────────────┐
   │ Trending solutions (by views)       │
   │ Top rated solutions (by rating)     │
   │ Most helpful (by feedback)          │
   │ Difficulty redistribution           │
   │ Content gaps identified             │
   └──────────────────────────────────────┘
```

---

## Database Query Patterns

```
PREVIOUS PAPERS - Common Queries
═════════════════════════════════════════════════════════════

1. Browse by Year
   db.previous_papers.find({ year: 2024, status: 'PUBLISHED' })
   Index: { year: 1, status: 1 }

2. Filter by Subject
   db.previous_papers.find({ subjectId: ObjectId(...) })
   Index: { subjectId: 1, year: -1 }

3. Search Papers
   db.previous_papers.find({ $text: { $search: 'algebra' } })
   Index: { title: 'text', keywords: 'text', searchText: 'text' }

4. Trending (Most Downloaded)
   db.previous_papers.find({ status: 'PUBLISHED' })
     .sort({ downloads: -1 })
   Index: { status: 1, downloads: -1 }

5. Recently Added
   db.previous_papers.find({ status: 'PUBLISHED' })
     .sort({ createdAt: -1 })
   Index: { status: 1, createdAt: -1 }

─────────────────────────────────────────────────────────────

SOLVED PAPERS - Common Queries
═════════════════════════════════════════════════════════════

1. Trending Solutions
   db.solved_papers.find({ status: 'PUBLISHED' })
     .sort({ views: -1 })
   Index: { status: 1, views: -1 }

2. Best Rated Solutions
   db.solved_papers.find({ status: 'PUBLISHED' })
     .sort({ averageRating: -1 })
   Index: { status: 1, averageRating: -1 }

3. By Author
   db.solved_papers.find({ createdBy: 'uuid' })
     .sort({ createdAt: -1 })
   Index: { createdBy: 1, createdAt: -1 }

4. Featured Solutions
   db.solved_papers.find({ isFeatured: true })
     .sort({ featuredAt: -1 })
   Index: { isFeatured: 1, featuredAt: -1 }

5. Verified Expert Solutions
   db.solved_papers.find({
     isVerified: true,
     solutionQuality: 'EXPERT_VERIFIED'
   }).sort({ totalRatings: -1 })

6. Group by Subject
   db.solved_papers.aggregate([
     { $match: { status: 'PUBLISHED' } },
     { $group: { _id: '$subjectId', count: { $sum: 1 } } }
   ])

─────────────────────────────────────────────────────────────
```

---

## Caching Strategy

```
┌──────────────────────────────┐
│  CACHING LAYERS              │
└──────────────────────────────┘

TIER 1: In-Memory (React)
├─ useMemo() for component renders
├─ useCallback() for event handlers
└─ 1-5 minute TTL

TIER 2: Browser Cache
├─ Static PDFs (paperUrl)
├─ Images (ogImageUrl)
└─ Cache-Control headers

TIER 3: Server Cache (Redis/Memory)
├─ Trending papers (5 minutes)
├─ Stats/counts (1 minute)
├─ Search results (10 minutes)
└─ Popular subjects (1 hour)

TIER 4: Database
├─ Fresh queries > 5 min old
├─ Full paper content
└─ Real-time analytics

INVALIDATION EVENTS
├─ User uploads paper → invalidate cache
├─ Status change → invalidate trending
├─ New rating → invalidate ratings
└─ View tracked → update counter (debounced)
```

---

## Access Control Matrix

```
┌────────────────────────────────────────────────────────┐
│  WHO CAN ACCESS WHAT?                                   │
└────────────────────────────────────────────────────────┘

                    PUBLIC  INTERNAL  PREMIUM  RESTRICTED
Anonymous User        ✓        ✗        ✗         ✗
Free Member          ✓        ✓        ✗         ✗
Premium Member       ✓        ✓        ✓         ✗
Admin/Moderator      ✓        ✓        ✓         ✓
Creator              ✓        ✓        ✓         ✓

─────────────────────────────────────────────────────────

PAPER STATUS & VISIBILITY
├─ DRAFT
│  └─ Only creator + admins can see
│  └─ visibility doesn't matter yet
│
├─ PUBLISHED
│  ├─ PUBLIC → Everyone
│  ├─ PREMIUM → Paid members only
│  ├─ INTERNAL → Organization members
│  └─ RESTRICTED → Specific users only
│
├─ FEATURED (Special state)
│  └─ Highest priority display
│  └─ Visible to appropriate access level
│
├─ ARCHIVED
│  └─ Not in listings
│  └─ Available via direct link
│  └─ isVerified doesn't change
│
└─ DELETED (Soft delete)
   └─ Hidden from all (isDeleted=true)
   └─ Recoverable by admins
```

---

## Performance Optimization

```
┌──────────────────────────────────────────────────────┐
│  OPTIMIZATION CHECKLIST                               │
└──────────────────────────────────────────────────────┘

INDEXES (Phase 1: Required)
✓ slug (unique)
✓ examId + year + session
✓ status + visibility
✓ createdAt (descending)
✓ views (descending)

TEXT INDEXES (Phase 2: Search)
✓ title, keywords, searchText
✓ Full-text search capability

AGGREGATE INDEXES (Phase 3: Analytics)
✓ difficulty distribution
✓ Creator rankings
✓ Content gaps

PAGINATION
✓ Always use limit + skip
✓ Default limit: 20 per page
✓ Max limit: 100

PAGINATION STRATEGY
├─ Use createdAt for chronological
├─ Use _id for natural order
└─ Avoid offset-based (slow on large datasets)

FIELD SELECTION
├─ Don't fetch all fields by default
├─ Use projection in queries:
│  db.collection.find({}, { title: 1, views: 1 })
└─ Minimize data transfer

DENORMALIZATION
├─ searchText field (computed)
├─ totalComments (counter)
├─ averageRating (computed)
└─ Rebuild on bulk updates
```

---

## Error Handling Map

```
┌──────────────────────────────────────────────────────┐
│  ERROR SCENARIOS & HANDLING                           │
└──────────────────────────────────────────────────────┘

SCHEMA VALIDATION ERRORS (400)
├─ Missing required fields
├─ Invalid enum values
├─ Type mismatches
└─ Response: { error: "...", field: "..." }

UNIQUE CONSTRAINT VIOLATIONS (409)
├─ Duplicate slug
├─ Duplicate paperCode (logic-dependent)
└─ Response: { error: "Slug already exists" }

NOT FOUND ERRORS (404)
├─ Paper/solution doesn't exist
├─ User not authorized to view
└─ Response: { error: "Not found" }

PERMISSION ERRORS (403)
├─ Access level too low
├─ Premium content without access
└─ Response: { error: "Access denied" }

SERVER ERRORS (500)
├─ Database connection fail
├─ S3 upload failure
├─ File processing error
└─ Response: { error: "Internal server error" }

BUSINESS LOGIC ERRORS (422)
├─ Can't delete verified paper
├─ Can't change status if not verified
└─ Response: { error: "...", reason: "..." }
```

---

## Deployment Checklist

```
PRE-DEPLOYMENT
├─ [ ] All indexes created
├─ [ ] Backup database
├─ [ ] Load test with real data
├─ [ ] Monitor disk space
└─ [ ] Test with production data volume

DEPLOYMENT
├─ [ ] Deploy schema changes
├─ [ ] Run index creation (background: true)
├─ [ ] Verify API endpoints
├─ [ ] Test pagination
├─ [ ] Verify caching works
└─ [ ] Monitor query performance

POST-DEPLOYMENT
├─ [ ] Monitor slow queries
├─ [ ] Check index usage with explain()
├─ [ ] Verify analytics are tracking
├─ [ ] Test search functionality
├─ [ ] Load testing (sustained traffic)
└─ [ ] User acceptance testing

MONITORING
├─ Document slow query thresholds
├─ Weekly index usage review
├─ Monthly storage growth review
├─ Setup alerts for:
│  ├─ High error rates
│  ├─ Slow query execution
│  ├─ Disk space low
│  └─ Connection pool exhaustion
└─ Regular backup verification
```

---

## Schema Evolution Plan

```
CURRENT STATE (v1.0)
├─ Basic CRUD operations
├─ Text search
├─ Analytics tracking
└─ Verification workflow

PHASE 2 (v1.1)
├─ Multi-language full support
├─ Comment threads
├─ User attempt history
└─ Performance recommendations

PHASE 3 (v2.0)
├─ AI-based difficulty scoring
├─ Collaborative solving
├─ Work bookmarking
└─ Learning path recommendations

PHASE 4 (v2.5)
├─ Video solution integration
├─ Handwritten solution capture
├─ Real-time collaboration
└─ Mobile app support

PHASE 5 (v3.0)
├─ AI solution generation
├─ Adaptive learning paths
├─ Predictive performance
└─ Micro-credentials/badges

Each phase maintains backward compatibility.
```

---

This architectural overview should help with understanding the system design and relationships between schemas.
