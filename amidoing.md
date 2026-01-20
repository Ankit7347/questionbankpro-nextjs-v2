You are **100% correct**, and this is an **important architectural constraint**.
Let’s **lock the correct solution** clearly so you never end up with 10–15 API calls on Home or `/exams`.

I will explain **what to do**, **why**, and **what NOT to do**, in simple terms.

---

# CORE RULE (LOCK THIS 🔒)

> **ONE PAGE = ONE API CALL**

* Home page → **1 API call**
* `/exams` page → **1 API call**
* No per-education-level calls
* No per-exam calls
* No per-course calls

Anything else is a **bug**, not an optimization.

---

## WHY MULTIPLE CALLS ARE BAD (YOU ARE RIGHT)

If you did this ❌:

* Call education levels
* Then call exams per level
* Then call courses per exam

You would end up with:

* 10–15 API calls
* Slow TTFB
* Waterfall loading
* Bad SEO
* Mobile users suffer

You **correctly rejected this** 👍

---

# THE CORRECT PATTERN (SINGLE CALL, RICH DATA)

## Home Page (`/`)

### API

```
GET /api/exams/landing
```

### Returns (ONE CALL)

```json
[
  {
    "examSlug": "cbse-board",
    "examName": "CBSE Board",
    "courses": [
      { "slug": "class-6", "name": "Class 6" },
      { "slug": "class-10", "name": "Class 10" }
    ]
  },
  {
    "examSlug": "jee",
    "examName": "JEE",
    "courses": [
      { "slug": "jee-main", "name": "JEE Main" }
    ]
  }
]
```

### UI

* Loop once
* Render exam card
* Render course buttons
* Click → `/exams/cbse-board/class-6`

✅ Done
✅ Fast
✅ SEO friendly

---

## `/exams` Page (Catalog / Browse)

### API

```
GET /api/exams/catalog
```

### Returns (ONE CALL)

```json
[
  {
    "educationLevel": "School",
    "exams": [
      {
        "examSlug": "cbse-board",
        "courses": [...]
      }
    ]
  },
  {
    "educationLevel": "Competitive",
    "exams": [...]
  }
]
```

### UI

* Same data
* Same destination URLs
* Extra UI only:

  * Tabs
  * Search
  * Filters

Still **ONE API call**.

---

# IMPORTANT: SAME DATA, DIFFERENT SHAPE

You are NOT duplicating data.
You are **shaping it differently on the server**.

| Page   | API        | Shape   |
| ------ | ---------- | ------- |
| Home   | `/landing` | Flat    |
| /exams | `/catalog` | Grouped |

Both come from the **same DB**.

---

# HOW SEARCH & TABS WORK (NO EXTRA CALLS)

This is very important.

### ❌ WRONG

* Call API again when tab changes
* Call API again when searching

### ✅ CORRECT

* Fetch once
* Store in state
* Filter in memory

Example:

```ts
const [data, setData] = useState(fullCatalog);

// search
const filtered = data.filter(...);

// tab
const tabFiltered = filtered.filter(...);
```

**No network call**.

---

# YOUR FINAL ARCHITECTURE (LOCK THIS)

```
HOME
 └── 1 API call → /api/exams/landing
      └── exam + course buttons

/exams
 └── 1 API call → /api/exams/catalog
      ├── tabs (client-side)
      ├── search (client-side)
      └── same exam + course buttons
```

---

# WHAT YOU SHOULD NEVER DO AGAIN 🚫

* ❌ Call API per education level
* ❌ Call API per exam
* ❌ Call API on tab click
* ❌ Call API on search
* ❌ Chain API calls

---

# WHY THIS IS SCALABLE

Even if you add:

* 50 exams
* 500 courses
* 10 education levels

Still:

* Home → 1 call
* /exams → 1 call

That is **enterprise-grade design**.

---

# FINAL CONFIRMATION (YOU ARE THINKING CORRECTLY)

What you said:

> *“i cant have 12–13 api call i call is good enough”*

✅ This is the **correct instinct**
✅ Your backend design already supports this
✅ We have now aligned frontend to it

---

### Next logical step (pick one):

1. Add **search + tabs** on `/exams` (client-side only)
2. Build `/exams/[examSlug]/[subExamSlug]/page.tsx`
3. Add caching strategy (ISR vs no-store)

Tell me which one, and we’ll do it cleanly, **one step at a time**.



http://localhost:3000/exams/gate-exam/gate-2026-cs-it/pyq/2024/cs