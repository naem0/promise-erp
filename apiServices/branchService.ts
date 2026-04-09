"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { District, Division } from "@/apiServices/districtService";
import { handleApiError, processApiResponse } from "@/lib/apiErrorHandler";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

/* ===============================
   Interfaces
================================== */

export interface SocialLink {
  title: string;
  url: string;
}

export interface Branch {
  id: number;
  name: string;
  division_id: number;
  address?: string | null;
  phone?: string[] | null;
  email?: string[] | null;
  google_map?: string | null;
  social_links?: SocialLink[] | null;
  student_count: number;
  teacher_count: number;
  employee_count: number;

  district?: {
    id: number;
    name: string;
  };
}

export interface BranchCreate {
  name: string;
  district_id: number;
  address?: string | null;
  phone?: string[] | null;
  email?: string[] | null;
  google_map?: string | null;
  social_links?: SocialLink[] | null;
}
export interface BranchResponse {
  success: boolean;
  message: string;
  data: {
    branches: Branch[];
    pagination: PaginationType;
  };
}

export interface BranchSingleResponse {
  success: boolean;
  message: string;
  data: Branch;
}

export interface BranchResponseType {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | string>;
  data?: Branch;
  code?: number;
}

/* ===============================
   Helper – Get Auth Token
================================== */
async function getAuthToken(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error("No valid session or access token found.");
  }

  return session.accessToken;
}

/* ===============================
   Add Branch
================================== */
export async function addBranch(
  branch: BranchCreate,
): Promise<BranchResponseType> {
  try {
    const token = await getAuthToken();

    const res = await fetch(`${API_BASE}/branches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(branch),
    });

    const result = await processApiResponse(res, "Failed to add branch.");

    if (!result.success) {
      return result;
    }

    updateTag("branches-list");

    return {
      success: true,
      message: result.message || "Branch added successfully.",
      data: result.data,
      code: result.code,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to add branch.");
  }
}

/* ===============================
    Get Branches (Paginated)
================================== */

export async function getBranchesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<BranchResponse> {
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
  try {
    const res = await fetch(`${API_BASE}/branches?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (error) {
    console.error("Error in getBranchesCached:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching branches",
    );
  }
}

export async function getBranches(
  params: Record<string, unknown> = {},
): Promise<BranchResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session or access token found.");
  }

  try {
    return await getBranchesCached(token, params);
  } catch (error) {
    console.error("Error in get branches:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get branches",
    );
  }
}

/* ===============================
  Get Single Branch by ID
================================== */
export async function getBranchById(id: string): Promise<BranchSingleResponse> {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE}/branches/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch branch: ${res.statusText}`);
  }

  return res.json();
}

/* ===============================
 Update Branch
================================== */

export async function updateBranch(
  id: string,
  data: Record<string, unknown>,
): Promise<BranchResponseType> {
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

    const res = await fetch(`${API_BASE}/branches/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await processApiResponse(res, "Failed to update branch.");

    if (!result.success) {
      return result;
    }

    updateTag("branches-list");

    return {
      success: true,
      message: result.message || "Branch updated successfully.",
      data: result.data,
      code: result.code,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to update branch.");
  }
}

/* ===============================
  Delete Branch
================================== */

export async function deleteBranch(
  id: number,
): Promise<{ success: boolean; message: string; code?: number }> {
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

    const res = await fetch(`${API_BASE}/branches/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await processApiResponse(res, "Failed to delete branch");

    if (!result.success) {
      return { success: false, message: result.message, code: result.code };
    }

    updateTag("branches-list");
    return {
      success: true,
      message: result.message || "Branch deleted successfully",
      code: result.code,
    };
  } catch (error) {
    const errorResult = await handleApiError(error, "Failed to delete branch");
    return {
      success: false,
      message: errorResult.message,
      code: errorResult.code,
    };
  }
}

// ===============================Start web site Public Branch page API =============================

export interface WebBranch {
  id: number;
  name: string;
  address: string;
  phone: string[];
  email: string[];
  google_map: string;
}

//
export interface WebBranchData {
  id: number;
  name: string;
  branches: WebBranch[];
}

// API Response Type
export interface WebBranchApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: WebBranchData[];
  errors?: Record<string, string[]>;
}

export async function getPublicWebBranches(
  params: Record<string, unknown> = {},
): Promise<WebBranchApiResponse> {
  try {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();
    const res = await fetch(
      `${API_BASE}/public/public-divisions?${queryString}`,
    );

    if (!res.ok) {
      throw new Error(
        `getPublicWebBranches API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: WebBranchApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching public branches:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching public branches.");
  }
}
// ===============================End web site Public Branch page API ===============================

// ===============================Start web site Public Division List API ===============================

export interface PublicDivision {
  id: number;
  name: string;
}

export interface PublicDivisionApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: PublicDivision[];
  errors?: Record<string, string[]>;
}

export async function getPublicDivisionList(): Promise<PublicDivisionApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/division-list`);

    if (!res.ok) {
      throw new Error(
        `getPublicDivisionList API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: PublicDivisionApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching public division list:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching public division list.");
  }
}

// ===============================End web site Public Division List API ===============================

// ===============================Start web site Public Branch List API ===============================

export interface PublicBranch {
  id: number;
  name: string;
  code?: string;
}

export interface PublicBranchListApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: { branches: PublicBranch[] };
  errors?: Record<string, string[]>;
}

export async function getPublicBranchListAll(): Promise<PublicBranchListApiResponse> {
  try {
    // Adding no-cache or revalidate if needed, but fetch defaults should be fine
    const res = await fetch(`${API_BASE}/public/branch-list`);

    if (!res.ok) {
      throw new Error(
        `getPublicBranchListAll API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: PublicBranchListApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching public branch list:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching public branch list.");
  }
}
// ===============================End web site Public Branch List API ===============================

// ===============================Start web site Public Branch Statistics API =============================
export interface BranchStatisticsData {
  total_divisions: number;
  total_districts: number;
  total_branches: number;
}

export interface BranchStatisticsResponse {
  success: boolean;
  message: string;
  code: number;
  data: BranchStatisticsData;
}
export async function getPublicBranchStatistics(): Promise<BranchStatisticsResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/geo-statistics`);

    if (!res.ok) {
      throw new Error(
        `getPublicBranchStatistics API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: BranchStatisticsResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching public branch statistics:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching public branch statistics.");
  }
}
