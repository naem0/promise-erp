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

export interface ProductItem {
  id: number;
  name: string;
  barcode?: string;
  category_id?: number;
  category_name?: string;
  brand_id?: number;
  brand_name?: string;
  description?: string;
  specification?: string;
  unit_id?: number;
  unit_name?: string;
  purchase_price?: number;
  mrp_price?: number;
  model?: string;
  stock?: number;
  image?: string | null;
  status: number;
  status_text?: string;
}

export interface ProductItemsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_products: number;
    products: ProductItem[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleProductItemResponse {
  success: boolean;
  message: string;
  code: number;
  data: ProductItem;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET ITEMS (CACHED)
// =======================

export async function getProductItemsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<ProductItemsResponse | null> {
  "use cache";
  cacheTag("product-items-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/products?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No items found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("getProductItemsCached error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch product items");
  }
}

// =======================
// GET ITEMS WRAPPER
// =======================

export async function getProductItems(
  params: Record<string, unknown> = {},
): Promise<ProductItemsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session/token");
    }

    const cachedResult = await getProductItemsCached(token, params);
    if (!cachedResult) {
      throw new Error("Failed to fetch product items");
    }
    return cachedResult;
  } catch (error: unknown) {
    console.error("getProductItems error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}

// =======================
// GET SINGLE ITEM
// =======================

export async function getProductItemById(
  id: number,
): Promise<SingleProductItemResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      console.warn("No item found (404). Returning null.");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }
    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in getProductItemById:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to fetch product item");
    }
  }
}

// =======================
// CREATE ITEM
// =======================

export async function createProductItem(
  formData: FormData,
): Promise<SingleProductItemResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      updateTag("product-items-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createProductItem:", error);
      throw error;
    } else {
      throw new Error("Failed to create product item");
    }
  }
}

// =======================
// UPDATE ITEM
// =======================

export async function updateProductItem(
  id: number,
  formData: FormData,
): Promise<SingleProductItemResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/products/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      updateTag("product-items-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateProductItem:", error);
      throw error;
    } else {
      throw new Error("Failed to update product item");
    }
  }
}

// =======================
// DELETE ITEM
// =======================

export async function deleteProductItem(
  id: number,
): Promise<SingleProductItemResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("product-items-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteProductItem:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to delete product item");
    }
  }
}

// =======================
//Start of Inventory Dashboard
// =======================

export interface InventoryDashboardMetrics {
  total: number;
  today?: number;
}

export interface InventoryStockStatusMetrics {
  total_stock?: number;
  low_stock_products?: number;
}

export interface InventoryDashboardStat {
  card_name: string;
  metrics:
    | InventoryDashboardMetrics
    | InventoryStockStatusMetrics;
}

export interface InventoryMiniStatsResponse {
  success: boolean;
  message: string;
  code: number;
  data: InventoryDashboardStat[];
  errors?: Record<string, string[]>;
}

export async function getInventoryItemDashboardStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Dashboard stats not found (404).");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result: InventoryMiniStatsResponse = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("getInventoryDashboardStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory dashboard stats");
  }
}

// =======================
//End of Inventory Dashboard
// =======================


export async function getInventoryDeliveryDashboardStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/deliveries/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Dashboard stats not found (404).");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result: InventoryMiniStatsResponse = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("getInventoryDashboardStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory dashboard stats");
  }
}
