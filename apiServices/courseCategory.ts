// apiServices/courseCategory.ts
"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { handleApiError, processApiResponse } from "@/lib/apiErrorHandler";
import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface CourseCategory {
  id: number;
  name: string;
  slug: string;
  status: number;
}



export interface CourseCategoriesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_categories: number;
    categories: CourseCategory[];
    pagination: PaginationType;
  };
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  code: number;
  data: CourseCategory | null;
  errors?: Record<string, string[] | string>;
}

export interface CreateCategoryRequest {
  name: string;
  status: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  status?: number;
}


// =======================
//  Get Course Categories (Paginated)
// =======================

export async function getCourseCategoriesCached(
  page = 1,
  token: string,
  params: Record<string, unknown> = {}
): Promise<CourseCategoriesResponse | null> {
  "use cache";
  cacheTag("course-categories-list");

  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();
    urlParams.append("page", page.toString());

    for (const key in params) {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params.hasOwnProperty(key)
      ) {
        urlParams.append(key, params[key].toString());
      }
    }

    const res = await fetch(`${API_BASE}/course-categories?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: CourseCategoriesResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getCourseCategoriesCached:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getCourseCategories(
  page = 1,
  params: Record<string, unknown> = {}
): Promise<CourseCategoriesResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const _cachedResult = await getCourseCategoriesCached(page, token, params);

    if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

    return _cachedResult;
  } catch (error) {
    console.error("Error in getCourseCategories:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get course categories"
    );
  }
}

// =======================
//  Get CourseCategory By ID
// =======================
export async function getCourseCategoryById(
  id: number
): Promise<SingleCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
        data: null,
      };
    }

    const res = await fetch(`${API_BASE}/course-categories/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch course category: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getCourseCategoryById:", error);
    throw error;
  }
}

// =======================
//  Create CourseCategory
// =======================
export async function createCourseCategory(categoryData: CreateCategoryRequest): Promise<SingleCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
        data: null,
      };
    }

    const url = `${API_BASE}/course-categories`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData)
    });

    const result = await processApiResponse(response, "Failed to create course category");

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: result.errors,
        code: result.code,
        data: null,
      };
    }

    updateTag("course-categories-list");
    return {
      success: true,
      message: result.message || "Course category created successfully",
      data: result.data || null,
      code: result.code || 200,
    };
  } catch (error) {
    const errorResult = await handleApiError(error, "Failed to create course category");
    return {
      success: false,
      message: errorResult.message,
      code: errorResult.code,
      data: null,
    };
  }
}


// =======================
//  PUT update category
// =======================
export async function updateCourseCategory(id: number, categoryData: UpdateCategoryRequest): Promise<SingleCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
        data: null,
      };
    }

    const url = `${API_BASE}/course-categories/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData)
    });

    const result = await processApiResponse(response, "Failed to update course category");

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: result.errors,
        code: result.code,
        data: null,
      };
    }

    updateTag("course-categories-list");
    return {
      success: true,
      message: result.message || "Course category updated successfully",
      data: result.data || null,
      code: result.code || 200,
    };
  } catch (error) {
    const errorResult = await handleApiError(error, "Failed to update course category");
    return {
      success: false,
      message: errorResult.message,
      code: errorResult.code,
      data: null,
    };
  }
}

// =======================
//  DELETE category
// =======================
export async function deleteCourseCategory(id: number): Promise<SingleCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
        data: null,
      };
    }

    const url = `${API_BASE}/course-categories/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await processApiResponse(response, "Failed to delete course category");

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        code: result.code,
        data: null,
      };
    }

    updateTag("course-categories-list");
    return {
      success: true,
      message: result.message || "Course category deleted successfully",
      data: result.data || null,
      code: result.code || 200,
    };
  } catch (error) {
    const errorResult = await handleApiError(error, "Failed to delete course category");
    return {
      success: false,
      message: errorResult.message,
      code: errorResult.code,
      data: null,
    };
  }
}
