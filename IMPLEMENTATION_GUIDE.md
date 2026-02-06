# Implementation Guide: Previous Papers & Solved Papers

## Overview
This guide shows how to integrate the new `PreviousPaper` and `SolvedPaper` schemas into your existing codebase.

## Files Created

### Schema Files
1. **`src/models/mongoose/PreviousPaper.schema.ts`** - MongoDB schema for previous papers
2. **`src/models/mongoose/SolvedPaper.schema.ts`** - MongoDB schema for solved papers
3. **`src/models/mongoose/index.ts`** - Export file for models

### Type Files
1. **`src/types/previousPaper.ts`** - TypeScript types for Previous Papers
2. **`src/types/solvedPaper.ts`** - TypeScript types for Solved Papers

### Documentation Files
1. **`SCHEMA_DOCUMENTATION.md`** - Comprehensive schema documentation
2. **`SCHEMA_FIELD_REFERENCE.md`** - Field mapping and quick reference
3. **`IMPLEMENTATION_GUIDE.md`** - This file

---

## Step-by-Step Integration

### Step 1: Import Models in Your Services
```typescript
// src/services/server/previousPaperService.ts
import { PreviousPaperModel } from '@/models/mongoose';
import { CreatePreviousPaperDTO, UpdatePreviousPaperDTO } from '@/types/previousPaper';

export async function getPreviousPapersByYear(examId: string, year: number) {
  return await PreviousPaperModel.find({
    examId,
    year,
    status: 'PUBLISHED',
    isDeleted: false,
  });
}

export async function createPreviousPaper(data: CreatePreviousPaperDTO, userId: string) {
  const paper = new PreviousPaperModel({
    ...data,
    createdBy: userId,
    slug: data.title.toLowerCase().replace(/\s+/g, '-'),
  });
  return await paper.save();
}
```

### Step 2: Create API Routes

#### For Previous Papers
```typescript
// src/app/api/dashboard/previous-papers/route.ts
import { PreviousPaperModel } from '@/models/mongoose';
import { PreviousPapersListResponse } from '@/types/previousPaper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const subject = searchParams.get('subject');
  const exam = searchParams.get('exam');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const filter: any = {
    status: 'PUBLISHED',
    isDeleted: false,
  };

  if (year) filter.year = parseInt(year);
  if (exam) filter.examId = exam;
  if (subject) filter.subjectId = subject;

  const total = await PreviousPaperModel.countDocuments(filter);
  const data = await PreviousPaperModel.find(filter)
    .sort({ year: -1, session: 1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('examId', 'name slug')
    .populate('subjectId', 'name');

  const response: PreviousPapersListResponse = {
    data,
    total,
    page,
    pageSize: limit,
    hasMore: total > page * limit,
  };

  return Response.json(response);
}
```

#### For Solved Papers
```typescript
// src/app/api/dashboard/solved-papers/route.ts
import { SolvedPaperModel } from '@/models/mongoose';
import { SolvedPapersStats } from '@/types/solvedPaper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const year = searchParams.get('year');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const filter: any = {
    status: 'PUBLISHED',
    isDeleted: false,
  };

  if (year) filter.year = parseInt(year);
  if (search) {
    filter.$text = { $search: search };
  }

  // Get stats
  const subjects = await SolvedPaperModel.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$subjectId',
        papers: { $push: '$$ROOT' },
      },
    },
    {
      $lookup: {
        from: 'subjects',
        localField: '_id',
        foreignField: '_id',
        as: 'subjectData',
      },
    },
  ]);

  const trending = await SolvedPaperModel.find(filter)
    .sort({ views: -1 })
    .limit(10)
    .populate('examId', 'name slug')
    .populate('subjectId', 'name');

  const stats = {
    totalSolved: await SolvedPaperModel.countDocuments(filter),
    trending,
    subjects: subjects.map((s) => ({
      subject: s.subjectData?.[0]?.name || 'Unknown',
      papers: s.papers,
    })),
  } as SolvedPapersStats;

  return Response.json(stats);
}
```

### Step 3: Update Dashboard Page Components

#### For Previous Papers Page
```typescript
// src/app/dashboard/previous-papers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { PreviousPapersStats } from '@/types/previousPaper';

export default function PreviousPapersPage() {
  const [stats, setStats] = useState<PreviousPapersStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/previous-papers');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="stats-grid">
        <StatCard
          label="Total Papers"
          value={stats?.totalPapers}
          icon="📄"
        />
        <StatCard
          label="Total Downloads"
          value={stats?.totalDownloads}
          icon="⬇️"
        />
        <StatCard
          label="Active Years"
          value={stats?.activeYears}
          icon="📅"
        />
      </div>
      {/* Rest of your UI */}
    </div>
  );
}
```

#### For Solved Papers Page
```typescript
// src/app/dashboard/solved-papers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { SolvedPapersStats } from '@/types/solvedPaper';

export default function SolvedPapersPage() {
  const [stats, setStats] = useState<SolvedPapersStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/solved-papers');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch solved papers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="stats-grid">
        <StatCard
          label="Total Solved Papers"
          value={stats?.totalSolved}
          icon="✅"
        />
        <StatCard
          label="Subjects"
          value={stats?.subjects.length}
          icon="📚"
        />
      </div>

      {/* Trending Section */}
      <section className="trending">
        <h2>Most Viewed Solutions</h2>
        <div className="grid">
          {stats?.trending.map((paper) => (
            <SolvedPaperCard key={paper._id} paper={paper} />
          ))}
        </div>
      </section>

      {/* Subjects Section */}
      <section className="subjects">
        {stats?.subjects.map((group) => (
          <SubjectGroup key={group.subject} group={group} />
        ))}
      </section>
    </div>
  );
}
```

### Step 4: Create Admin Panel for Managing Content

```typescript
// src/app/api/admin/previous-papers/route.ts
import { PreviousPaperModel } from '@/models/mongoose';
import { CreatePreviousPaperDTO } from '@/types/previousPaper';

export async function POST(request: Request) {
  const data: CreatePreviousPaperDTO = await request.json();
  const userId = request.headers.get('x-user-id'); // From auth middleware

  try {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-');
    const duplicate = await PreviousPaperModel.findOne({ slug });
    if (duplicate) {
      return Response.json(
        { error: 'Paper with this title already exists' },
        { status: 400 }
      );
    }

    const paper = new PreviousPaperModel({
      ...data,
      createdBy: userId,
      slug,
      searchText: `${data.title} ${data.paperCode} ${data.keywords?.join(' ')}`,
    });

    await paper.save();

    return Response.json(paper, { status: 201 });
  } catch (error) {
    console.error('Failed to create paper:', error);
    return Response.json(
      { error: 'Failed to create paper' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { id, ...updateData } = await request.json();
  const userId = request.headers.get('x-user-id');

  try {
    const paper = await PreviousPaperModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!paper) {
      return Response.json({ error: 'Paper not found' }, { status: 404 });
    }

    return Response.json(paper);
  } catch (error) {
    console.error('Failed to update paper:', error);
    return Response.json(
      { error: 'Failed to update paper' },
      { status: 500 }
    );
  }
}
```

### Step 5: Add Text Search Indexes

```typescript
// Create text search indexes for both collections
// Run this in MongoDB:

// For Previous Papers
db.previous_papers.createIndex({
  title: 'text',
  paperCode: 'text',
  keywords: 'text',
  description: 'text',
  searchText: 'text',
});

// For Solved Papers
db.solved_papers.createIndex({
  title: 'text',
  shortDescription: 'text',
  fullDescription: 'text',
  keywords: 'text',
  searchText: 'text',
});
```

---

## Database Initialization Script

```typescript
// src/scripts/init-papers.ts
import mongoose from 'mongoose';
import { PreviousPaperModel, SolvedPaperModel } from '@/models/mongoose';

async function initializePapersCollections() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    // Create collections and indexes
    await PreviousPaperModel.collection.createIndex(
      { examId: 1, year: 1, session: 1 },
      { background: true }
    );
    await PreviousPaperModel.collection.createIndex(
      { createdAt: -1 },
      { background: true }
    );
    await PreviousPaperModel.collection.createIndex(
      { slug: 1 },
      { unique: true, background: true }
    );

    await SolvedPaperModel.collection.createIndex(
      { examId: 1, year: 1 },
      { background: true }
    );
    await SolvedPaperModel.collection.createIndex(
      { createdBy: 1, status: 1 },
      { background: true }
    );
    await SolvedPaperModel.collection.createIndex(
      { slug: 1 },
      { unique: true, background: true }
    );

    console.log('✅ Collections and indexes created successfully');
  } catch (error) {
    console.error('❌ Failed to initialize collections:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

initializePapersCollections();
```

Run with: `npx ts-node src/scripts/init-papers.ts`

---

## Testing Queries

```javascript
// Test in MongoDB Compass or mongosh

// 1. Find papers by exam and year
db.previous_papers.findOne({
  examId: ObjectId("..."),
  year: 2024,
  status: "PUBLISHED"
})

// 2. Find trending solved papers
db.solved_papers.find({
  status: "PUBLISHED",
  isDeleted: false
}).sort({ views: -1 }).limit(10)

// 3. Search by text
db.previous_papers.find({
  $text: { $search: "algebra" }
})

// 4. Aggregate stats
db.solved_papers.aggregate([
  {
    $match: {
      status: "PUBLISHED",
      isDeleted: false
    }
  },
  {
    $group: {
      _id: "$difficulty",
      count: { $sum: 1 }
    }
  }
])

// 5. Get papers by creator
db.solved_papers.find({
  createdBy: "user-uuid",
  status: "PUBLISHED"
}).sort({ views: -1 })
```

---

## Future Enhancements

### Analytics Tracking
```typescript
// Add tracking endpoints
POST /api/previous-papers/[id]/track-view
POST /api/previous-papers/[id]/track-download
POST /api/solved-papers/[id]/track-view
```

### Caching Strategy
```typescript
// Cache frequently accessed data
const cache = new Map<string, any>();

export async function getTrendingSolvedPapers(ttl = 3600000) {
  const cacheKey = 'trending-solved-papers';
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const data = await SolvedPaperModel.find({
    status: 'PUBLISHED',
  }).sort({ views: -1 }).limit(10);

  cache.set(cacheKey, data);
  setTimeout(() => cache.delete(cacheKey), ttl);

  return data;
}
```

### Admin Dashboard Widgets
- View count trends (chart)
- Download statistics
- Creator rankings
- Content quality distribution
- Premium content performance

---

## Troubleshooting

### Indexes Not Being Used
```javascript
// Analyze query performance
db.previous_papers.find({ year: 2024 }).explain("executionStats")

// If COLLSCAN appears, create the index:
db.previous_papers.createIndex({ year: 1 })
```

### Duplicate Slugs
```typescript
// If slug generation fails, implement a fallback:
const generateSlug = (title: string, id: string) => {
  return `${title.toLowerCase().replace(/\s+/g, '-')}-${id.slice(-6)}`;
};
```

### Memory Issues with Large Aggregations
```typescript
// Use $limit and $skip for pagination
# Streams for large datasets
SolvedPaperModel.find().stream().on('data', (doc) => {
  // Process one document at a time
});
```

---

## Next Steps

1. ✅ Create API routes for CRUD operations
2. ✅ Update page components to use real data
3. ✅ Add admin panel for content management
4. ✅ Implement search and filtering
5. ✅ Add analytics tracking
6. ✅ Create user feedback system (ratings, comments)
7. ✅ Implement CDN/S3 integration for file uploads
8. ✅ Add caching layer (Redis)
9. ✅ Set up task queue for heavy operations (generating PDFs, etc.)

---

For questions or issues, refer to:
- `SCHEMA_DOCUMENTATION.md` - Detailed field descriptions
- `SCHEMA_FIELD_REFERENCE.md` - Quick lookup and examples
- MongoDB documentation: https://docs.mongodb.com/
