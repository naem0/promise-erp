"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface Department {
  id: number;
  name: string;
  status: number;
  status_text: string;
  display_order: number;
  date: string;
}

export interface DepartmentsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_departments: number;
    departments: Department[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleDepartmentResponse {
  success: boolean;
  message: string;
  code: number;
  data: Department;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET DEPARTMENTS (CACHED)
// =======================

export async function getDepartmentsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<DepartmentsResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.DEPARTMENTS);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/departments?${urlParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching departments");
      return null;
    }
  }
}

// =======================
// GET DEPARTMENTS WRAPPER
// =======================

export async function getDepartments(
  params: Record<string, unknown> = {},
): Promise<DepartmentsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getDepartmentsCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch departments.");

  return _cachedResult;
}

// =======================
// GET SINGLE DEPARTMENT
// =======================

export async function getDepartmentById(
  id: number,
): Promise<SingleDepartmentResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/departments/${id}`, {
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
    console.error("Error in getDepartmentById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch department");
    } else {
      throw new Error("Failed to fetch department");
    }
  }
}

// =======================
// CREATE DEPARTMENT
// =======================

export async function createDepartment(data: {
  name: string;
  display_order?: number;
  status?: number;
}): Promise<SingleDepartmentResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/departments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.DEPARTMENTS);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createDepartment:", error);
      throw new Error(error.message || "Failed to create department");
    } else {
      throw new Error("Failed to create department");
    }
  }
}

// =======================
// UPDATE DEPARTMENT
// =======================

export async function updateDepartment(
  id: number,
  data: { name: string; display_order?: number; status?: number },
): Promise<SingleDepartmentResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.DEPARTMENTS);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateDepartment:", error);
      throw new Error(error.message || "Failed to update department");
    } else {
      throw new Error("Failed to update department");
    }
  }
}

// =======================
// TOGGLE DEPARTMENT STATUS
// =======================

export async function toggleDepartmentStatus(
  id: number,
): Promise<SingleDepartmentResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/departments/${id}/toggle-status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.DEPARTMENTS);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in toggleDepartmentStatus:", error);
      throw new Error(error.message || "Failed to toggle department status");
    } else {
      throw new Error("Failed to toggle department status");
    }
  }
}

// =======================
// DELETE DEPARTMENT
// =======================

export async function deleteDepartment(
  id: number,
): Promise<SingleDepartmentResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.DEPARTMENTS);
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteDepartment:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to delete department");
    } else {
      throw new Error("Failed to delete department");
    }
  }
}

// =======================
// DEPARTMENTS SIMPLE LIST
// =======================

export interface SimpleDepartment {
  id: number;
  name: string;
  status: number;
}

export interface DepartmentsSimpleListApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_departments: number;
    departments: SimpleDepartment[];
    pagination?: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export async function getDepartmentsSimpleList(
  search?: string,
): Promise<DepartmentsSimpleListApiResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const urlParams = new URLSearchParams();
    if (search) {
      urlParams.append("search", search);
    }

    const queryString = urlParams.toString();
    const url = queryString
      ? `${API_BASE}/departments/simple-list?${queryString}`
      : `${API_BASE}/departments/simple-list`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Departments not found (404).");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `getDepartmentsSimpleList API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: DepartmentsSimpleListApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getDepartmentsSimpleList Error:", error.message);
      throw error;
    }
    throw new Error(
      "Unknown error occurred while fetching departments simple list",
    );
  }
}
