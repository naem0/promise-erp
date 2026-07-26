"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface InventoryReportBranch {
  id: number;
  name: string;
  code: string;
  address: string;
  location: string;
  active_stock_count: number;
}

export interface InventoryBranchesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    branches: InventoryReportBranch[];
  };
  errors?: Record<string, string[]>;
}

export interface BranchSummary {
  branch_id: number;
  branch_name: string;
  address: string;
  region: string;
  rooms_count: number;
  total_items: number;
  valuation: number;
}

export interface CategoryStockSummary {
  id: number;
  category: string;
  total_stock: number;
  active: number;
  damaged: number;
  damage_percent: number;
}

export interface ItemRegister {
  category: string;
  barcode: string;
  item_name: string;
  group: string;
  room_lab: string;
  total: number;
  active: number;
  damaged: number;
  last_updated: string;
}

export interface BranchDetailData {
  branch_summary: BranchSummary;
  category_stock_summary: CategoryStockSummary[];
  item_register: ItemRegister[];
  pagination: PaginationType;
}

export interface BranchDetailResponse {
  success: boolean;
  message: string;
  code: number;
  data: BranchDetailData;
  errors?: Record<string, string[]>;
}

// =======================
// GET INVENTORY BRANCHES
// =======================

export async function getInventoryBranchesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<InventoryBranchesResponse | null> {
  "use cache: private";
  cacheTag("branches-list");

  const urlParams = new URLSearchParams();
  for (const key in params) {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      urlParams.append(key, String(params[key]));
    }
  }

  try {
    const queryString = urlParams.toString();
    const res = await fetch(
      `${API_BASE}/inventory/reports/branches${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 401) {
      throw new Error(`${res.status} ${res.statusText} - Unauthorized.`);
    }
    if (res.status === 403) {
      throw new Error(`${res.status} ${res.statusText} - Forbidden.`);
    }
    if (res.status === 404) {
      throw new Error(`${res.status} ${res.statusText} - Not Found.`);
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      throw new Error(`Service error: ${error.message}`);
    } else {
      console.error("Unknown error:", error);
      throw new Error(
        "An unknown error occurred while fetching inventory branches.",
      );
    }
  }
}

export async function getInventoryBranches(
  params: Record<string, unknown> = {},
): Promise<InventoryBranchesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const cachedResult = await getInventoryBranchesCached(token, params);

  if (!cachedResult) throw new Error("Failed to fetch inventory branches.");

  return cachedResult;
}

// =======================
// GET BRANCH DETAIL REPORT
// =======================

export async function getBranchInventoryDetail(
  params: Record<string, unknown> = {},
): Promise<BranchDetailResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/reports/branch-detail?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 401) {
      throw new Error(`${res.status} ${res.statusText} - Unauthorized.`);
    }
    if (res.status === 403) {
      throw new Error(`${res.status} ${res.statusText} - Forbidden.`);
    }
    if (res.status === 404) {
      throw new Error(`${res.status} ${res.statusText} - Not Found.`);
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      throw new Error(`Service error: ${error.message}`);
    } else {
      console.error("Unknown error:", error);
      throw new Error(
        "An unknown error occurred while fetching branch inventory detail.",
      );
    }
  }
}
