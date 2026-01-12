#!/bin/bash

# ============================================================
# QuestionbankPro – Exams App Layer Bootstrap
# Scope: src/app/exams ONLY
# Safe to run multiple times (idempotent)
# ============================================================

set -e

create_dir() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1"
    echo "Created directory: $1"
  fi
}

create_file() {
  if [ ! -f "$1" ]; then
    mkdir -p "$(dirname "$1")"
    echo "// $1" > "$1"
    echo "Created file: $1"
  fi
}

echo "Initializing app/exams pages..."

# ------------------------------------------------------------
# Exams Root
# ------------------------------------------------------------
create_dir "src/app/exams"
create_file "src/app/exams/page.tsx"

# ------------------------------------------------------------
# Exam Overview
# ------------------------------------------------------------
create_dir "src/app/exams/[examSlug]"
create_file "src/app/exams/[examSlug]/page.tsx"

# ------------------------------------------------------------
# Syllabus Level
# ------------------------------------------------------------
create_dir "src/app/exams/[examSlug]/syllabus/[syllabusSlug]"
create_file "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/page.tsx"

# ------------------------------------------------------------
# Subject Level
# ------------------------------------------------------------
create_dir "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]"
create_file "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]/page.tsx"

# ------------------------------------------------------------
# Chapter Level
# ------------------------------------------------------------
create_dir "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]/chapter/[chapterSlug]"
create_file "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]/chapter/[chapterSlug]/page.tsx"

# ------------------------------------------------------------
# Topic Level (Questions Entry)
# ------------------------------------------------------------
create_dir "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]/chapter/[chapterSlug]/topic/[topicSlug]"
create_file "src/app/exams/[examSlug]/syllabus/[syllabusSlug]/subject/[subjectSlug]/chapter/[chapterSlug]/topic/[topicSlug]/page.tsx"

echo "app/exams architecture initialized successfully."
