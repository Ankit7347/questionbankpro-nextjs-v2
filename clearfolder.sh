# create models directory if not exists
# mkdir -p src/models
# mkdir -p src/models/mongoose
# # clear and recreate base entity
# : > src/models/BaseEntity.ts

# # clear and recreate core academic models
# : > src/models/EducationLevel.ts
# : > src/models/Course.ts
# : > src/models/Exam.ts
# : > src/models/Syllabus.ts
# : > src/models/Subject.ts
# : > src/models/Chapter.ts
# : > src/models/Topic.ts
# : > src/models/CompetitiveTopicMap.ts
# : > src/models/Question.ts
# : > src/models/Quiz.ts


# : > src/models/mongoose/base.schema.ts
# : > src/models/mongoose/EducationLevel.schema.ts
# : > src/models/mongoose/Course.schema.ts
# : > src/models/mongoose/Exam.schema.ts
# : > src/models/mongoose/Syllabus.schema.ts
# : > src/models/mongoose/Subject.schema.ts
# : > src/models/mongoose/Chapter.schema.ts
# : > src/models/mongoose/Topic.schema.ts
# : > src/models/mongoose/CompetitiveTopicMap.schema.ts
# : > src/models/mongoose/Question.schema.ts
# : > src/models/mongoose/Quiz.schema.ts

# # Create directories
# mkdir -p src/models/mongoose
# mkdir -p src/models/dto
# mkdir -p src/validation

# # Mongoose schema files
# : > src/models/mongoose/BestBook.schema.ts
# : > src/models/mongoose/ContactUs.schema.ts
# : > src/models/mongoose/GeolocationState.schema.ts
# : > src/models/mongoose/GeolocationDistrict.schema.ts
# : > src/models/mongoose/ResetToken.schema.ts
# : > src/models/mongoose/User.schema.ts

# # DTO mapper files
# : > src/models/dto/bestBook.mapper.ts
# : > src/models/dto/contactUs.mapper.ts
# : > src/models/dto/geolocation.mapper.ts
# : > src/models/dto/user.mapper.ts

# # Zod validation files
# : > src/validation/bestBook.schema.ts
# : > src/validation/contactUs.schema.ts
# : > src/validation/geolocation.schema.ts
# : > src/validation/user.schema.ts

# mkdir -p src/services
# : > src/services/educationLevel.service.ts
# : > src/services/course.service.ts
# : > src/services/exam.service.ts
# : > src/services/syllabus.service.ts
# : > src/services/subject.service.ts
# : > src/services/chapter.service.ts
# : > src/services/topic.service.ts
# : > src/services/question.service.ts
# : > src/services/quiz.service.ts
# : > src/services/bestBook.service.ts
# : > src/services/contactUs.service.ts
# : > src/services/user.service.ts

# echo "✔ All 10 model files cleared and ready in src/models"
#!/bin/bash

# ============================================
# Admin Dashboard Route Initializer
# Project: Questionbankpro
# Purpose:
# - Creates admin dashboard routes
# - Adds placeholder page.tsx files
# - NO business logic
# - Safe to run once
# ============================================

BASE_DIR="src/app/(admin)/admin"

echo "Initializing Admin Dashboard structure..."

# ---------- DASHBOARD ----------
mkdir -p $BASE_DIR/dashboard
cat <<EOF > $BASE_DIR/dashboard/page.tsx
/**
 * Path: /admin/dashboard
 * Role:
 * - Entry point for Admin Control Panel
 * - Navigation-only page
 * - NO data fetching
 * - NO business logic
 */
export default function AdminDashboardPage() {
  return <h1 className="text-xl font-bold">Admin Dashboard</h1>;
}
EOF

# ---------- EXAMS ----------
mkdir -p $BASE_DIR/exams
cat <<EOF > $BASE_DIR/exams/page.tsx
/**
 * Path: /admin/exams
 * Role:
 * - Manage Exam & SubExam
 * - Create / Update / Disable exams
 * - Structural hierarchy only
 */
export default function AdminExamsPage() {
  return <h1>Exam Management (Coming Soon)</h1>;
}
EOF

# ---------- SYLLABUS ----------
mkdir -p $BASE_DIR/syllabus
cat <<EOF > $BASE_DIR/syllabus/page.tsx
/**
 * Path: /admin/syllabus
 * Role:
 * - Manage Official Syllabus
 * - Subjects, Chapters, Topics
 * - Academic content ONLY
 */
export default function AdminSyllabusPage() {
  return <h1>Syllabus Management (Coming Soon)</h1>;
}
EOF

# ---------- MAPPINGS ----------
mkdir -p $BASE_DIR/mappings
cat <<EOF > $BASE_DIR/mappings/page.tsx
/**
 * Path: /admin/mappings
 * Role:
 * - SubjectMap
 * - ChapterMap
 * - TopicMap
 * - Relationship configuration layer
 */
export default function AdminMappingsPage() {
  return <h1>Syllabus Mapping Console (Coming Soon)</h1>;
}
EOF

# ---------- COURSES ----------
mkdir -p $BASE_DIR/courses
cat <<EOF > $BASE_DIR/courses/page.tsx
/**
 * Path: /admin/courses
 * Role:
 * - Commercial Course management
 * - Pricing, validity, activation
 * - Bound to SubExam
 */
export default function AdminCoursesPage() {
  return <h1>Course Management (Coming Soon)</h1>;
}
EOF

# ---------- COUPONS ----------
mkdir -p $BASE_DIR/coupons
cat <<EOF > $BASE_DIR/coupons/page.tsx
/**
 * Path: /admin/coupons
 * Role:
 * - Coupon creation
 * - Access rules
 * - Discounts & offers
 */
export default function AdminCouponsPage() {
  return <h1>Coupons & Access (Coming Soon)</h1>;
}
EOF

# ---------- QUESTIONS ----------
mkdir -p $BASE_DIR/questions
cat <<EOF > $BASE_DIR/questions/page.tsx
/**
 * Path: /admin/questions
 * Role:
 * - Question Bank
 * - Quiz creation
 * - Submissions (future)
 */
export default function AdminQuestionsPage() {
  return <h1>Question Bank (Coming Soon)</h1>;
}
EOF

# ---------- USERS ----------
mkdir -p $BASE_DIR/users
cat <<EOF > $BASE_DIR/users/page.tsx
/**
 * Path: /admin/users
 * Role:
 * - User management
 * - Admin / Student roles
 * - Account controls
 */
export default function AdminUsersPage() {
  return <h1>User Management (Coming Soon)</h1>;
}
EOF

echo "Admin Dashboard routes initialized successfully."

