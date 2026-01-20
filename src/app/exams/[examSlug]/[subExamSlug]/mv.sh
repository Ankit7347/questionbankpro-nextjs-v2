#!/bin/bash

set -e

echo "🚀 Splitting routes into (syllabus), (learning), (assessment)..."

# -------------------------------------------------
# Create route groups
# -------------------------------------------------
mkdir -p "(syllabus)"
mkdir -p "(learning)"
mkdir -p "(assessment)"

# -------------------------------------------------
# Move syllabus folder ONLY
# -------------------------------------------------
if [ -d "syllabus" ]; then
  mv syllabus "(syllabus)/syllabus"
  echo "✅ syllabus/ → (syllabus)/syllabus"
else
  echo "⚠️  syllabus/ not found"
fi

# -------------------------------------------------
# Move subject tree (NO rename, NO URL change)
# -------------------------------------------------
if [ -d "[subjectSlug]" ]; then
  mv "[subjectSlug]" "(learning)/[subjectSlug]"
  echo "✅ [subjectSlug]/ → (learning)/[subjectSlug]"
else
  echo "⚠️  [subjectSlug]/ not found"
fi

# -------------------------------------------------
# Move assessment routes
# -------------------------------------------------
for dir in practice pyq tests; do
  if [ -d "$dir" ]; then
    mv "$dir" "(assessment)/$dir"
    echo "✅ $dir/ → (assessment)/$dir"
  fi
done

# -------------------------------------------------
# Move layouts carefully
# -------------------------------------------------
if [ -f "layout.tsx" ]; then
  echo "⚠️  layout.tsx exists at root."
  echo "👉 Move it manually to (learning)/layout.tsx or (syllabus)/layout.tsx as needed."
fi

echo "🎯 Route group split completed successfully"
