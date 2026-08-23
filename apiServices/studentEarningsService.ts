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

export interface EarningUser {
  id: number;
  name: string;
}

export interface StudentEarning {
  id: number;
  user: EarningUser;
  earning_site_id: number;
  marketplace_name: string;
  payment_method_id: number;
  payment_method: string;
  career_category_id: number;
  job_title: string;
  amount_bdt: number;
  amount_usd: number;
  earning_images: string[];
  earned_at: string;
  status: number;
}

export interface StudentEarningsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_earnings: number;
    earnings: StudentEarning[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleStudentEarningResponse {
  success: boolean;
  message: string;
  code: number;
  data: StudentEarning;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET STUDENT EARNINGS (CACHED)
// =======================

export async function getStudentEarningsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<StudentEarningsResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.STUDENT_EARNINGS);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/admin/student-earnings?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No student earnings found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401) {
      console.warn("Unauthorized access to student earnings (401)");
      return null;
    }
    if (res.status === 403) {
      console.warn("Forbidden access to student earnings (403)");
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
      console.error("Service error:", "Error fetching student earnings");
      return null;
    }
  }
}

// =======================
// GET STUDENT EARNINGS WRAPPER
// =======================

export async function getStudentEarnings(
  params: Record<string, unknown> = {},
): Promise<StudentEarningsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getStudentEarningsCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE STUDENT EARNING
// =======================

export async function getStudentEarningById(
  id: number,
): Promise<SingleStudentEarningResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/admin/student-earnings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      console.warn(`Student earning with ID ${id} not found (404).`);
      return null;
    }
    if (res.status === 401) {
      console.warn("Unauthorized access to student earning (401)");
      return null;
    }
    if (res.status === 403) {
      console.warn("Forbidden access to student earning (403)");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in getStudentEarningById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch student earning");
    } else {
      throw new Error("Failed to fetch student earning");
    }
  }
}

// =======================
// CREATE STUDENT EARNING
// =======================

export async function createStudentEarning(
  formData: FormData,
): Promise<SingleStudentEarningResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/admin/student-earnings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.STUDENT_EARNINGS);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createStudentEarning:", error);
      throw new Error(error.message || "Failed to create student earning");
    } else {
      throw new Error("Failed to create student earning");
    }
  }
}

// =======================
// UPDATE STUDENT EARNING
// =======================

export async function updateStudentEarning(
  id: number,
  formData: FormData,
): Promise<SingleStudentEarningResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");
  try {
    if (!formData.has("_method")) {
      formData.append("_method", "PUT");
    }

    const res = await fetch(`${API_BASE}/admin/student-earnings/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.STUDENT_EARNINGS);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateStudentEarning:", error);
      throw new Error(error.message || "Failed to update student earning");
    } else {
      throw new Error("Failed to update student earning");
    }
  }
}

// =======================
// DELETE STUDENT EARNING
// =======================

export async function deleteStudentEarning(
  id: number,
): Promise<SingleStudentEarningResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/admin/student-earnings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.STUDENT_EARNINGS);
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteStudentEarning:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete student earning");
    }
  }
}
