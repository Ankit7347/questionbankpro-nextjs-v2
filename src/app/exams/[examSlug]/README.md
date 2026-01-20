```
[subExamSlug]/
├── (syllabus)/                 ← ONLY /syllabus
│   ├── layout.tsx              ← syllabus-specific layout
│   └── syllabus/
│       └── page.tsx            ← /syllabus
│
├── (learning)/                 ← subject/chapter/topic layout
│   ├── layout.tsx
│   └── [subjectSlug]/
│       └── [chapterSlug]/
│           └── [topicSlug]/
│
├── (assessment)/               ← practice / pyq / tests
│   ├── layout.tsx
│   ├── practice/
│   ├── pyq/
│   └── tests/
│
├── (shell)/                    ← optional landing layout
│   └── page.tsx
│
└── page.tsx                    ← optional (can delete later)
```