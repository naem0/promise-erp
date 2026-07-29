"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";
import { processApiResponse } from "@/lib/apiErrorHandler";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface Facility {
  id: number;
  uuid: string;
  title: string;
  status: number;
  image?: string | null;
}

export interface FacilitiesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_facilities: number;
    facilities?: Facility[];
    pagination?: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleFacilityResponse {
  success: boolean;
  message: string;
  code?: number;
  data?: Facility | null;
  errors?: Record<string, string[] | string>;
}

// =======================
// Get Facilities (Cached)
// =======================

export async function getFacilitiesCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<FacilitiesResponse | null> {
  "use cache";
  cacheTag("facilities-list");

  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/course-facilities?${urlParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: FacilitiesResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getFacilitiesCached:", error.message);
      console.error("Service error:", "Error fetching facilities");
      return null;
    } else {
      console.error("Service error:", "Error fetching facilities");
      return null;
    }
  }
}

export async function getFacilities(
  params: Record<string, unknown> = {}
): Promise<FacilitiesResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const _cachedResult = await getFacilitiesCached(token, params);

    if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

    return _cachedResult;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Categories API Error:", error.message)
      throw new Error("Error fetching facilities");
    } else {
      throw new Error("Error fetching facilities");
    }
  }
}
// =======================
// Get Facility By ID
// =======================

export async function getFacilityById(
  id: number
): Promise<SingleFacilityResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/course-facilities/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: SingleFacilityResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getFacilityById:", error.message);
      throw new Error("Error fetching facility");
    } else {
      throw new Error("Error fetching facility");
    } 
  }
}

// =======================
// Create Facility
// =======================

export async function createFacility(
  formData: FormData
): Promise<SingleFacilityResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return { success: false, message: "No valid session or access token found.", code: 401 };
    }

    const res = await fetch(`${API_BASE}/course-facilities`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await processApiResponse(res, "Failed to create facility");

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: result.errors,
        code: result.code,
      };
    }

    if (res.ok && result?.success) {
      updateTag("facilities-list");
    }
    return {
      success: true,
      message: result.message || "Facility created successfully",
      data: result.data,
      code: result.code,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createFacility:", error.message);
      throw new Error("Error creating facility");
    } else {
      throw new Error("Error creating facility");
    }
  }
}

// =======================
// Update Facility
// =======================

export async function updateFacility(
  id: number,
  formData: FormData
): Promise<SingleFacilityResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return { success: false, message: "No valid session or access token found.", code: 401 };
    }

    formData.append("_method", "PUT");

    const res = await fetch(`${API_BASE}/course-facilities/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await processApiResponse(res, "Failed to update facility");

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: result.errors,
        code: result.code,
      };
    }

    if (res.ok && result?.success) {
      updateTag("facilities-list");
    }
    return {
      success: true,
      message: result.message || "Facility updated successfully",
      data: result.data,
      code: result.code,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateFacility:", error.message);
      throw new Error("Error updating facility");
    } else {
      throw new Error("Error updating facility");
    }
  }
}

// =======================
// Delete Facility
// =======================

export async function deleteFacility(
  id: number
): Promise<SingleFacilityResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return { success: false, message: "No valid session or access token found.", code: 401 };
    }

    const res = await fetch(`${API_BASE}/course-facilities/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await processApiResponse(res, "Failed to delete facility");

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        code: result.code,
      };
    }

    if (res.ok && result?.success) {
      updateTag("facilities-list");
    }
    return {
      success: true,
      message: result.message || "Facility deleted successfully",
      data: result.data,
      code: result.code,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in deleteFacility:", error.message);
      throw new Error("Error deleting facility");
    } else {
      throw new Error("Error deleting facility");
    }
  }
}
