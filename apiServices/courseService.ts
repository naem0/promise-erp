"use server"

import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { cacheTag, updateTag } from "next/cache"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"

export interface Batch {
  id: number
  name: string
  price: string
  discount_price: string
  duration: string
  lecture: string
  is_online: boolean
  is_offline: boolean
}
export interface Pagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
}
export interface Course {
  id: number;
  lm_category_id: number;
  title: string;
  sub_title?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  featured_image?: string;
  video_link?: string;
  level: string;
  end_date?: string;
  status: string;
  is_default: boolean;
  total_enrolled: number;
  status_text: string;
  category: { id: number; name: string };
  branches: { id: number; name: string }[];
  organization: { name: string };
  batches: Batch[];
  branch_count: number;
  language: string;
  price: number;
  discount: number;
}

export interface CourseResponse {
  success: boolean
  message: string
  code: number
  data: {
    courses: Course[]
    pagination: Pagination
  }
}

async function getCoursesCached(
  page: number,
  token: string,
  params: any
): Promise<CourseResponse> {
  "use cache"
  cacheTag("courses-list")
  try {
    const url = new URL(`${API_BASE}/courses`)
    url.searchParams.append("page", String(page))

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key]) {
          url.searchParams.append(key, params[key])
        }
      })
    }

    const res = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch courses: ${res.statusText}`);
    }

    return res.json()
  }
  catch (error: any) {
    console.error("Error in getCoursesCached:", error);
    throw new Error(error.message || "An unknown error occurred while fetching courses.");
  }
}


// =======================
// 🔹 Get Courses (Paginated)
// =======================
export async function getCourses(page = 1, params: any = {}): Promise<CourseResponse> {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken
  if (!token) throw new Error("No valid session or access token found.")

  return getCoursesCached(page, token, params)
}


// =======================
// 🔹 Create Course
// =======================
export async function createCourse(formData: FormData): Promise<any> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/courses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 422 && data.errors) {
        return Promise.reject(data);
      }
      throw new Error(data.message || `Failed to create course. Status: ${res.status}`);
    }

    updateTag("courses-list");
    return data;
  } catch (error: any) {
    console.error("Error in createCourse:", error);
    if (error.errors) {
      throw error; // Re-throw the original error to preserve the errors object
    }
    const message = error instanceof Error ? error.message : "An unknown error occurred while creating the course.";
    throw new Error(message);
  }
}

export interface CourseSingleResponse {
  success: boolean;
  message: string;
  data: Course;
}

// =======================
// 🔹 Get Course by ID
// =======================
export async function getCourseById(id: string): Promise<CourseSingleResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session or access token found.");

  const res = await fetch(`${API_BASE}/courses/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch course: ${res.statusText}`);
  }

  return res.json();
}

// =======================
// 🔹 Update Course
// =======================
export async function updateCourse(id: string, formData: FormData): Promise<any> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    formData.append("_method", "PATCH");

    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 422 && data.errors) {
        return Promise.reject(data);
      }
      throw new Error(data.message || `Failed to update course. Status: ${res.status}`);
    }

    updateTag("courses-list");
    return data;
  } catch (error: any) {
    console.error("Error in updateCourse:", error);
    if (error.errors) {
      throw error; // Re-throw the original error to preserve the errors object
    }
    const message = error instanceof Error ? error.message : "An unknown error occurred while updating the course.";
    throw new Error(message);
  }
}

// =======================
// 🔹 Delete Course
// =======================
export async function DeleteCourse(id: number): Promise<any> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session or access token found.");

  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`Message: ${errorData.message || "Failed to delete course"}`);
  }

  updateTag("courses-list");
  return res.json();
}

