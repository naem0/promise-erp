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

export interface DydApplication {
  id: number;
  dyd_roll: string;
  name: string;
  profile_image?: string | null;
  phone: string;
  district_name?: string;
  division_name?: string;
  education?: string;
  created_at: string;
  apply_status: number;
  apply_status_text: string;
}

export interface DydApplicationDetail extends DydApplication {
  email?: string;
  date_of_birth?: string;
  gender?: string;
  permanent_address?: string;
  passing_year?: string;
  education_result?: string;
  has_pc_skill?: string;
  has_computer?: string;
  can_attend_class?: string;
}

export interface DydApplicationsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    applications: DydApplication[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleDydApplicationResponse {
  success: boolean;
  message: string;
  code: number;
  data?: DydApplicationDetail;
  errors?: Record<string, string[] | string>;
}

export interface BulkUpdateDydStatusResponse {
  success: boolean;
  message: string;
  code?: number;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET DYD APPLICATIONS (CACHED)
// =======================

export async function getDydApplicationsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<DydApplicationsResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.DYD_APPLICATIONS);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/dyd/applications/list?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (res.status === 404) {
      console.warn("No DYD applications found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token error.");
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
      console.error("Service error:", "Error fetching DYD applications");
      return null;
    }
  }
}

// =======================
// GET DYD APPLICATIONS WRAPPER
// =======================

export async function getDydApplications(
  params: Record<string, unknown> = {},
): Promise<DydApplicationsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getDydApplicationsCached(token, params);

  if (!_cachedResult)
    throw new Error("Failed to fetch DYD applications from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE DYD APPLICATION
// =======================

export async function getDydApplicationById(
  id: number | string,
): Promise<SingleDydApplicationResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/dyd/applications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("No DYD applications found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token error.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in getDydApplicationById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch applicant details");
    } else {
      throw new Error("Failed to fetch applicant details");
    }
  }
}

// =======================
// BULK UPDATE APPLICATION STATUS
// =======================

export async function bulkUpdateDydApplicationStatus(
  ids: number[],
  apply_status: number,
): Promise<BulkUpdateDydStatusResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/dyd/applications/bulk-update-status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids,
        application_ids: ids,
        apply_status,
        status: apply_status,
      }),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.DYD_APPLICATIONS);
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in bulkUpdateDydApplicationStatus:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to update status");
    } else {
      throw new Error("Failed to update status");
    }
  }
}

// =======================
// GET OVERVIEW STATISTICS
// =======================

export interface DydOverviewItem {
  card_name: string;
  metrics: {
    value: number;
  };
  label: string;
}

export interface DydOverviewResponse {
  success: boolean;
  message: string;
  code?: number;
  data: DydOverviewItem[];
}

export async function getDydApplicationsOverviewCached(
  token: string,
): Promise<DydOverviewResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.DYD_APPLICATIONS);
  try {
    const res = await fetch(`${API_BASE}/dyd/applications/list-overview`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("No DYD applications found (404). Returning empty list.");
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token error.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("getDydApplicationsOverviewCached error:", error);
    return null;
  }
}

export async function getDydApplicationsOverview(): Promise<DydOverviewResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    return await getDydApplicationsOverviewCached(token);
  } catch (error: unknown) {
    console.error("getDydApplicationsOverview error:", error);
    return null;
  }
}
