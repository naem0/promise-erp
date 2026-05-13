"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// Batch interface
interface Batch {
  id: number;
  name: string;
  course_id: number;
}

// Branch interface
interface Branch {
  id: number;
  name: string;
  district_id: number;
}

export interface CourseProject {
  id: number;
  uuid: string;
  batch_id: number;
  branch_id: number;
  title: string;
  image: string | null;
  course_name: string;
  batch?: Batch | null;
  branch?: Branch | null;
  course_id: number | null;
}
export interface CourseProjectsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    course_projects: CourseProject[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleCourseProjectResponse {
  success: boolean;
  message: string;
  code: number;
  data?: CourseProject | null;
  errors?: Record<string, string[]>;
}

// =======================
//  Get Course Projects (Paginated)
// =======================

export async function getCourseProjectCached(
  page = 1,
  token: string,
  params: Record<string, unknown> = {}
): Promise<CourseProjectsResponse | null> {
  "use cache";
  cacheTag("course-projects-list");

  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();
    urlParams.append("page", page.toString());

    for (const key in params) {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params.hasOwnProperty(key)
      ) {
        urlParams.append(key, params[key].toString());
      }
    }

    const res = await fetch(`${API_BASE}/course-projects?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data: CourseProjectsResponse = await res.json();
     return data;
  } catch (error) {
    console.error("Error in getCourseProjectCached:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getCourseProject(
  page = 1,
  params: Record<string, unknown> = {}
): Promise<CourseProjectsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const _cachedResult = await getCourseProjectCached(page, token, params);

    if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

    return _cachedResult;
  } catch (error) {
    console.error("Error in get Categories:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get Categories"
    );
  }
}

// =======================
//  Get Course Project By ID
// =======================
export async function getCourseProjectById(
  id: number
): Promise<SingleCourseProjectResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/course-projects/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: SingleCourseProjectResponse = await res.json();
    return data;

  } catch (error) {
    console.error("Error in getCourseProjectById:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching Category by ID"
    );
  }
}

// =======================
//  Create course projects
// =======================
export async function createCourseProject(categoryData:FormData): Promise<SingleCourseProjectResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) return { success: false, message: "No valid session or access token found.", code: 401 };

    const url = `${API_BASE}/course-projects`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: categoryData
      });
      const data: SingleCourseProjectResponse = await response.json().catch(async () => ({ message: await response.text() }));
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to create course project", errors: data.errors, code: response.status };
      }
      updateTag("course-projects-list");
      return data;
    } catch (error) {
      console.error("Error in course projects:", error);
      return { success: false, message: error instanceof Error ? error.message : "Failed to create course project", code: 500 };
    }
  }


// =======================
//  PUT update course projects
// =======================
  export async function updateCourseProject(id: number, formData: FormData): Promise<SingleCourseProjectResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) return { success: false, message: "No valid session or access token found.", code: 401 };

    const url = `${API_BASE}/course-projects/${id}`;
    try {
      formData.append("_method", "PATCH");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });
      const data: SingleCourseProjectResponse = await response.json().catch(async () => ({ message: await response.text() }));
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to update course project", errors: data.errors, code: response.status };
      }
      updateTag("course-projects-list");
      return data;
    } catch (error) {
      console.error("Error in updateCourseProject:", error);
      return { success: false, message: error instanceof Error ? error.message : "Failed to update course project", code: 500 };
    }
  }

// =======================
//  DELETE category
// =======================
  export async function deleteCourseProject(id: number): Promise<SingleCourseProjectResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) return { success: false, message: "No valid session or access token found.", code: 401 };

    const url = `${API_BASE}/course-projects/${id}`;
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data: SingleCourseProjectResponse = await response.json().catch(async () => ({ message: await response.text() }));
      if (!response.ok) {
        return { success: false, message: data.message || "Failed to delete course project", code: response.status };
      }
      updateTag("course-projects-list");
      return data;
    } catch (error) {
      console.error("Error in deleteCourseProject:", error);
      return { success: false, message: error instanceof Error ? error.message : "Failed to delete course project", code: 500 };
    }
  }

 
// =======================
//  Get Course Projects by Branch ID (Simple)
// =======================
export async function getCourseProjectsByBranch(
  branchId: number
): Promise<SingleCourseProjectResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const url = `${API_BASE}/branches/${branchId}/course-projects`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: SingleCourseProjectResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getCourseProjectsByBranch:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching Course Projects by Branch ID"
    );
  }
}


// =======================
//  Get Course Projects by Batch ID (Simple)
// =======================
export async function getCourseProjectsByBatch(
  batchId: number
): Promise<SingleCourseProjectResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const url = `${API_BASE}/batches/${batchId}/course-projects`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: SingleCourseProjectResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getCourseProjectsByBatch:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching Course Projects by Batch ID"
    );
  }
}
