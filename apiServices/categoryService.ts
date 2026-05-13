// apiServices/categoryService.ts
"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface Category {
  id: number;
  name: string;
  slug: string;
  status: number;
  image?: string | null;
  meta_title?: string;
  meta_description?: string;
  meta_tag?: string[];
  schema?: string;
  total_course?: number;
}



export interface CategoriesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_categories: number;
    section_subtitle?: string;
    section_title?: string;
    categories?: Category[];
    pagination?: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  code?: number;
  data?: Category | null;
  errors?: Record<string, string[] | string>;
}

export interface CreateCategoryRequest {
  name?: string;
  status?: number;
  image?: string | null;
  meta_title?: string;
  meta_description?: string;
  meta_tag?: string[];
  schema?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  status?: number;
  image?: string | null;
  meta_title?: string;
  meta_description?: string;
  meta_tag?: string[];
  schema?: string;
}


// =======================
//  Get Categories (Paginated)
// =======================

export async function getCategoriesCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<CategoriesResponse | null> {
  "use cache";
  cacheTag("categories-list");

  try {
    const urlParams = new URLSearchParams();
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
    const data: CategoriesResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getCategoriesCached:", error.message);
      console.error("Cache error:", "Error fetching categories");

      return null;
    } else {
      console.error("Cache error:", "Error fetching categories");

      return null;
    }
  }
}

export async function getCategories(
  params: Record<string, unknown> = {}
): Promise<CategoriesResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const _cachedResult = await getCategoriesCached(token, params);


    if (!_cachedResult) throw new Error("Failed to fetch data from cache.");


    return _cachedResult;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Categories API Error:", error.message);
      throw new Error("Error fetching categories");
    } else {
      throw new Error("Error fetching categories");
    }
  }
}

// =======================
//  Get Category By ID
// =======================
export async function getCategoryById(
  id: number
): Promise<SingleCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/course-categories/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: SingleCategoryResponse = await res.json();
    return data;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getCategoryById:", error.message);
      throw new Error("Error fetching category by ID");
    } else {
      throw new Error("Error fetching category by ID");
    }
  }
}

// =======================
//  Create Category
// =======================
export async function createCategory(categoryData: FormData): Promise<SingleCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return { success: false, message: "No valid session or access token found.", code: 401 };
    }

    const url = `${API_BASE}/course-categories`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: categoryData
    });

    const result = await response.json();

    updateTag("categories-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createCategory:", error.message);
      throw new Error("Error creating category");
    } else {
      throw new Error("Error creating category");
    }
  }
}


// =======================
//  PUT update category
// =======================
export async function updateCategory(id: number, formData: FormData): Promise<SingleCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return { success: false, message: "No valid session or access token found.", code: 401 };
    }

    const url = `${API_BASE}/course-categories/${id}`;
    formData.append("_method", "PATCH");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData
    });

    const result = await response.json();

    updateTag("categories-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateCategory:", error.message);
      throw new Error("Error updating category");
    } else {
      throw new Error("Error updating category");
    }
  }
}

// =======================
//  DELETE category
// =======================
export async function deleteCategory(id: number): Promise<SingleCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return { success: false, message: "No valid session or access token found.", code: 401 };
    }

    const url = `${API_BASE}/course-categories/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    updateTag("categories-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in deleteCategory:", error.message);
      throw new Error("Error deleting category");
    } else {
      throw new Error("Error deleting category");
    }
  }
}


// functions for home page getHomeCourseCategories ---

export async function getHomeCourseCategories(): Promise<CategoriesResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/public/course-categories/with-count`
    );

    if (res.status === 404) {
      console.warn("Home Course Categories API returned 404 Not Found");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `Home Course Categories API failed: ${res.status} ${res.statusText}`
      );
    }

    const data: CategoriesResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Home Course Categories API Error:", error.message);
    } else {
      console.error("Home Course Categories API Error: Unknown error");
    }
    return null;
  }
}

