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

export interface CRMSource {
  id: number;
  name: string;
  icon?: string ;
  status: number;
  leads_count: number;
  current_week_leads_count: number;
  last_week_leads_count: number;
  last_week_percentage: string;
}

export interface CRMSourcesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    sources: CRMSource[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleCRMSourceResponse {
  success: boolean;
  message: string;
  code: number;
  data: CRMSource;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET SOURCES (CACHED)
// =======================

export async function getCRMSourcesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<CRMSourcesResponse | null> {
  "use cache: remote";
  cacheTag("crm-sources-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/crm/sources?${urlParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      console.warn("Unauthorized access to CRM sources (401)");
      return null;
    }
    if (res.status === 403) {
      console.warn("Forbidden access to CRM sources (403)");
      return null
    }
    if (res.status === 404) {
      console.warn("CRM sources endpoint not found (404)");
      return null 
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }


    const result = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching CRM sources");
    }
  }
}

// =======================
// GET SOURCES WRAPPER
// =======================

export async function getCRMSources(
  params: Record<string, unknown> = {},
): Promise<CRMSourcesResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getCRMSourcesCached(token, params);


  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");


  return _cachedResult;
}

// =======================
// GET SINGLE SOURCE
// =======================

export async function getCRMSourceById(
  id: number,
): Promise<SingleCRMSourceResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/sources/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      console.warn("Unauthorized access to CRM sources (401)");
      return null;
    }
    if (res.status === 403) {
      console.warn("Forbidden access to CRM sources (403)");
      return null
    }
    if (res.status === 404) {
      console.warn("CRM sources endpoint not found (404)");
      return null 
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("Error in getCRMSourceById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch CRM source");
    } else {
      throw new Error("Failed to fetch CRM source");
    }
  }
}

// =======================
// CREATE SOURCE
// =======================

export async function createCRMSource(
  formData: FormData,
): Promise<SingleCRMSourceResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/sources`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    updateTag("crm-sources-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createCRMSource:", error);
      throw new Error(error.message || "Failed to create CRM source");
    } else {
      throw new Error("Failed to create CRM source");
    }
  }
}

// =======================
// UPDATE SOURCE
// =======================

export async function updateCRMSource(
  id: number,
  formData: FormData,
): Promise<SingleCRMSourceResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    if (!formData.has("_method")) {
        formData.append("_method", "PUT");
    }

    const res = await fetch(`${API_BASE}/crm/sources/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    updateTag("crm-sources-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateCRMSource:", error);
      throw new Error(error.message || "Failed to update CRM source");
    } else {
      throw new Error("Failed to update CRM source");
    }
  }
}

// =======================
// DELETE SOURCE
// =======================

export async function deleteCRMSource(
  id: number,
): Promise<SingleCRMSourceResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/sources/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    updateTag("crm-sources-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteCRMSource:", error);
    if (error instanceof Error) {
      console.error("Error in deleteCRMSource:", error);
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete CRM source");
    }
  }
}
