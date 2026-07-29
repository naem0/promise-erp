"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface CRMCategory {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  status: number;
  status_text: string;
  total_lead: number;
}

export interface CRMCategoriesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_categories: number;
    categories: CRMCategory[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleCRMCategoryResponse {
  success: boolean;
  message: string;
  code: number;
  data: CRMCategory;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET CATEGORIES (CACHED)
// =======================

export async function getCRMCategoriesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<CRMCategoriesResponse> {
  "use cache: remote";
  cacheTag("crm-categories-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/crm/categories?${urlParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
        const result = await res.json();
        return result;
    }
    const result = await res.json();

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching CRM categories");
    }
  }
}

// =======================
// GET CATEGORIES WRAPPER
// =======================

export async function getCRMCategories(
  params: Record<string, unknown> = {},
): Promise<CRMCategoriesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getCRMCategoriesCached(token, params);


  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");


  return _cachedResult;
}

// =======================
// GET SINGLE CATEGORY
// =======================

export async function getCRMCategoryById(
  id: number,
): Promise<SingleCRMCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
        const result = await res.json();
        return result;
    }

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in getCRMCategoryById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch CRM category");
    } else {
      throw new Error("Failed to fetch CRM category");
    }
  }
}

// =======================
// CREATE CATEGORY
// =======================

export async function createCRMCategory(
  formData: FormData,
): Promise<SingleCRMCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("crm-categories-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createCRMCategory:", error);
      throw new Error(error.message || "Failed to create CRM category");
    } else {
      throw new Error("Failed to create CRM category");
    }
  }
}

// =======================
// UPDATE CATEGORY
// =======================

export async function updateCRMCategory(
  id: number,
  formData: FormData,
): Promise<SingleCRMCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    if (!formData.has("_method")) {
        formData.append("_method", "PUT");
    }

    const res = await fetch(`${API_BASE}/crm/categories/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("crm-categories-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateCRMCategory:", error);
      throw new Error(error.message || "Failed to update CRM category");
    } else {
      throw new Error("Failed to update CRM category");
    }
  }
}

// =======================
// DELETE CATEGORY
// =======================

export async function deleteCRMCategory(
  id: number,
): Promise<SingleCRMCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session/token");
    }

    const res = await fetch(`${API_BASE}/crm/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("crm-categories-list");
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteCRMCategory:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete CRM category");
    }
  }
}
