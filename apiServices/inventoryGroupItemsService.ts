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

export interface GroupItemProduct {
  id: number;
  product_id: number;
  product_name: string;
  quantity?: number;
  details?: string;
  image?: string | null;
}

export interface GroupItemDetailProduct {
  id: number;
  product_id?: number;
  product_name?: string;
  product_barcode?: string;
  quantity?: number;
  details?: string;
  name?: string;
  pivot?: {
    group_item_id?: number;
    product_id?: number;
    quantity?: number;
    details?: string;
  };
  category_name?: string;
  image?: string | null;
  model?: string;
}

export interface GroupItem {
  id: number;
  user_id?: number;
  user_name?: string;
  category_id?: number;
  category_name?: string;
  name: string;
  barcode: string;
  status: number;
  status_name?: string;
  items_in_group?: number;
  items_list?: GroupItemProduct[];
  created_by?: string;
  branch_name?: string;
  ready_date?: string;
  details?: GroupItemDetailProduct[];
  category?: {
    id: number;
    name: string;
  };
  items?: GroupItemDetailProduct[];
  products?: GroupItemDetailProduct[];
}

export interface GroupItemsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_items: number;
    group_items: GroupItem[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleGroupItemResponse {
  success: boolean;
  message: string;
  code: number;
  data: GroupItem;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET GROUP ITEMS (CACHED)
// =======================

export async function getGroupItemsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<GroupItemsResponse | null> {
  "use cache: private";
  cacheTag(CACHE_TAGS.INVENTORY_GROUP_ITEMS);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/group-items?${urlParams.toString()}`,
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
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching group items");
      return null;
    }
  }
}

// =======================
// GET GROUP ITEMS WRAPPER
// =======================

export async function getGroupItems(
  params: Record<string, unknown> = {},
): Promise<GroupItemsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getGroupItemsCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE GROUP ITEM
// =======================

export async function getGroupItemById(
  id: number,
): Promise<SingleGroupItemResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/group-items/${id}`, {
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
    console.error("Error in getGroupItemById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch group item");
    } else {
      throw new Error("Failed to fetch group item");
    }
  }
}

export interface GroupItemPayload {
  id?: number;
  name: string;
  barcode?: string;
  category_id?: number | null;
  status: number;
  products?: number[];
  product_ids?: number[];
  items?: { product_id: number; quantity?: number; details?: string }[];
  items_list?: { product_id: number; quantity?: number; details?: string }[];
}

// =======================
// CREATE GROUP ITEM
// =======================

export async function createGroupItem(
  payload: GroupItemPayload,
): Promise<SingleGroupItemResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/group-items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.INVENTORY_GROUP_ITEMS);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createGroupItem:", error);
      throw new Error(error.message || "Failed to create group item");
    } else {
      throw new Error("Failed to create group item");
    }
  }
}

// =======================
// UPDATE GROUP ITEM
// =======================

export async function updateGroupItem(
  id: number,
  payload: GroupItemPayload,
): Promise<SingleGroupItemResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/group-items/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.INVENTORY_GROUP_ITEMS);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateGroupItem:", error);
      throw new Error(error.message || "Failed to update group item");
    } else {
      throw new Error("Failed to update group item");
    }
  }
}

// =======================
// DELETE GROUP ITEM
// =======================

export async function deleteGroupItem(
  id: number,
): Promise<SingleGroupItemResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/group-items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.INVENTORY_GROUP_ITEMS);
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteGroupItem:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete group item");
    }
  }
}

// =======================
// SEARCH GROUP ITEMS
// =======================

export interface GroupItemSearchDetail {
  product_id: number;
  product_name: string;
  quantity?: number;
  unit_price?: string;
}

export interface InventorySearchGroupItem {
  id: number;
  type?: string;
  name: string;
  barcode?: string ;
  price?: number;
  details?: GroupItemSearchDetail[];
  image?: string | null;
}

export interface InventorySearchGroupItemsResponse {
  success: boolean;
  message: string;
  code: number;
  data: InventorySearchGroupItem[];
  errors?: Record<string, string[]>;
}

export async function searchInventoryGroupItems(
  query?: string,
): Promise<InventorySearchGroupItemsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    const urlParams = new URLSearchParams();
    if (query?.trim()) {
      urlParams.append("q", query.trim());
    }

    const queryString = urlParams.toString();
    const url = `${API_BASE}/inventory/search-group-items${queryString ? `?${queryString}` : ""}`;

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

    return await res.json();
  } catch (error: unknown) {
    console.error("searchInventoryGroupItems error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to search inventory group items");
  }
}

