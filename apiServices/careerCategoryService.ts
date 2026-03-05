"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { updateTag, cacheTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface CareerCategory {
  id: number;
  name: string;
  slug: string;
  status: number;
  meta_title: string;
  meta_description: string;
  meta_tag: string[];
  schema?: string;
}

export interface CareerCategoryResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_career_categories: number;
    career_categories: CareerCategory[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleCareerCategoryResponse {
  success: boolean;
  message: string;
  code: number;
  data: CareerCategory;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET CAREER CATEGORIES (CACHED)
// =======================

export async function getCareerCategoriesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<CareerCategoryResponse> {
  "use cache";
  cacheTag("career-categories-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        Object.prototype.hasOwnProperty.call(params, key)
      ) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/career-categories?${urlParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getCareerCategoriesCached:", error);
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching career categories");
    }
  }
}

// =======================
// GET CAREER CATEGORIES WRAPPER
// =======================

export async function getCareerCategories(
  params: Record<string, unknown> = {},
): Promise<CareerCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session or access token found.");

    return await getCareerCategoriesCached(token, params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Career categories API error:", error);
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching career categories");
    }
  }
}

// =======================
// GET SINGLE CAREER CATEGORY
// =======================

export async function getCareerCategoryById(
  id: string,
): Promise<SingleCareerCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/career-categories/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    return data;
  } catch (error: unknown) {
    console.error("Error fetching career category:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch career category");
    }
    throw new Error("Failed to fetch career category");
  }
}

// =======================
// CREATE CAREER CATEGORY
// =======================

export async function createCareerCategory(
  formData: FormData,
): Promise<SingleCareerCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/career-categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();

    updateTag("career-categories-list");
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating career category:", error);
      throw new Error(error.message || "Failed to create career category");
    }
    throw new Error("Failed to create career category");
  }
}

// =======================
// UPDATE CAREER CATEGORY
// =======================

export async function updateCareerCategory(
  id: number,
  formData: FormData,
): Promise<SingleCareerCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/career-categories/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    updateTag("career-categories-list");
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating career category:", error);
      throw new Error(error.message || "Failed to update career category");
    } else {
      throw new Error("Failed to update career category");
    }
  }
}

// =======================
// DELETE CAREER CATEGORY
// =======================

export async function deleteCareerCategory(
  id: number,
): Promise<SingleCareerCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/career-categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    updateTag("career-categories-list");
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting career category:", error);
      throw new Error(error.message || "Failed to delete career category");
    }
    throw new Error("Failed to delete career category");
  }
}
