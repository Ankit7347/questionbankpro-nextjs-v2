**Contact Us structure**, formatted **cleanly for a Markdown (`.md`) file**, suitable for your repo documentation or `ARCHITECTURE.md`.

---

# Contact Us – Final Architecture (QuestionbankPro)

This feature follows the **strict QuestionbankPro standards**:

* App Router (Next.js)
* DTO-first design
* Client / Server service separation
* Mongoose isolated to server services
* No `any`
* No `unknown`
* Zero TypeScript errors
* Same pattern as `exam.server.ts`

---

## 📁 Directory Structure

```text
src/
├── app/
│   └── api/
│       └── contact/
│           └── route.ts
│
├── services/
│   ├── client/
│   │   └── contact.client.ts
│   └── server/
│       └── contact.server.ts
│
├── dto/
│   └── contact.dto.ts
│
├── models/
│   ├── mongoose/
│   │   └── ContactUs.schema.ts
│   └── dto/
│       ├── base.dto.ts
│       ├── contactUs.dto.ts
│       └── contactUs.mapper.ts
│
├── lib/
│   └── mongodb.ts
```

---

## 🔁 Data Flow

```text
Contact Form (UI)
        ↓
contact.client.ts
        ↓
POST /api/contact
        ↓
route.ts (validation only)
        ↓
contact.server.ts (DB logic)
        ↓
ContactUs.schema.ts (MongoDB)
```

For admin reads:

```text
MongoDB Document
        ↓
mapContactUs()
        ↓
ContactUsDTO
        ↓
Admin API / UI
```

---

## 📄 File Responsibilities

### `app/api/contact/route.ts`

* HTTP handling
* Input validation
* Response formatting
* No database logic

### `services/server/contact.server.ts`

* Database connection
* Mongoose operations
* Business logic

### `services/client/contact.client.ts`

* Browser-safe API calls
* Typed request/response

### `dto/contact.dto.ts`

* API request & response contracts

### `models/mongoose/ContactUs.schema.ts`

* MongoDB schema definition

### `models/dto/*.ts`

* Output DTOs
* Base field normalization
* Safe mapping from DB → API

---

## ✅ TypeScript Guarantees

* `strict: true`
* No `any`
* No `unknown`
* No mongoose documents in API responses
* DTOs as the single source of truth

---

## 📌 Notes

* POST responses intentionally return only `{ success, message }`
* Mappers are used only for **read operations**
* Soft delete supported via `isDeleted`

---

