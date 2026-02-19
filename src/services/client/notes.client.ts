// src/services/client/notes.client.ts
/**
 * Notes Client Service
 * ====================
 *
 * Responsibility:
 * - Client-side gateway for notes API
 * - Handles all fetch calls to /api/dashboard/notes/*
 *
 * Rules:
 * - NO business logic
 * - NO mongoose imports
 * - Returns UI DTOs only
 * - All responses wrapped in ApiResponseUI<T>
 */

import { ApiResponseUI } from "@/dto/apiResponse.ui.dto";
import { SubjectChaptersData, ChapterTopicsData, TopicNotesData } from "@/dto/notes.ui.dto";

/**
 * Get base URL for fetch calls
 * For server components: uses root URL (http://localhost:3000)
 * For client components: uses window.location.origin
 * Handles NEXT_PUBLIC_APP_URL which might include /api suffix
 */
function getBaseUrl(): string {
    if (typeof window !== 'undefined') {
        // Client-side: use browser origin
        return window.location.origin;
    }
    // Server-side: construct from environment
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    // Strip /api suffix from NEXT_PUBLIC_APP_URL if present
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/api\/?$/, '') || 'localhost:3000';
    const host = appUrl.replace(/^https?:\/\//, '');
    return `${protocol}://${host}`;
}

/**
 * Fetch chapters for a subject
 * route: GET /api/dashboard/notes/[subjectSlug]
 * 
 * @param subjectSlug - Subject slug
 * @returns Subject with chapters, stats, and progress
 */
export async function fetchSubjectChapters(
    subjectSlug: string
): Promise<ApiResponseUI<SubjectChaptersData>> {
    try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/dashboard/notes/${subjectSlug}`, {
            cache: "no-store",
            credentials: "include",
        });

        if (!res.ok) {
            return {
                success: false,
                data: null,
                error: "Failed to fetch subject chapters",
                statusCode: res.status,
            };
        }

        const response: ApiResponseUI<SubjectChaptersData> = await res.json();
        return response;
    } catch (error) {
        console.error("[notes.client] fetchSubjectChapters error:", error);
        return {
            success: false,
            data: null,
            error: "Network error while fetching subject chapters",
            statusCode: 500,
        };
    }
}

/**
 * Fetch topics within a chapter
 * route: GET /api/dashboard/notes/[subjectSlug]/[chapterId]
 * 
 * @param subjectSlug - Subject slug
 * @param chapterId - Chapter ID
 * @returns Chapter with topics and progress
 */
export async function fetchChapterTopics(
    subjectSlug: string,
    chapterId: string
): Promise<ApiResponseUI<ChapterTopicsData>> {
    try {
        const baseUrl = getBaseUrl();
        const res = await fetch(
            `${baseUrl}/api/dashboard/notes/${subjectSlug}/${chapterId}`,
            { 
                cache: "no-store",
                credentials: "include",
            }
        );

        if (!res.ok) {
            return {
                success: false,
                data: null,
                error: "Failed to fetch chapter topics",
                statusCode: res.status,
            };
        }

        const response: ApiResponseUI<ChapterTopicsData> = await res.json();
        return response;
    } catch (error) {
        console.error("[notes.client] fetchChapterTopics error:", error);
        return {
            success: false,
            data: null,
            error: "Network error while fetching chapter topics",
            statusCode: 500,
        };
    }
}

/**
 * Fetch notes for a topic
 * route: GET /api/dashboard/notes/[subjectSlug]/[chapterId]/[topicId]
 * 
 * @param subjectSlug - Subject slug
 * @param chapterId - Chapter ID
 * @param topicId - Topic ID
 * @returns Topic notes and content
 */
export async function fetchTopicNotes(
    subjectSlug: string,
    chapterId: string,
    topicId: string
): Promise<ApiResponseUI<TopicNotesData>> {
    try {
        const baseUrl = getBaseUrl();
        const res = await fetch(
            `${baseUrl}/api/dashboard/notes/${subjectSlug}/${chapterId}/${topicId}`,
            { 
                cache: "no-store",
                credentials: "include",
            }
        );

        if (!res.ok) {
            return {
                success: false,
                data: null,
                error: "Failed to fetch topic notes",
                statusCode: res.status,
            };
        }

        const response: ApiResponseUI<TopicNotesData> = await res.json();
        return response;
    } catch (error) {
        console.error("[notes.client] fetchTopicNotes error:", error);
        return {
            success: false,
            data: null,
            error: "Network error while fetching topic notes",
            statusCode: 500,
        };
    }
}

/**
 * Track note view (record user activity)
 * route: POST /api/dashboard/notes/track
 * 
 * @param topicId - Topic ID viewed
 * @param duration - Time spent (seconds)
 * @returns Success status
 */
export async function trackNoteView(
    topicId: string,
    duration: number
): Promise<ApiResponseUI<{ tracked: boolean }>> {
    try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/dashboard/notes/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ topicId, duration }),
        });

        if (!res.ok) {
            return {
                success: false,
                data: null,
                error: "Failed to track note view",
                statusCode: res.status,
            };
        }

        const response: ApiResponseUI<{ tracked: boolean }> = await res.json();
        return response;
    } catch (error) {
        console.error("[notes.client] trackNoteView error:", error);
        return {
            success: false,
            data: null,
            error: "Network error while tracking note view",
            statusCode: 500,
        };
    }
}
