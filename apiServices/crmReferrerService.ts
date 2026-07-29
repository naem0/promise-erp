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

export interface CRMReferrer {
  id: number;
  branch_name?: string;
  name: string;
  email?: string;
  phone: string;
  institute_name?: string;
  address?: string;
  profile_photo?: string;
  status: number;
  total_visitor: number;
  total_interested: number;
  total_enroll: number;
}

export interface CRMReferrersResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    referrers: CRMReferrer[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleCRMReferrerResponse {
  success: boolean;
  message: string;
  code: number;
  data: CRMReferrer;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET REFERRERS (CACHED)
// =======================

export async function getCRMReferrersCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<CRMReferrersResponse | null> {
  "use cache: remote";
  cacheTag("crm-referrers-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/crm/referrers?${urlParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
        const result = await res.json();
        return result;
    }
    if (res.status === 404) {
      console.warn("No referrers found (404). Returning empty list.");
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

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getCRMReferrersCached:", error);
      throw new Error(error.message);
    } else {
      console.error("Error in getCRMReferrersCached:", error);
      throw new Error("Error fetching CRM referrers");
    }
  }
}

// =======================
// GET REFERRERS WRAPPER
// =======================

export async function getCRMReferrers(
  params: Record<string, unknown> = {},
): Promise<CRMReferrersResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getCRMReferrersCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE REFERRER
// =======================

export async function getCRMReferrerById(
  id: number,
): Promise<SingleCRMReferrerResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/referrers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
        const result = await res.json();
        return result;
    }
    if (res.status === 404) {
      console.warn(`CRM referrer with ID ${id} not found (404).`);
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

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in getCRMReferrerById:", error);
    if (error instanceof Error) {
      console.error("Error in getCRMReferrerById:", error);
      throw new Error(error.message || "Failed to fetch CRM referrer");
    } else {
      console.error("Error in getCRMReferrerById:", error);
      throw new Error("Failed to fetch CRM referrer");
    }
  }
}

// =======================
// CREATE REFERRER
// =======================

export async function createCRMReferrer(
  formData: FormData,
): Promise<SingleCRMReferrerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/referrers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("crm-referrers-list");
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in createCRMReferrer:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to create CRM referrer");
    } else {
      throw new Error("Failed to create CRM referrer");
    }
  }
}

// =======================
// UPDATE REFERRER
// =======================

export async function updateCRMReferrer(
  id: number,
  formData: FormData,
): Promise<SingleCRMReferrerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    if (!formData.has("_method")) {
        formData.append("_method", "PUT");
    }

    const res = await fetch(`${API_BASE}/crm/referrers/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("crm-referrers-list");
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in updateCRMReferrer:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to update CRM referrer");
    } else {
      throw new Error("Failed to update CRM referrer");
    }
  }
}

// =======================
// DELETE REFERRER
// =======================

export async function deleteCRMReferrer(
  id: number,
): Promise<SingleCRMReferrerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session/token");
    }

    const res = await fetch(`${API_BASE}/crm/referrers/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("crm-referrers-list");
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteCRMReferrer:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete CRM referrer");
    }
  }
}
