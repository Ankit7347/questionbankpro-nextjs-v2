// src/app/dashboard/notes/README.md
# Notes Module - Library Hub

## Overview
The **Notes Module** serves as the central library for students to access chapter-wise notes, summaries, and interactive learning materials. This directory (`/notes`) contains the main entry point for the module.

## File Structure
- **page.tsx**: The main UI for the Notes Library. Displays a grid of subjects, a global search bar, and a "Quick Resume" section.
- **route.ts** (located in `src/app/api/dashboard/notes/`): The API endpoint responsible for fetching the overview data (subjects list, stats).

## Features
- **Subject Grid**: Responsive cards for each subject with progress indicators.
- **Global Search**: Sticky search bar to filter content.
- **Quick Resume**: Deep link to the last accessed topic.
- **Stats**: Overview of total notes available.

## Technical Details
- **Styling**: Tailwind CSS with a strict dark mode theme (`bg-slate-950`).
- **Icons**: Lucide React.
- **Responsiveness**: Mobile-first design with minimum 48px touch targets.