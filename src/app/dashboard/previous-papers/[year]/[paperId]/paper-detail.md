// src/app/dashboard/previous-papers/[year]/[paperId]/paper-detail.md

# Paper Detail Module

## Overview
This page serves as the viewer for a specific examination paper. It provides a preview of the document, metadata details, and actions like downloading or printing.

## File Structure
- `page.tsx`: UI for the paper viewer. Contains the PDF placeholder, sidebar with metadata, and action buttons.
- `route.ts`: (Located in `src/api/dashboard/previous-papers/[year]/[paperId]`) API endpoint to fetch specific paper details and secure download URLs.

## Key Features
- **Document Preview**: Central area for PDF viewing (currently a placeholder).
- **Metadata Sidebar**: Displays duration, marks, difficulty, etc.
- **Action Bar**: Sticky header with Download and Print options.
- **Related Papers**: Quick links to similar papers from other years.
- **Solution Toggle**: Option to view the marking scheme if available.

## Technical Details
- **Dynamic Routing**: Uses `[year]` and `[paperId]` parameters.
- **Responsive Layout**: Sidebar collapses or stacks on mobile.
- **Secure Access**: API verifies session before returning download links.