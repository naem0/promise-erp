"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
// ============================================================
// Interfaces
// ============================================================

export interface InstructorTool {
  id: number;
  image?: string | null;
}

export interface Instructor {
  id: number;
  name: string;
  designation: string;
  experience: string;
  email: string;
  profile_image?: string | null;
  instructors_tools: InstructorTool[];
}

export interface FreeSeminarCourseCategory {
  category_id: number;
  category_name: string;
}

export interface CourseBranch {
  id: number;
  name: string;
}

export interface CourseBatch {
  id: number;
  price: number;
  discount?: number;
  discount_type: string;
  after_discount: number;
  discount_percentage: number;
  duration?: string;
}

export interface FreeSeminarCourse {
  id: number;
  title: string;
  slug: string;
  featured_image: string;
  ratings: number;
  total_live_class: number;
  branches: CourseBranch[];
  batch: CourseBatch;
}

export interface FreeSeminar {
  id: number;
  title: string;
  slug: string;
  about: string;
  class_topic: string;
  seminar_type: number;
  description: string | null;
  location: string | null;
  seminar_date: string;
  seminar_time: string;
  seminar_link: string | null;
  image?: string | null;
  status?: number;
  branch: {
    id: number;
    name: string;
  };
  course_category?: FreeSeminarCourseCategory;
  category_id?: number;
  category_name?: string;
  instructors: Instructor[];
  courses?: FreeSeminarCourse[];
}

export interface FreeSeminarsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_free_seminars: number;
    free_seminars: FreeSeminar[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleFreeSeminarResponse {
  success: boolean;
  message: string;
  code: number;
  data?: FreeSeminar | null;
  errors?: Record<string, string[] | string>;
}

// ============================================================
// GET Free Seminars (Paginated)
// ============================================================

export async function getFreeSeminarsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<FreeSeminarsResponse> {
  "use cache";
  cacheTag("free-seminars-list");

  try {
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key]!.toString());
      }
    }

    const res = await fetch(
      `${API_BASE}/free-seminars?${urlParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch free seminars: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getFreeSeminarsCached:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching free seminars");
    }
  }
}

export async function getFreeSeminars(
  params: Record<string, unknown> = {},
): Promise<FreeSeminarsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    return await getFreeSeminarsCached(token, params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getFreeSeminars:", error.message);
      throw new Error("Error fetching free seminars");
    } else {
      throw new Error("Error fetching free seminars");
    }
  }
}

// ============================================================
// GET Free Seminar by ID
// ============================================================

export async function getFreeSeminarById(
  id: number,
): Promise<SingleFreeSeminarResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/free-seminars/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch free seminar: ${res.status} ${res.statusText}`,
      );
    }

    const data: SingleFreeSeminarResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getFreeSeminarById:", error.message);
      throw new Error("Error fetching free seminar");
    } else {
      throw new Error("Error fetching free seminar");
    }
  }
}
// ============================================================
// CREATE Free Seminar
// ============================================================

export async function createFreeSeminar(
  formData: FormData,
): Promise<SingleFreeSeminarResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const url = `${API_BASE}/free-seminars`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result: SingleFreeSeminarResponse = await response.json();
    updateTag("free-seminars-list");

    return result;
  } catch (error: unknown) {
    console.error("Error in createFreeSeminar:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Something went wrong");
  }
}

// ============================================================
// UPDATE Free Seminar
// ============================================================

export async function updateFreeSeminar(
  id: number,
  formData: FormData,
): Promise<SingleFreeSeminarResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }
    // formData.append("_method", "PUT");
    const res = await fetch(`${API_BASE}/free-seminars/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result: SingleFreeSeminarResponse = await res.json();

    updateTag("free-seminars-list");

    return result;
  } catch (error: unknown) {
    console.error("Error in updateFreeSeminar:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Something went wrong");
  }
}

// ============================================================
// DELETE Free Seminar
// ============================================================

export async function deleteFreeSeminar(
  id: number,
): Promise<SingleFreeSeminarResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/free-seminars/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result: SingleFreeSeminarResponse = await res.json();
    
    updateTag("free-seminars-list");

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in deleteFreeSeminar:", error.message);
      throw new Error("Error deleting free seminar");
    } else {
      throw new Error("Error deleting free seminar");
    }
  }
}

//free-seminars service ts file ended here
