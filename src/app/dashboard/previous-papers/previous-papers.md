// src/app/dashboard/previous-papers/previous-papers.md

# Previous Papers Module

## Overview
This module serves as the digital archive for past examination papers. It allows users to browse papers by year, search by subject code, and view/download resources.

## File Structure
- `page.tsx`: Main dashboard UI. Displays stats, recent papers, and a grid of available academic years.
- `route.ts`: (Located in `src/app/api/dashboard/previous-papers`) API endpoint to fetch dashboard statistics and metadata.

## Key Features
- **Year Grid**: Visual navigation for academic years.
- **Search**: Client-side filtering (or API based) for subjects.
- **Recent Activity**: Quick access to newly uploaded materials.
- **Responsive Design**: Optimized for mobile with 48px touch targets.

## Technical Details
- **Styling**: Tailwind CSS with `bg-slate-950` theme.
- **Icons**: Lucide-react.
- **Data Fetching**: Fetches from the corresponding API route.
- **Security**: API routes require session authentication.