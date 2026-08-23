"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface DydQuestionCategory {
  id: number;
  name: string;
  type: number; // 1: Mcq, 2: Short question, 3: Written
  type_name: string;
  status: number; // 1: Active, 0: Inactive
  status_name: string;
}

export interface DydQuestionCategoriesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_categories: number;
    categories: DydQuestionCategory[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleDydQuestionCategoryResponse {
  success: boolean;
  message: string;
  code: number;
  data?: DydQuestionCategory;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET DYD QUESTION CATEGORIES (CACHED)
// =======================

export async function getDydQuestionCategoriesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<DydQuestionCategoriesResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.DYD_QUESTION_CATEGORIES);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/dyd/question-categories?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn(
        "No DYD question categories found (404). Returning empty list.",
      );
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token error.");
      return null;
    }
    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching DYD question categories");
      return null;
    }
  }
}

// =======================
// GET DYD QUESTION CATEGORIES WRAPPER
// =======================

export async function getDydQuestionCategories(
  params: Record<string, unknown> = {},
): Promise<DydQuestionCategoriesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getDydQuestionCategoriesCached(token, params);

  if (!_cachedResult)
    throw new Error("Failed to fetch DYD question categories from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE DYD QUESTION CATEGORY
// =======================

export async function getDydQuestionCategoryById(
  id: number | string,
): Promise<SingleDydQuestionCategoryResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/dyd/question-categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token error.");
      return null;
    }

    if (res.status === 404) {
      console.warn(
        "No DYD question categories found (404). Returning empty list.",
      );
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("Error in getDydQuestionCategoryById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch category details");
    } else {
      throw new Error("Failed to fetch category details");
    }
  }
}

// =======================
// CREATE DYD QUESTION CATEGORY
// =======================

export async function createDydQuestionCategory(payload: {
  name: string;
  type: number;
  status?: number;
}): Promise<SingleDydQuestionCategoryResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/dyd/question-categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.DYD_QUESTION_CATEGORIES);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createDydQuestionCategory:", error);
      throw new Error(error.message || "Failed to create category");
    } else {
      throw new Error("Failed to create category");
    }
  }
}

// =======================
// UPDATE DYD QUESTION CATEGORY
// =======================

export async function updateDydQuestionCategory(
  id: number | string,
  payload: { name: string; type: number; status?: number },
): Promise<SingleDydQuestionCategoryResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/dyd/question-categories/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.DYD_QUESTION_CATEGORIES);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateDydQuestionCategory:", error);
      throw new Error(error.message || "Failed to update category");
    } else {
      throw new Error("Failed to update category");
    }
  }
}

// =======================
// DELETE DYD QUESTION CATEGORY
// =======================

export async function deleteDydQuestionCategory(
  id: number | string,
): Promise<SingleDydQuestionCategoryResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/dyd/question-categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.DYD_QUESTION_CATEGORIES);
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteDydQuestionCategory:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to delete category");
    } else {
      throw new Error("Failed to delete category");
    }
  }
}
