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

export interface License {
  id: number;
  image?: string | null;
  title: string;
  description: string;
  status: number;
}

export interface LicensesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_licenses: number;
    licenses: License[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleLicenseResponse {
  success: boolean;
  message: string;
  code: number;
  data: License;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET LICENSES (CACHED)
// =======================

export async function getLicensesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<LicensesResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.LICENSES);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/licenses?${urlParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("No licenses found (404). Returning empty list.");
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
    console.error("getLicensesCached error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch licenses");
  }
}

// =======================
// GET LICENSES WRAPPER
// =======================

export async function getLicenses(
  params: Record<string, unknown> = {},
): Promise<LicensesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }
  try {
    const cachedResult = await getLicensesCached(token, params);
    if (!cachedResult) {
      throw new Error("Failed to fetch licenses");
    }
    return cachedResult;
  } catch (error: unknown) {
    console.error("getLicenses error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}

// =======================
// GET SINGLE LICENSE
// =======================

export async function getLicenseById(
  id: number,
): Promise<SingleLicenseResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/licenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      console.warn("No license found (404). Returning null.");
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
    console.error("Error in getLicenseById:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to fetch license");
    }
  }
}

// =======================
// CREATE LICENSE
// =======================

export async function createLicense(
  formData: FormData,
): Promise<SingleLicenseResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/licenses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.LICENSES);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createLicense:", error);
      throw error;
    } else {
      throw new Error("Failed to create license");
    }
  }
}

// =======================
// UPDATE LICENSE
// =======================

export async function updateLicense(
  id: number,
  formData: FormData,
): Promise<SingleLicenseResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/licenses/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.LICENSES);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateLicense:", error);
      throw error;
    } else {
      throw new Error("Failed to update license");
    }
  }
}

// =======================
// DELETE LICENSE
// =======================

export async function deleteLicense(
  id: number,
): Promise<SingleLicenseResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/licenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.LICENSES);
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteLicense:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to delete license");
    }
  }
}
