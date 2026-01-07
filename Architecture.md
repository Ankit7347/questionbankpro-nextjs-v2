# QuestionbankPro – Architecture Summary (Final)

## 1. App Layer
src/app/
- page.tsx (UI)
- api/** (thin API routes only)
- Tailwind dark mode
- i18n: en / hi

## 2. Models Layer
src/models/

### 2.1 Mongoose (DB Only)
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
dto/
- *.dto.ts (server response shape)
- *.mapper.ts (mongoose → DTO)
- apiResponse.dto.ts (standard API envelope)
- Used only in server services & API routes

## 3. Services Layer
src/services/

### 3.1 Server Services
server/
- *.server.ts
- Uses:
  - mongoose models
  - server DTOs
  - mappers
- Contains business logic
- May throw internal errors

### 3.2 Client Services
client/
- *.client.ts
- Calls API routes
- Uses UI DTOs only
- Handles API response envelope

## 4. UI DTOs
src/dto/
- Frontend-safe DTOs
- Used by pages, components, hooks
- ❌ No mongoose or server DTO imports

## 5. API Response Contract (Mandatory)
Every API response returns:
- success: boolean
- data: T | null
- error: string | null
- statusCode: number

## 6. Flow
UI
 → client service
 → API route
 → server service
 → mongoose
 → mapper
 → server DTO
 → API response envelope
 → client service
 → UI DTO

## 7. Missing / To Enforce
- Import boundary enforcement
- Central API response creator
- Error → response mapping
- DTO versioning (optional)
