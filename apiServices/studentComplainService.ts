"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface ComplainItem {
  id: number;
  user_name: string;
  user_phone: string;
  batch_name: string;
  course_name: string;
  title: string;
  description: string;
  status: number;
  status_label: string;
  created_at: string;
  updated_at: string;
}

export interface StudentComplainsApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    complains: ComplainItem[];
    pagination?: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface CreateComplainApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: ComplainItem | null;
  errors?: Record<string, string[]>;
}

/**
 * Fetch list of student complains (CACHED)
 */
export async function getStudentComplainsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<StudentComplainsApiResponse | null> {
  "use cache";
  cacheTag("student-complains-list");

  try {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();
    const url = `${API_BASE}/student-panel/complains${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401 || res.status === 403 || res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`getStudentComplains API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getStudentComplainsCached Error:", error.message);
    }
    return null;
  }
}

/**
 * Fetch list of student complains WRAPPER
 */
export async function getStudentComplains(
  params: Record<string, unknown> = {}
): Promise<StudentComplainsApiResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  return await getStudentComplainsCached(token, params);
}

/**
 * Create a new student complain
 */
export async function createStudentComplain(
  formData: FormData
): Promise<CreateComplainApiResponse> {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  if (!accessToken) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const res = await fetch(`${API_BASE}/student-panel/complains`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data: CreateComplainApiResponse = await res.json();

    if (res.ok && data?.success) {
      updateTag("student-complains-list");
    }

    return data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error)
      throw error;
    console.error("createStudentComplain Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred while creating student complain");
  }
}
