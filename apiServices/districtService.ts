"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { handleApiError, processApiResponse } from "@/lib/apiErrorHandler";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
// Division type
export interface Division {
  id: number;
  name: string;
}

// District type (updated)
export interface District {
  id: number;
  division_id: number;
  name: string;
  division: Division;
  branches: Branch[];
}



// Main data object
export interface DistrictData {
  total_districts: number;
  districts: District[];
  pagination: PaginationType;
}

// API Response type
export interface DistrictResponse {
  success: boolean;
  message: string;
  code: number;
  data: DistrictData;
}
// Division type
export interface Branch {
  id: number;
  name: string;
}

// =======================
//  Get District By ID
// =======================

export interface DistrictSingleResponse {
  success: boolean;
  message: string;
  data: District;
}

// =======================
//  Get Districts (Paginated)
// =======================

export async function getDistrictsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<DistrictResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.DISTRICTS);
  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params.hasOwnProperty(key)
      ) {
        urlParams.append(key, params[key].toString());
      }
    }

    const res = await fetch(`${API_BASE}/districts?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    return await res.json();
  } catch (error) {
    console.error("Error in getDistrictsCached:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getDistricts(
  params: Record<string, unknown> = {}
): Promise<DistrictResponse> {
  // try-এর বাইরে রাখা হয়েছে যাতে Next.js build-time dynamic signal সঠিকভাবে প্রপাগেট হয়
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session or access token found.");
  }

  try {
    const _cachedResult = await getDistrictsCached(token, params);

    if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

    return _cachedResult;
  } catch (error) {
    console.error("Error in get districts:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get districts"
    );
  }
}

// =======================
//  Add Division
// =======================

export interface AddDistrictApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: District;
  errors?: Record<string, string[] | string>;
}
export interface DistrictFormData {
  name: string;
  division_id: number;
}

export async function addDistrict(
  districtData: DistrictFormData
): Promise<AddDistrictApiResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        errors: {},
        code: 401,
      };
    }
    const response = await fetch(`${API_BASE}/districts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(districtData),
    });

    const result = await processApiResponse(response, "Failed to add district.");

    if (!result.success) {
      return result;
    }

    if (response.ok && result?.success) {
      updateTag(CACHE_TAGS.DISTRICTS);
    }

    return {
      success: true,
      message: result.message || "District added successfully.",
      data: result.data,
      code: result.code || 200,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to add district.");
  }
}

// =======================
// Delete Division
// =======================

export interface DeleteDistrictResponse {
  success: boolean;
  message: string;
  code?: number;
  data?: unknown;
}

export async function deleteDistrict(
  id: number
): Promise<DeleteDistrictResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return { success: false, message: "Unauthorized", code: 401 };
    }

    const res = await fetch(`${API_BASE}/districts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await processApiResponse(res, "Failed to delete district");
    
    if (!result.success) {
      return { success: false, message: result.message, code: result.code };
    }
    
    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.DISTRICTS);
    }
    return { success: true, message: result.message || "District deleted successfully", code: result.code };
  } catch (error) {
    const errorResult = await handleApiError(error, "Failed to delete district");
    return { success: false, message: errorResult.message, code: errorResult.code };
  }
}
// =======================
//  Get District By ID
// =======================
export async function getDistrictById(
  id: number
): Promise<DistrictSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/districts/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch district: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error in getDistrictById:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching district"
    );
  }
}

// =======================
//  Update District
// =======================

export async function updateDistrict(
  id: number,
  districtData: DistrictFormData
): Promise<AddDistrictApiResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
      };
    }

    const res = await fetch(`${API_BASE}/districts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(districtData),
    });

    const result = await processApiResponse(res, "Failed to update district.");

    if (!result.success) {
      return result;
    }

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.DISTRICTS);
    }
    return {
      success: true,
      message: result.message || "District updated successfully.",
      data: result.data,
      code: result.code || 200,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to update district.");
  }
}
