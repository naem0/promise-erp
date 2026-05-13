"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { handleApiError, processApiResponse } from "@/lib/apiErrorHandler";
import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// Batch
export interface ChapterBatch {
  id: number;
  name: string;
}

// Course
export interface ChapterCourse {
  id: number;
  title: string;
}
  
// Branch
export interface ChapterBranch {
  id: number;
  name: string;
}

// Chapter main interface (detailed)
export interface Chapter {
  id: number;
  batch_id: number;
  course_id: number;
  branch_id: number;
  title: string;
  bn_title?: string;
  description: string;
  status: number;
  batch: ChapterBatch;
  course: ChapterCourse;
  branch: ChapterBranch;
  lessons_count: number;
}

// Simple Chapter interface for dropdowns/lists
export interface SimpleChapter {
  id: number;
  title: string;
  bn_title: string;
}

// GET Chapters Response
export interface ChaptersResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_chapters: number;
    chapters: Chapter[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

// Single Chapter Response
export interface SingleChapterResponse {
  success: boolean;
  message: string;
  code: number;
  data?: Chapter | null;
  errors?: Record<string, string[] | string>;
}

// Simple Chapter Response (for dropdowns)
export interface ChapterResponse {
  success: boolean;
  message: string;
  data: {
    chapters: SimpleChapter[];
  };
}

// =======================
//  GET CHAPTERS (Paginated)
// =======================

export async function getChaptersCached(
  page = 1,
  token: string,
  params: Record<string, unknown> = {}
): Promise<ChaptersResponse | null> {
  "use cache";
  cacheTag("chapters-list");

  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
  try {
    const urlParams = new URLSearchParams();
    urlParams.append("page", page.toString());

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key]!.toString());
      }
    }

    const res = await fetch(`${API_BASE}/chapters?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Chapters fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getChaptersCached:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getChapters(
  page = 1,
  params: Record<string, unknown> = {}
): Promise<ChaptersResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const result = await getChaptersCached(page, token, params);
  if (!result) throw new Error("Failed to fetch chapters.");
  return result;
}

// =======================
// GET SIMPLE CHAPTERS (for dropdowns - no pagination)
// =======================

export async function getSimpleChapters(): Promise<ChapterResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/chapters`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch chapters");
    }

    return res.json();
  } catch (error) {
    console.error("Error in getSimpleChapters:", error);
    throw error;
  }
}

// =======================
// GET SINGLE CHAPTER
// =======================

export async function getChapterById(id: number): Promise<SingleChapterResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/chapters/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch chapter: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getChapterById:", error);
    throw error;
  }
}

// =======================
// CREATE CHAPTER (POST)
// =======================

export interface ChapterFormData {
  batch_id: number;
  course_id: number;
  branch_id: number;
  title: string;
  description: string;
  status: number;
}

export async function createChapter(
  chapterFormData: ChapterFormData
): Promise<SingleChapterResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
      };
    }

    const res = await fetch(`${API_BASE}/chapters`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chapterFormData),
    });

    const result = await processApiResponse(res, "Failed to create chapter");

    if (!result.success) {
    return {
      success: false,
      message: result.message,
      errors: result.errors,
      code: result.code || 500,
    };
    }

    updateTag("chapters-list");
    return {
      success: true,
      message: result.message || "Chapter created successfully",
      data: result.data,
      code: result.code || 200,
    };
  } catch (error) {
    const errorResult = await handleApiError(error, "Failed to create chapter");
    return {
      success: false,
      message: errorResult.message,
      code: errorResult.code,
    };
  }
}

// =======================
// UPDATE CHAPTER (PATCH)
// =======================

export interface ChapterUpdateFormData {
  batch_id: number;
  course_id: number;
  branch_id: number;
  title: string;
  description: string;
  status: number;
}

export async function updateChapter(
  id: number,
  updateData: ChapterUpdateFormData
): Promise<SingleChapterResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
      };
    }

    const res = await fetch(`${API_BASE}/chapters/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await processApiResponse(res, "Failed to update chapter");

    if (!result.success) {
    return {
      success: false,
      message: result.message,
      errors: result.errors,
      code: result.code || 500,
    };
    }

    updateTag("chapters-list");
    return {
      success: true,
      message: result.message || "Chapter updated successfully",
      data: result.data,
      code: result.code || 200,
    };
  } catch (error) {
    const errorResult = await handleApiError(error, "Failed to update chapter");
    return {
      success: false,
      message: errorResult.message,
      code: errorResult.code,
    };
  }
}

// =======================
// DELETE CHAPTER
// =======================

export async function deleteChapter(id: number): Promise<SingleChapterResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
      };
    }

    const res = await fetch(`${API_BASE}/chapters/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await processApiResponse(res, "Failed to delete chapter");

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        code: result.code,
      };
    }

    updateTag("chapters-list");
    return {
      success: true,
      message: result.message || "Chapter deleted successfully",
      data: result.data,
      code: result.code || 200,
    };
  } catch (error) {
    const errorResult = await handleApiError(error, "Failed to delete chapter");
    return {
      success: false,
      message: errorResult.message,
      code: errorResult.code,
    };
  }
}
