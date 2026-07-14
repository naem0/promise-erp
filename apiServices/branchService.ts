"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

/* ===============================
   Interfaces
================================== */

export interface SocialLink {
  id?: number;
  branch_id?: number;
  title: string;
  url: string;
}

export interface Branch {
  id: number;
  name: string;
  code?: string;
  district_id?: number;
  division_id?: number;
  address?: string;
  phone?: string[];
  email?: string[];
  google_map?: string;
  social_links?: SocialLink[];
  student_count?: number;
  teacher_count?: number;
  employee_count?: number;

  district?: {
    id: number;
    name: string;
  };
  division?: {
    id: number;
    name: string;
  };
}

export interface BranchCreate {
  name: string;
  code?: string;
  district_id?: number;
  address?: string;
  phone?: string[];
  email?: string[];
  google_map?: string;
  social_links?: SocialLink[];
}
export interface BranchResponse {
  success: boolean;
  message: string;
  data: {
    branches: Branch[];
    pagination: PaginationType;
  };
}

export interface SingleBranchResponse {
  success: boolean;
  message: string;
  code: number;
  data: Branch;
  errors?: Record<string, string[] | string>;
}



/* ===============================
   Add Branch
================================== */
export async function createBranch(
  formData: FormData,
): Promise<SingleBranchResponse> {

  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {

    const res = await fetch(`${API_BASE}/branches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("branches-list");

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error in createBranch: ${error.message}`);
      throw new Error(`Failed to create branch: ${error.message}`);
    } else {
      console.error("Error in createBranch:", error);
      throw new Error("Failed to create branch");
    }
  }
}

/* ===============================
    Get Branches (Paginated)
================================== */

export async function getBranchesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<BranchResponse> {
  "use cache: private";
  cacheTag("branches-list");
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

    if (res.status === 404) {
      console.warn("Courses not found (404). Returning null.");
      throw new Error(`${res.status} ${res.statusText}`);
    }
    if (res.status === 401 || res.status === 403) {
      console.warn(
        "Unauthorized or forbidden access (401/403). Returning null.",
      );
      throw new Error(`${res.status} ${res.statusText}`);
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch branch: ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error: unknown) {
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
    const cachedResult = await getBranchesCached(token, params);

    if (!cachedResult) throw new Error("Failed to fetch data from cache.");

    return cachedResult;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error in get branches: ${error.message}`);
      throw new Error(`Failed to get branches: ${error.message}`);
    } else {
      console.error("Error in get branches:", error);
      throw new Error("Failed to get branches");
    }
  }
}

/* ===============================
  Get Single Branch by ID
================================== */
export async function getBranchById(id: string): Promise<SingleBranchResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/branches/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch branch: ${res.statusText}`);
    }
    if (res.status === 404) {
      console.warn("Courses not found (404). Returning null.");
      throw new Error(`${res.status} ${res.statusText}`);
    }
    if (res.status === 401 || res.status === 403) {
      console.warn(
        "Unauthorized or forbidden access (401/403). Returning null.",
      );
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error in get branch by ID: ${error.message}`);
      throw new Error(`Failed to get branch by ID: ${error.message}`);
    } else {
      console.error("Error in get branch by ID:", error);
      throw new Error("Failed to get branch by ID");
    }
  }
}

/* ===============================
 Update Branch
================================== */

export async function updateBranch(
  id: string,
  formData: FormData,
): Promise<SingleBranchResponse> {

  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  
  try {

    // We use POST with _method=PUT (in FormData) for Laravel updates involving multipart form data
    const res = await fetch(`${API_BASE}/branches/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });



    const result = await res.json();
    updateTag("branches-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error in update branch: ${error.message}`);
      throw new Error(`Failed to update branch: ${error.message}`);
    } else {
      console.error("Error in update branch:", error);
      throw new Error("Failed to update branch");
    }
  }
}

/* ===============================
  Delete Branch
================================== */

export async function deleteBranch(
  id: number,
): Promise<SingleBranchResponse> {

  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {

    const res = await fetch(`${API_BASE}/branches/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    updateTag("branches-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error in delete branch: ${error.message}`);
      throw new Error(`Failed to delete branch: ${error.message}`);
    } else {
      console.error("Error in delete branch:", error);
      throw new Error("Failed to delete branch");
    }
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
): Promise<WebBranchApiResponse | null> {
  "use cache: remote";
  cacheTag("branches-list");
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

    if (res.status === 404) {
      console.warn("Courses not found (404). Returning null.");
      throw new Error(`${res.status} ${res.statusText}`);
    }
    if (res.status === 401 || res.status === 403) {
      console.warn(
        "Unauthorized or forbidden access (401/403). Returning null.",
      );
      throw new Error(`${res.status} ${res.statusText}`);
    }

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

    if (res.status === 404) {
      console.warn("Courses not found (404). Returning null.");
      throw new Error(`${res.status} ${res.statusText}`);
    }
    if (res.status === 401 || res.status === 403) {
      console.warn(
        "Unauthorized or forbidden access (401/403). Returning null.",
      );
      throw new Error(`${res.status} ${res.statusText}`);
    }

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

    if (res.status === 404) {
      console.warn("Courses not found (404). Returning null.");
      throw new Error(`${res.status} ${res.statusText}`);
    }
    if (res.status === 401 || res.status === 403) {
      console.warn(
        "Unauthorized or forbidden access (401/403). Returning null.",
      );
      throw new Error(`${res.status} ${res.statusText}`);
    }

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

    if (res.status === 404) {
      console.warn("Courses not found (404). Returning null.");
      throw new Error(`${res.status} ${res.statusText}`);
    }
    if (res.status === 401 || res.status === 403) {
      console.warn(
        "Unauthorized or forbidden access (401/403). Returning null.",
      );
      throw new Error(`${res.status} ${res.statusText}`);
    }

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
