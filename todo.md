Below is a **single, clean conclusion** you can **copy-paste and keep as the final checklist** for this sidebar work.
No theory, no extra explanation.

---

## ✅ QuestionbankPro – Exams Sidebar (Final Implementation Checklist)

### 1. Data & Architecture (Locked)

* Sidebar data is fetched **once** in
  `src/app/exams/[examSlug]/[courseSlug]/layout.tsx`
* Layout calls **server service directly**
* Client services are **NOT used** in layouts
* UI receives **only frontend-safe DTOs**
* Multilingual DB fields `{ en, hi }` are **resolved on server**
* Global language logic lives in `src/lib/i18n.ts`
* UI never renders objects (only strings)

---

### 2. Next.js 14+ Mandatory Rules (Must Remember)

* `params` is **always async**

  * layouts, pages, API routes
  * always `await params`
* API routes must use:

  * `NextRequest`
  * `params: Promise<{ ... }>`
* Never access `params.slug` directly

---

### 3. Sidebar Cache Strategy (Recommended)

* Implement **server-side caching** in loader/service:

  * Use `cache()` or `unstable_cache`
* Cache key:

  * `examSlug + courseSlug + lang`
* Revalidate when:

  * syllabus / subject / chapter changes

---

### 4. Sidebar UI Enhancements (Next Tasks)

* ✅ Collapsible sections (Subject expand/collapse)
* ✅ Active route highlighting

  * Use `useSelectedLayoutSegments()`
* ✅ Persist open state across navigation
* ✅ Skeleton loader for sidebar

---

### 5. i18n (Future-Ready, No Refactor Needed)

* Add new language by:

  1. Extending `Lang` type in `src/lib/i18n.ts`
  2. Adding language data in DB
* No UI / mapper / service changes required

---

### 6. Seed & Data Integrity (Important)

* Ensure DB relations:

  * `Exam.slug = cbse-board`
  * `Course.slug = class-6`
  * `Course.examId = Exam._id`
* All multilingual fields must follow:

  ```json
  { "en": "...", "hi": "..." }
  ```

---

### 7. Error Handling (Final)

* Server services:

  * throw `ApiError` helpers only (`NotFound`, etc.)
* API routes:

  * use `ok()` / `fail()` only
* UI:

  * never sees server errors directly

---

### 8. DO NOT DO (Hard Rules)

* ❌ Do not pass `{ en, hi }` to client
* ❌ Do not fetch `/api` from layouts
* ❌ Do not validate params in layouts
* ❌ Do not hardcode `"en"` in mappers
* ❌ Do not render objects in JSX

---

### 9. Safe Stopping Point

* Current build is **stable**
* Sidebar works
* Routing fixed
* i18n ready
* No technical debt introduced

---

When you resume next time, start from **one** of these:

* Cache implementation
* Sidebar collapse + active state
* Language middleware
* Seed scripts
* Course page server-side refactor

This is the **final, correct conclusion** for this thread.
