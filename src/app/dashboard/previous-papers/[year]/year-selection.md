// /home/ankit/Desktop/September/new-questionbank/questionbankpro-dev/src/app/dashboard/previous-papers/[year]/year-selection.md

# Year Selection Module

## Overview
This page displays a filtered list of examination papers for a specific academic year. It allows users to filter by session (Summer/Winter) and search for specific subjects.

## File Structure
- `page.tsx`: UI for the year view. Includes search, session tabs, and the list of papers.
- `route.ts`: (Located in `src/api/dashboard/previous-papers/[year]`) API endpoint to fetch the list of papers for the requested year.

## Key Features
- **Session Tabs**: Toggle between Summer and Winter sessions.
- **Batch Download**: "Download Year Bundle" button to download all papers for the year (mocked).
- **Search**: Client-side filtering of the subject list.
- **Visual Indicators**: Color-coded dots for sessions.

## Technical Details
- **Dynamic Routing**: Uses `[year]` parameter.
- **Styling**: Consistent `bg-slate-950` dark theme.
- **API**: Returns a JSON array of `SubjectPaper` objects.