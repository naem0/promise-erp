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
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }
  try {
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
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
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
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
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
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
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
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
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
// STOCK UPDATE
// =======================

export interface StockUpdateProduct {
  product_id: number;
  stock_qty: number;
}

export interface StockUpdatePayload {
  branch_id: number;
  room_id: number;
  products: StockUpdateProduct[];
}

export interface StockUpdateResponse {
  success: boolean;
  message: string;
  code: number;
  data: ProductItem[];
  errors?: Record<string, string[] | string>;
}

export async function updateProductStock(
  payload: StockUpdatePayload,
): Promise<StockUpdateResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/inventory/stock-update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.success) {
      updateTag("product-items-list");
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in updateProductStock:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to update product stock");
    }
  }
}

// =======================
//Start of Inventory All Dashboard Summary Stats
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
  metrics: InventoryDashboardMetrics | InventoryStockStatusMetrics;
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

export async function getInventoryProductItemStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/products/summary`, {
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
    console.error("getInventoryProductItemStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory product item stats");
  }
}

export async function getInventoryGroupItemsStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/group-items/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Group items stats not found (404).");
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
    console.error("getInventoryGroupItemsStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory group items stats");
  }
}

export async function getInventoryCategoryStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(
      `${API_BASE}/inventory/product-categories/summary`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("Product categories stats not found (404).");
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
    console.error("getInventoryCategoryStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory category stats");
  }
}

export async function getInventoryBrandStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/brands/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Product brands stats not found (404).");
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
    console.error("getInventoryBrandStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory brand stats");
  }
}

export async function getInventoryUnitsStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/units/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Product units stats not found (404).");
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
    console.error("getInventoryUnitsStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory units stats");
  }
}

export async function getInventoryRoomsStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/rooms/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Product rooms stats not found (404).");
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
    console.error("getInventoryRoomsStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory rooms stats");
  }
}

export async function getInventoryDeliveryPartnerStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/delivery-partners/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Product delivery partner stats not found (404).");
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
    console.error("getInventoryDeliveryPartnerStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory delivery partner stats");
  }
}

export async function getInventoryDeliveryTypeStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/delivery-types/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Product delivery types stats not found (404).");
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
    console.error("getInventoryDeliveryTypeStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory delivery types stats");
  }
}

export async function getInventoryDeliveriesStats(): Promise<InventoryMiniStatsResponse | null> {
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
      console.warn("Product deliveries stats not found (404).");
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
    console.error("getInventoryDeliveriesStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory deliveries stats");
  }
}

export async function getInventoryRequisitionStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/requisitions/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Product requisitions stats not found (404).");
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
    console.error("getInventoryRequisitionStats error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch inventory requisitions stats");
  }
}
// =======================
//End of Inventory All Dashboard Summary Stats
// =======================

// export async function getInventoryDeliveryDashboardStats(): Promise<InventoryMiniStatsResponse | null> {
//   const session = await getServerSession(authOptions);
//   const token = session?.accessToken;
//   if (!token) throw new Error("No valid session/token");

//   try {
//     const res = await fetch(`${API_BASE}/inventory/deliveries/summary`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (res.status === 404) {
//       console.warn("Delivery dashboard stats not found (404).");
//       return null;
//     }

//     if (res.status === 401 || res.status === 403) {
//       console.warn("Unauthorized: Access token not found.");
//       return null;
//     }

//     if (!res.ok) {
//       throw new Error(`Status: ${res.status} ${res.statusText}`);
//     }

//     const result: InventoryMiniStatsResponse = await res.json();

//     return result;
//   } catch (error: unknown) {
//     console.error("getInventoryDeliveryDashboardStats error:", error);

//     if (error instanceof Error) {
//       throw error;
//     }

//     throw new Error("Failed to fetch inventory delivery dashboard stats");
//   }
// }
