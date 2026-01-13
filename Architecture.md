<!-- ARCHIVE: QuestionbankPro Architecture (Final & Enforced) -->

# QuestionbankPro – Architecture Summary (Final)

## 1. App Layer
<!-- src/app/ -->
src/app/
- page.tsx (UI)
- api/** (thin API routes only)
- Tailwind dark mode
- i18n: en / hi

---

## 2. Models Layer
<!-- src/models/ -->
src/models/

### 2.1 Mongoose (DB Only)
<!-- src/models/mongoose/ -->
mongoose/
- *.schema.ts
- base.schema.ts
  - createdAt
  - updatedAt
  - updatedBy
  - isDeleted
- timestamps enabled
- ❌ Never used in UI or client services

### 2.2 Server DTOs
<!-- src/models/dto/ -->
dto/
- *.dto.ts (server response shape)
- *.mapper.ts (mongoose → DTO)
- apiResponse.dto.ts (standard API envelope)
- Used only in server services & API routes

---

## 3. Services Layer
<!-- src/services/ -->
src/services/

### 3.1 Server Services
<!-- src/services/server/ -->
server/
- *.server.ts
- Uses:
  - mongoose models
  - server DTOs
  - mappers
- Contains business logic
- May throw ApiError

### 3.2 Client Services
<!-- src/services/client/ -->
client/
- *.client.ts
- Calls API routes
- Uses UI DTOs only
- Consumes ApiResponse

---

## 4. UI DTOs
<!-- src/dto/ -->
src/dto/
- Frontend-safe DTOs
- Used by pages, components, hooks
- ❌ No mongoose or server DTO imports

---

## 5. API Response Contract (Mandatory)
<!-- src/models/dto/apiResponse.dto.ts -->
Every API response returns:
- success: boolean
- data: T | null
- error: string | null
- statusCode: number

---

## 6. Error Handling Layer
<!-- src/lib/ -->
src/lib/
- apiError.ts (typed server errors with HTTP status)
- response.util.ts (success / error formatter)
- API routes translate errors → ApiResponse

---

## 7. Request–Response Flow
<!-- Lifecycle -->
UI
 → client service
 → API route
 → server service
 → mongoose
 → mapper
 → server DTO
 → ApiResponse
 → client service
 → UI DTO

---

## 8. Enforcement Rules
<!-- Mandatory architectural constraints -->
- Import boundary enforcement (ESLint / folder rules)
- Centralized API response creation only via response.util
- All server errors must be ApiError
- DTO versioning (optional)

---

## 9. Automation & Documentation Rules
<!-- Project-wide non-negotiable rules -->

- A script must exist to **auto-create missing folders and files** (empty placeholders) to enforce architecture during setup or CI.
- **Every file must start with a top-level comment containing its full relative file path**.

### Example
```ts
// src/services/server/exam.server.ts
```

```bash
src/app/exams/
├── page.tsx
└── [examSlug]/
    ├── page.tsx
    └── syllabus/
        └── [syllabusSlug]/
            ├── page.tsx
            └── subject/
                └── [subjectSlug]/
                    ├── page.tsx
                    └── chapter/
                        └── [chapterSlug]/
                            ├── page.tsx
                            └── topic/
                                └── [topicSlug]/
                                    └── page.tsx

```

```
src/app/layout.tsx               ← global (if any)
└── src/app/exams/layout.tsx     ← Navbar + Footer
    └── /exams
    └── /exams/[examSlug]
    └── src/app/exams/[examSlug]/[courseSlug]/layout.tsx
        ├── ExamSidebar  ← persists
        └── main         ← changes
            ├── page.tsx
            ├── subject/[subjectSlug]/page.tsx
            ├── chapter/[chapterSlug]/page.tsx
            └── topic/[topicSlug]/page.tsx

```