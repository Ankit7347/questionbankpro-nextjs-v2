Below is a **clean, hard-rules README** you can drop directly into your repo.
It documents the **non-negotiable rules** of pricing, free logic, enrollment, and dashboard behavior.

---

# Dashboard Courses – Hard Rules & Domain Contracts

This document defines **strict, non-negotiable rules** for how Courses, Free logic, Enrollment, and Dashboard buckets work.

If behavior looks wrong in UI, **the bug is always in server logic**, not UI.

---

## 1. Core Concepts (DO NOT MIX)

### 1.1 Course (Catalog-Level)

* Defines **what exists**
* Defines **price**
* Defines **global visibility**
* Defines **limited-time free promotions**

Course **never decides** user access.

---

### 1.2 UserCourseAccess (User-Level)

* Defines **who can access what**
* Defines **FREE vs PAID entitlement**
* Defines **time-bound vs lifetime**
* Defines **revocation / expiry**

UserCourseAccess **never decides price**.

---

## 2. Pricing Rules (HARD)

* `basePrice`, `salePrice`, `discountPercent`

  * Are **commercial information only**
  * Are used for **display**
  * Are used for **payment calculation**

### 🚫 Forbidden

* ❌ Price must NOT decide FREE / PAID access
* ❌ 100% discount must NOT auto-grant access
* ❌ salePrice = 0 must NOT mean free access

> **Price answers “how much”.
> Access answers “why & how long”.**

---

## 3. FREE Logic – Two Separate Meanings

### 3.1 Catalog-Level FREE (Explore → Free)

Used when:

* Any user can enroll for free
* During a promotional time window
* Before any enrollment exists

**Source of truth**

* `Course.isGloballyFree === true`
* Optional `Course.validFrom / validTo`

**Effect**

* Appears in `explore.free`
* User must still click **Enroll Now**
* Enrollment creates `UserCourseAccess`

---

### 3.2 User-Level FREE (My Courses)

Used when:

* User enrolled with 100% discount
* Coupon-based free
* Admin-granted free
* Trial access

**Source of truth**

* `UserCourseAccess.accessType = "FREE"`

**Effect**

* Appears in `myCourses.active / expiring / expired`
* NEVER appears in Explore

---

## 4. Enrollment Rules (CRITICAL)

### Rule 4.1

> **Access is granted ONLY by creating `UserCourseAccess`.**

Even if price is ₹0:

* User must enroll
* Access record must exist

---

### Rule 4.2 – AccessType Meaning

| accessType | Meaning                      |
| ---------- | ---------------------------- |
| FREE       | User paid nothing for access |
| PAID       | User paid money for access   |

Price and discounts do NOT override this.

---

## 5. Dashboard Buckets (STRICT)

### 5.1 Explore Buckets (Not Enrolled)

| Condition                     | Bucket         |
| ----------------------------- | -------------- |
| Course.isGloballyFree + valid | `explore.free` |
| Everything else               | `explore.paid` |

### 5.2 My Courses Buckets (Enrolled)

| Condition        | Bucket               |
| ---------------- | -------------------- |
| Lifetime access  | `myCourses.active`   |
| Expires > 7 days | `myCourses.active`   |
| Expires ≤ 7 days | `myCourses.expiring` |
| Expired          | `myCourses.expired`  |

---

## 6. CTA Rules (UI – SAFE DISPLAY ONLY)

UI **must not compute access logic**.

Allowed UI-only rule:

* If `access.status === NONE` and `price.final === 0`

  * Show **“Enroll Now”**
* Else if `access.status === NONE`

  * Show **“Buy Now”**

This is **text only**, not entitlement logic.

---

## 7. What the UI Must NEVER Do

* ❌ Decide FREE from price
* ❌ Decide access from discount
* ❌ Decide expiry from dates
* ❌ Pass userId / examSlug / subExamSlug
* ❌ Invent business logic

UI only **renders server decisions**.

---

## 8. Why `explore.free` Exists Even If Empty

* API contract stability
* Future catalog-free courses
* No UI refactor later
* Clear separation of concerns

Empty array ≠ useless array.

---

## 9. One-Line Mental Model (Remember This)

> **Catalog decides Explore.
> Access decides My Courses.
> Price never decides access.**

---

## 10. If Something Feels Wrong

Ask in this order:

1. Is `UserCourseAccess` created?
2. Is `accessType` correct?
3. Is `isGloballyFree` set correctly?
4. Is the free time window valid?

If UI feels complex → **server logic is wrong**.

---

**This document is the source of truth.
Do not bypass it.**
