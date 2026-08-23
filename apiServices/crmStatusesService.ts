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

export interface CrmStatus {
  id: number;
  status: string;
  type: number;
  leads_count: number;
}

export interface CrmStatusesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    statuses: CrmStatus[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleCrmStatusResponse {
  success: boolean;
  message: string;
  code: number;
  data: CrmStatus;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET CRM STATUSES (CACHED)
// =======================

export async function getCrmStatusesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<CrmStatusesResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.CRM_STATUSES);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/crm/statuses?${urlParams.toString()}`,
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
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    console.error("getCrmStatusesCached error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch CRM statuses");
  }
}

// =======================
// GET CRM STATUSES WRAPPER
// =======================

export async function getCrmStatuses(
  params: Record<string, unknown> = {},
): Promise<CrmStatusesResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }
  try {
    const cachedResult = await getCrmStatusesCached(token, params);
    if (!cachedResult) {
      throw new Error("Failed to fetch CRM statuses");
    }
    return cachedResult;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    console.error("getCrmStatuses error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}

// =======================
// GET SINGLE CRM STATUS
// =======================

export async function getCrmStatusById(
  id: number,
): Promise<SingleCrmStatusResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/crm/statuses/${id}`, {
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
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    console.error("Error in getCrmStatusById:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to fetch CRM status");
    }
  }
}

// =======================
// CREATE CRM STATUS
// =======================

export async function createCrmStatus(
  data: Record<string, unknown>,
): Promise<SingleCrmStatusResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/crm/statuses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.CRM_STATUSES);
    }
    return result;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    if (error instanceof Error) {
      console.error("Error in createCrmStatus:", error);
      throw error;
    } else {
      throw new Error("Failed to create CRM status");
    }
  }
}

// =======================
// UPDATE CRM STATUS
// =======================

export async function updateCrmStatus(
  id: number,
  data: Record<string, unknown>,
): Promise<SingleCrmStatusResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/crm/statuses/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.CRM_STATUSES);
    }
    return result;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    if (error instanceof Error) {
      console.error("Error in updateCrmStatus:", error);
      throw error;
    } else {
      throw new Error("Failed to update CRM status");
    }
  }
}

// =======================
// DELETE CRM STATUS
// =======================

export async function deleteCrmStatus(
  id: number,
): Promise<SingleCrmStatusResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/crm/statuses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.CRM_STATUSES);
    }
    return result;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    console.error("Error in deleteCrmStatus:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to delete CRM status");
    }
  }
}
