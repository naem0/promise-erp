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

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  parent_name?: string;
  ancestors?: { id: number; name: string }[] | null;
  status: number;
  products_count: number;
  children_count: number;
}

export interface ProductCategoriesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_categories: number;
    categories: ProductCategory[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleProductCategoryResponse {
  success: boolean;
  message: string;
  code: number;
  data: ProductCategory;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET CATEGORIES (CACHED)
// =======================

export async function getProductCategoriesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<ProductCategoriesResponse | null> {
  "use cache";
  cacheTag("product-categories-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/product-categories?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No categories found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
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
      console.error("Service error:", "Error fetching product categories");
      return null;
    }
  }
}

// =======================
// GET CATEGORIES WRAPPER
// =======================

export async function getProductCategories(
  params: Record<string, unknown> = {},
): Promise<ProductCategoriesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getProductCategoriesCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE CATEGORY
// =======================

export async function getProductCategoryById(
  id: number,
): Promise<SingleProductCategoryResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/product-categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      console.warn("No categories found (404). Returning empty list.");
      return null;
    }
    if (res.status === 401) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }
    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in getProductCategoryById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch product category");
    } else {
      throw new Error("Failed to fetch product category");
    }
  }
}

// =======================
// CREATE CATEGORY
// =======================

export async function createProductCategory(
  formData: FormData,
): Promise<SingleProductCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/product-categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("product-categories-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createProductCategory:", error);
      throw new Error(error.message || "Failed to create product category");
    } else {
      throw new Error("Failed to create product category");
    }
  }
}

// =======================
// UPDATE CATEGORY
// =======================

export async function updateProductCategory(
  id: number,
  formData: FormData,
): Promise<SingleProductCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    // The user specified POST/inventory/product-categories/{id} for update
    const res = await fetch(`${API_BASE}/inventory/product-categories/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("product-categories-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateProductCategory:", error);
      throw new Error(error.message || "Failed to update product category");
    } else {
      throw new Error("Failed to update product category");
    }
  }
}

// =======================
// DELETE CATEGORY
// =======================

export async function deleteProductCategory(
  id: number,
): Promise<SingleProductCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/product-categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("product-categories-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteProductCategory:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete product category");
    }
  }
}
