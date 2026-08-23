"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { handleApiError, processApiResponse } from "@/lib/apiErrorHandler"
import { PaginationType } from "@/types/pagination"


const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"

// =======================
//  Interfaces
// =======================

export interface Teacher {
  id: number
  name: string
  bn_name: string
  email: string
  phone: string
  is_paid: number
  profile_image?: string | null
  subscription_details?: {
    id: number
    name: string
    price: string
    duration?: string
  } | null
  organization?: {
    id: number
    name: string
    logo?: string
  }
  user_detail?: {
    blood_group?: string
    education?: string
    date_of_birth?: string
  }
}



export interface TeacherResponse {
  success: boolean
  message: string
  data: {
    teachers: Teacher[];
    pagination: PaginationType;
  }
}
export interface TeacherResponseType {
  success: boolean;
  message?: string;
  errors?: {
    [key: string]: string[] | string;
  };
  data?: Teacher;
  code?: number;
}

// add teacher
export async function addTeacher(
  formData: FormData
): Promise<TeacherResponseType> {
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

    const res = await fetch(`${API_BASE}/teachers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await processApiResponse(res, "Failed to add teacher.");

    if (!result.success) {
      return result;
    }

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.TEACHERS);
    }
    return {
      success: true,
      message: result.message || "Teacher added successfully.",
      data: result.data,
      code: result.code,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to add teacher.");
  }
}

// =======================
//  Get Teachers
// =======================

async function getTeachersCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<TeacherResponse> {
  "use cache"
  cacheTag(CACHE_TAGS.TEACHERS);
  const url = new URL(`${API_BASE}/teachers`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value))
    }
  })

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch teachers: ${res.statusText}`)
  }

  return res.json()
}

export async function getTeachers(
  params: Record<string, unknown> = {}
): Promise<TeacherResponse> {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken
  if (!token) throw new Error("No valid session or access token found.")

  return getTeachersCached(token, params)
}

export interface TeacherSingleResponse {
  success: boolean
  message: string
  data: Teacher
}

// =======================
//  Get Teacher By ID
// =======================

export async function getTeacherById(id: string): Promise<TeacherSingleResponse> {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken
  if (!token) throw new Error("No valid session or access token found.")

  const res = await fetch(`${API_BASE}/teachers/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch teacher: ${res.statusText}`)
  }

  return res.json()
}

// =======================
//  Update Teacher
// =======================

export async function updateTeacher(
  id: string,
  formData: FormData
): Promise<TeacherResponseType> {
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

    formData.append("_method", "PATCH");

    const res = await fetch(`${API_BASE}/teachers/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await processApiResponse(res, "Failed to update teacher.");

    if (!result.success) {
      return result;
    }

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.TEACHERS);
    }
    return {
      success: true,
      message: result.message || "Teacher updated successfully.",
      data: result.data,
      code: result.code,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to update teacher.");
  }
}

// =======================
// Delete Teacher
// =======================
export async function deleteTeacher(id: number): Promise<{ success: boolean; message?: string; code?: number }> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return { success: false, message: "Unauthorized", code: 401 };
    }

    const res = await fetch(`${API_BASE}/teachers/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await processApiResponse(res, "Failed to delete teacher");
    
    if (!result.success) {
      return { success: false, message: result.message, code: result.code };
    }
    
    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.TEACHERS);
    }
    return { success: true, message: result.message || "Teacher deleted successfully", code: result.code };
  } catch (error) {
    const errorResult = await handleApiError(error, "Failed to delete teacher");
    return { success: false, message: errorResult.message, code: errorResult.code };
  }
}

