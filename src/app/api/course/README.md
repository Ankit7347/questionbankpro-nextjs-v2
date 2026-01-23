```
src/app/api/course/README.md
```

---

```md
# Course API – Commercial & Access Layer

**Location**
```

src/app/api/course/

```

**Status**
- Canonical
- Enforced
- UI-agnostic
- Commercial layer only

---

## Purpose

The **Course API** manages **commercial offerings and access control** for a SubExam.

A Course:
- Is a **product**, not academic content
- Controls pricing, availability, and visibility
- Belongs to **exactly one SubExam**
- Never owns or maps syllabus data

This API layer is **thin by design** and delegates all business logic to server services.

---

## What Course API IS

✅ Commercial offering  
✅ Pricing & validity controller  
✅ Access switch (`isActive`)  
✅ UI-level bundling abstraction  

---

## What Course API IS NOT

❌ Part of official syllabus hierarchy  
❌ Owner of Subject / Chapter / Topic  
❌ Allowed to reference OfficialSyllabus  
❌ Allowed to expose mongoose documents  

---

## Folder Structure

```
```
src/app/api/course/
├── route.ts                 # List & create courses
├── [courseId]/route.ts      # Get / update / soft delete
├── by-subexam/route.ts      # Public course listing by SubExam
├── pricing/route.ts         # Coupon-aware pricing resolution
├── toggle-active/route.ts   # Operational on/off switch
└── README.md
```

````

Exactly **5 route files**.  
No additional nesting is allowed.

---

## Route Responsibilities

### 1. `GET /api/course`
**Admin use**
- Lists all courses
- Supports filtering (handled in service)

### 2. `POST /api/course`
**Admin use**
- Creates a new course
- Validates commercial fields only

---

### 3. `GET /api/course/[courseId]`
**Admin use**
- Fetch single course by ID

### 4. `PATCH /api/course/[courseId]`
**Admin use**
- Update pricing, validity, visibility
- No syllabus linkage allowed

### 5. `DELETE /api/course/[courseId]`
**Admin use**
- Soft delete only (`isDeleted = true`)

---

### 6. `GET /api/course/by-subexam?subExamSlug=...`
**Student / Public use**
- Lists **active, public, valid** courses for a SubExam
- Applies:
  - `isActive = true`
  - `visibility = PUBLIC`
  - `validFrom / validTo`

---

### 7. `POST /api/course/pricing`
**Checkout use**
- Resolves final price
- Applies coupon logic
- Does NOT modify Course data

---

### 8. `POST /api/course/toggle-active`
**Operational use**
- Instant kill-switch
- No pricing or metadata changes

---

## API Contract (Mandatory)

All responses **must** follow:

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  statusCode: number;
}
````

No raw `res.json`.
No ad-hoc shapes.

---

## Enforcement Rules

### Forbidden (Hard Rules)

* Course → OfficialSyllabus
* Course → Subject / Chapter / Topic
* Course → mapping tables
* UI route–shaped APIs
* Mongoose imports in API routes

### Allowed

* Course → SubExam reference only
* Server services for business logic
* DTO + Mapper usage
* `ApiError` for all failures

---

## Architectural Guarantees

* API routes are **thin**
* Business logic lives in `src/services/server`
* DB schemas never leak
* UI remains decoupled from API shape

---

## Change Policy

Any change to this folder **must**:

1. Preserve model-based routing
2. Respect syllabus isolation
3. Maintain response contract
4. Update this README if behavior changes

Violations are considered **architecture bugs**.

