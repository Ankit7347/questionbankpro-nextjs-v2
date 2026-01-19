# #!/bin/bash

# # ============================================================
# # QuestionbankPro – Exams App Layer Bootstrap
# # Scope: src/app/exams ONLY
# # Safe to run multiple times (idempotent)
# # ============================================================

# set -e

# create_dir() {
#   if [ ! -d "$1" ]; then
#     mkdir -p "$1"
#     echo "Created directory: $1"
#   fi
# }

# create_file() {
#   if [ ! -f "$1" ]; then
#     mkdir -p "$(dirname "$1")"
#     echo "// $1" > "$1"
#     echo "Created file: $1"
#   fi
# }

# echo "Initializing app/exams pages..."

# # ------------------------------------------------------------
# # Exams Root
# # ------------------------------------------------------------
# create_dir "src/app/exams"
# create_file "src/app/exams/page.tsx"

# # ------------------------------------------------------------
# # Exam Overview
# # ------------------------------------------------------------
# create_dir "src/app/exams/[examSlug]"
# create_file "src/app/exams/[examSlug]/page.tsx"

# # ------------------------------------------------------------
# # Syllabus Level
# # ------------------------------------------------------------
# create_dir "src/app/exams/[examSlug]/syllabus/[syllabusSlug]"
# create_file "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/page.tsx"

# # ------------------------------------------------------------
# # Subject Level
# # ------------------------------------------------------------
# create_dir "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]"
# create_file "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]/page.tsx"

# # ------------------------------------------------------------
# # Chapter Level
# # ------------------------------------------------------------
# create_dir "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]/chapter/[chapterSlug]"
# create_file "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]/chapter/[chapterSlug]/page.tsx"

# # ------------------------------------------------------------
# # Topic Level (Questions Entry)
# # ------------------------------------------------------------
# create_dir "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]/chapter/[chapterSlug]/topic/[topicSlug]"
# create_file "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]/chapter/[chapterSlug]/topic/[topicSlug]/page.tsx"

# echo "app/exams architecture initialized successfully."
#!/bin/bash

# ============================================================
# QuestionbankPro – Exams Sidebar UI Bootstrap
# Scope: src/components/exams/sidebar ONLY
# ============================================================

set -e

# create_file() {
#   if [ ! -f "$1" ]; then
#     mkdir -p "$(dirname "$1")"
#     echo "// $1" > "$1"
#     echo "Created file: $1"
#   fi
# }

# echo "Initializing Exams Sidebar UI..."

# create_file "src/components/exams/sidebar/ExamSidebar.tsx"
# create_file "src/components/exams/sidebar/SidebarSubject.tsx"
# create_file "src/components/exams/sidebar/SidebarChapter.tsx"
# create_file "src/components/exams/sidebar/index.ts"

# echo "✅ Exams Sidebar UI initialized."
#!/usr/bin/env bash

BASE_DIR="src/models/mongoose"

FILES=(
  "Exam.schema.ts"
  "SubExam.schema.ts"
  "OfficialSyllabus.schema.ts"
  "SubjectMap.schema.ts"
  "Course.schema.ts"
  "CourseSubjectAccessMap.schema.ts"
)

# Ensure base directory exists
mkdir -p "$BASE_DIR"

for FILE in "${FILES[@]}"; do
  FILE_PATH="$BASE_DIR/$FILE"

  if [ -f "$FILE_PATH" ]; then
    echo "✔ Exists: $FILE_PATH"
  else
    touch "$FILE_PATH"
    echo "➕ Created: $FILE_PATH"
  fi
done

echo "✅ Schema file check completed."
