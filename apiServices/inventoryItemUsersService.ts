"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";
import { InventoryMiniStatsResponse } from "./inventoryItemsService";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface ProductAssignment {
  id: number;
  user_id: number;
  employee_name?: string;
  employee_email?: string;
  employee_phone?: string;
  product_id: number;
  product_name: string;
  image?: string | null;
  barcode?: string;
  group_item_id?: number;
  group_item_name?: string;
  branch_id?: number;
  branch_name?: string;
  room_id?: number;
  room_name?: string;
  quantity: number;
  assigned_by: number;
  assigned_by_name: string;
  assigned_date: string;
  returned_date?: string;
  requisition_id?: number;
  note?: string;
  status: number;
  status_name: string;
}

export interface SingleAssignmentEntry {
  type: "single";
  item: ProductAssignment;
}

export interface GroupAssignmentEntry {
  type: "group";
  group_item_id: number;
  group_item_name: string | null;
  items: ProductAssignment[];
}

export type AssignmentEntry = SingleAssignmentEntry | GroupAssignmentEntry;

export interface UserAssignmentSummary {
  user_id: number;
  employee_id?: string;
  employee_name: string;
  employee_email?: string;
  employee_phone?: string;
  branches?: string[];
  total_items_assigned: number;
  assigned_item_names: string[];
  assigned_room_names: string[];
  latest_assignment_date: string;
}

// Search items interfaces
export interface SearchItemResult {
  id: number;
  type?: string;
  name: string;
  barcode?: string;
  image?: string | null;
  price?: number;
  details?: null;
}

export interface SearchGroupItemDetail {
  product_id: number;
  product_name: string;
  barcode?: string;
  image?: string | null;
  quantity: number;
  unit_price?: number;
}

export interface SearchGroupItemResult {
  id: number;
  type?: string;
  name: string;
  barcode?: string;
  image?: string | null;
  price?: number;
  details: SearchGroupItemDetail[];
}

export interface SearchItemsResponse {
  success: boolean;
  message: string;
  code: number;
  data: SearchItemResult[];
  errors?: Record<string, string[]>;
}

export interface SearchGroupItemsResponse {
  success: boolean;
  message: string;
  code: number;
  data: SearchGroupItemResult[];
  errors?: Record<string, string[]>;
}

// =======================
// Payload Interfaces
// =======================

export interface CreateAssignmentItemPayload {
  product_id: number;
  quantity: number;
  group_item_id?: number | null;
}

export interface CreateProductAssignmentPayload {
  user_id: number;
  assigned_date: string;
  branch_id?: number | null;
  room_id?: number | null;
  group_item_id?: number | null;
  requisition_id?: number | null;
  note?: string;
  items: CreateAssignmentItemPayload[];
}

export interface UpdateProductAssignmentPayload {
  quantity?: number;
  note?: string;
  status?: number;
  assigned_date?: string;
  returned_date?: string | null;
  branch_id?: number | null;
  room_id?: number | null;
}

// =======================
// GET ALL ASSIGNMENTS (summary list)
// =======================

export interface ProductAssignmentsListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_items: number;
    assignments: ProductAssignment[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface ProductAssignmentsByUserResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_items: number;
    assignments: AssignmentEntry[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleProductAssignmentResponse {
  success: boolean;
  message: string;
  code: number;
  data: ProductAssignment | ProductAssignment[];
  errors?: Record<string, string[] | string>;
}

// =======================
// GET ASSIGNMENTS (CACHED)
// =======================

export async function getProductAssignmentsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<ProductAssignmentsListResponse | null> {
  "use cache: private";
  cacheTag(CACHE_TAGS.INVENTORY_ASSIGNMENTS);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/product-users?${urlParams.toString()}`,
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
    console.error("getProductAssignmentsCached error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch product assignments");
  }
}

// =======================
// GET ASSIGNMENTS WRAPPER
// =======================

export async function getProductAssignments(
  params: Record<string, unknown> = {},
): Promise<ProductAssignmentsListResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }
  try {
    const cachedResult = await getProductAssignmentsCached(token, params);
    if (!cachedResult) {
      throw new Error("Failed to fetch product assignments");
    }
    return cachedResult;
  } catch (error: unknown) {
    console.error("getProductAssignments error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}

// =======================
// GET ASSIGNMENTS BY USER (CACHED)
// =======================

export async function getProductAssignmentsByUserCached(
  token: string,
  userId: number,
  params: Record<string, unknown> = {},
): Promise<ProductAssignmentsByUserResponse | null> {
  "use cache: private";
  cacheTag(CACHE_TAGS.INVENTORY_ASSIGNMENTS);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/product-users/user/${userId}?${urlParams.toString()}`,
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
    console.error("Error in getProductAssignmentsByUserCached:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to fetch user product assignments");
  }
}

export async function getProductAssignmentsByUser(
  userId: number,
  params: Record<string, unknown> = {},
): Promise<ProductAssignmentsByUserResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    return await getProductAssignmentsByUserCached(token, userId, params);
  } catch (error: unknown) {
    console.error("Error in getProductAssignmentsByUser:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to fetch user product assignments");
  }
}

// =======================
// GET MY ASSIGNMENTS (CACHED)
// =======================

export async function getMyProductAssignmentsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<ProductAssignmentsByUserResponse | null> {
  "use cache: private";
  cacheTag(CACHE_TAGS.INVENTORY_ASSIGNMENTS);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/my-product-users?${urlParams.toString()}`,
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
    console.error("Error in getMyProductAssignmentsCached:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to fetch my product assignments");
  }
}

export async function getMyProductAssignments(
  params: Record<string, unknown> = {},
): Promise<ProductAssignmentsByUserResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    return await getMyProductAssignmentsCached(token, params);
  } catch (error: unknown) {
    console.error("Error in getMyProductAssignments:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to fetch my product assignments");
  }
}

// =======================
// GET SINGLE ASSIGNMENT
// =======================

export async function getProductAssignmentById(
  id: number,
): Promise<SingleProductAssignmentResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/product-users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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
    console.error("Error in getProductAssignmentById:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to fetch product assignment");
  }
}

// =======================
// CREATE ASSIGNMENT(S)
// =======================

export async function createProductAssignment(
  payload: CreateProductAssignmentPayload,
): Promise<SingleProductAssignmentResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/product-users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.INVENTORY_ASSIGNMENTS);
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createProductAssignment:", error);
      throw error;
    } else {
      throw new Error("Failed to create product assignment");
    }
  }
}

// =======================
// UPDATE ASSIGNMENT
// =======================

export async function updateProductAssignment(
  id: number,
  payload: UpdateProductAssignmentPayload,
): Promise<SingleProductAssignmentResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/product-users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.INVENTORY_ASSIGNMENTS);
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateProductAssignment:", error);
      throw error;
    } else {
      throw new Error("Failed to update product assignment");
    }
  }
}

// =======================
// DELETE ASSIGNMENT
// =======================

export async function deleteProductAssignment(
  id: number,
): Promise<SingleProductAssignmentResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/inventory/product-users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.INVENTORY_ASSIGNMENTS);
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in deleteProductAssignment:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to delete product assignment");
  }
}

// =======================
// DELETE USER PRODUCT GROUPS
// =======================

export interface DeleteUserProductGroupsResponse {
  success: boolean;
  message: string;
  code: number;
  data: null | unknown;
  errors?: Record<string, string[] | string>;
}

export async function deleteUserProductGroups(
  userId: number,
  groupIds: number[],
  params: Record<string, unknown> = {},
): Promise<DeleteUserProductGroupsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const queryString = urlParams.toString();
    const url = queryString
      ? `${API_BASE}/inventory/product-users/user/${userId}/groups?${queryString}`
      : `${API_BASE}/inventory/product-users/user/${userId}/groups`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ group_ids: groupIds }),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.INVENTORY_ASSIGNMENTS);
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in deleteUserProductGroups:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to delete user product group assignments");
  }
}

// =======================
// GET SUMMARY STATS (CACHED)
// =======================

export async function getInventoryProductUsersStatsCached(
  token: string,
): Promise<InventoryMiniStatsResponse | null> {
  "use cache: private";
  cacheTag(CACHE_TAGS.INVENTORY_ASSIGNMENTS);
  try {
    const res = await fetch(`${API_BASE}/inventory/product-users/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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

    const result: InventoryMiniStatsResponse = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("getInventoryProductUsersStatsCached error:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to fetch inventory product users stats");
  }
}

export async function getInventoryProductUsersStats(): Promise<InventoryMiniStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  return getInventoryProductUsersStatsCached(token);
}

// =======================
// SEARCH INVENTORY ITEMS
// =======================

export async function searchInventoryItems(
  query: string = "",
  limit: number = 20,
): Promise<SearchItemsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    const params: Record<string, unknown> = {
      q: query || undefined,
      limit: limit || undefined,
    };
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const queryString = urlParams.toString();
    const url = queryString
      ? `${API_BASE}/inventory/search-items?${queryString}`
      : `${API_BASE}/inventory/search-items`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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
    console.error("Error in searchInventoryItems:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to search inventory items");
  }
}

// =======================
// SEARCH INVENTORY GROUP ITEMS
// =======================

export async function searchInventoryGroupItems(
  query: string = "",
  limit: number = 20,
): Promise<SearchGroupItemsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    const params: Record<string, unknown> = {
      q: query || undefined,
      limit: limit || undefined,
    };
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const queryString = urlParams.toString();
    const url = queryString
      ? `${API_BASE}/inventory/search-group-items?${queryString}`
      : `${API_BASE}/inventory/search-group-items`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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
    console.error("Error in searchInventoryGroupItems:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to search inventory group items");
  }
}
