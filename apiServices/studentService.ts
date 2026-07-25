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

export interface Student {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  alternate_phone: string ;
  blood_group: string ;
  nid_no: string ;
  date_of_birth: string ;
  present_address: string ;
  occupation: string ;
  father_name: string ;
  father_occupation: string ;
  father_phone: string ;
  profile_image: string | null;
  status: string | null;
  is_govt: number;
  gender?: string | null;
  total_courses: number;
  courses:
  | {
    title: string;
    batch: string;
  }[]
  | null;
  branches: string | null;
  districts: string | null;
  divisions: string | null;
  branch_id?: number | null;
  roles?: string;
  enrollment_status?: string;
  created_at?: string;
}

export interface StudentResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    students: Student[];
    pagination?: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleStudentResponse {
  success: boolean;
  message?: string;
  code: number;
  data: Student | null;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET STUDENTS (CACHED)
// =======================

export async function getStudentsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<StudentResponse | null> {
  "use cache";
  cacheTag("students-list");

  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }
    const url = `${API_BASE}/students?${urlParams.toString()}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching students");
      return null;
    }
  }
}

// =======================
// GET STUDENTS WRAPPER
// =======================

export async function getStudents(
  params: Record<string, unknown> = {}
): Promise<StudentResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getStudentsCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE STUDENT
// =======================

export async function getStudentById(
  id: number
): Promise<SingleStudentResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/students/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Get Student By ID API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("Error in getStudentById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch student");
    } else {
      throw new Error("Failed to fetch student");
    }
  }
}

// =======================
// CREATE STUDENT
// =======================

export interface CreateStudent {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  alternate_phone: string;
  blood_group: string;
  nid_no: string;
  date_of_birth: string;
  present_address: string;
  occupation: string;
  father_name: string;
  father_occupation: string;
  father_phone: string;
  profile_image: string | null;
  status: string | null;
  is_govt: number; // 0 | 1
  roles: string;
  total_courses: number;
  courses: null;
  branches: string;
  districts: string;
  divisions: string;
  created_at?: string;
}

export interface CreateStudentResponse {
  success: boolean;
  message: string;
  code: number;
  data: CreateStudent;
  errors?: Record<string, string[]>;
}


export async function createStudent(
  formData: FormData
): Promise<CreateStudentResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/students`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result: CreateStudentResponse = await res.json();

    updateTag("students-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createStudent:", error);
      throw new Error(error.message || "Failed to create student");
    } else {
      throw new Error("Failed to create student");
    }
  }
}

// =======================
// UPDATE STUDENT
// =======================

export async function updateStudent(
  id: number,
  formData: FormData
): Promise<SingleStudentResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    // Use POST with _method=PATCH for FormData handles file uploads in Laravel/PHP
    formData.append("_method", "PATCH");

    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("students-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateStudent:", error);
      throw new Error(error.message || "Failed to update student");
    } else {
      throw new Error("Failed to update student");
    }
  }
}

// =======================
// DELETE STUDENT
// =======================

export async function deleteStudent(
  id: number
): Promise<SingleStudentResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session/token");
    }

    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("students-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteStudent:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete student");
    }
  }
}

export interface StudentStatsResponse {
  success: boolean;
  message?: string;
  code?: number;
   data: {
    card_name: string;
    metrics: {
      value: number;
    };
  }[];
  errors?: Record<string, string[]>;
}

export async function getStudentStatsCached(
  token: string
): Promise<StudentStatsResponse | null> {
  "use cache";
  cacheTag("students-list");

  try {
    const res = await fetch(`${API_BASE}/students/list-overview`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Student list-overview not found (404). Returning null.");
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("getStudentStatsCached error:", error);
    return null;
  }
}

export async function getStudentStats(): Promise<StudentStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const cachedResult = await getStudentStatsCached(token);
    if (!cachedResult) throw new Error("Failed to fetch student stats from cache.");
    return cachedResult;
  } catch (error: unknown) {
    console.error("getStudentStats error:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to fetch student stats");
  }
}