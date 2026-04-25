"use server"

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { ApiResponse } from "@/lib/apiErrorHandler";
import { PaginationType } from "@/types/pagination";


const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// ==========================
// Interfaces
// ==========================

export interface BatchInstructor {
  id: number;
  name: string;
}

export interface Batch {
  id: number;
  // uuid: string;
  course_id: number;
  branch_id: number;
  name: string;
  price: number;
  discount: number;
  discount_type: string;
  duration: string;
  start_date: string;
  start_date_raw: string;
  end_date: string;
  end_date_raw: string;
  total_enrolled: number;
  is_online: number;
  apply_end_date: string;
  status: number;
  branch: {
    id: number;
    name: string;
  };
  course: {
    id: number;
    title: string;
    level: string | null;
  };
  instructors: BatchInstructor[];
  after_discount: number | string;
  teacher_ids?: number[];
  whatsapp_group_link?: string; // optional WhatsApp group link
}



export interface BatchResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    batches: Batch[];
    pagination: PaginationType;
  };
}

export interface BatchSingleResponse {
  success: boolean;
  message: string;
  code: number;
  data: Batch;
}

export interface BatchResponseType {
  success: boolean;
  message: string;
  errors?: { [key: string]: string[] | string }; data: Batch;
  code: number;
}

export interface CreateBatchRequest {
  course_id: number;
  branch_id: number;
  name: string;
  price: number;
  discount: number;
  discount_type: string;
  duration: string;
  start_date: string;
  end_date: string;
  is_online: number;
  apply_end_date: string;
  status: number;
  teacher_ids: number[];
  whatsapp_group_link?: string;
}

// ==========================
// Add Batch
// ==========================

export async function addBatch(batchData: CreateBatchRequest): Promise<BatchResponseType> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/batches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(batchData),
    });

    const result = await res.json();



    updateTag("batches-list");

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    else {
      throw new Error("Failed to add batch.");
    }
  }
}

// ==========================
// Get Batches
// ==========================

export async function getBatches(
  params: Record<string, unknown> = {}
): Promise<BatchResponse> {
  "use cache: private";
  cacheTag("batches-list");
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key].toString());
      }
    }

    const res = await fetch(`${API_BASE}/batches?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("Error in getBatches:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch batches.");
    }
  }
}


// ==========================
// Get Batch by ID
// ==========================

export async function getBatchById(
  id: string
): Promise<BatchSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/batches/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    return res.json();
  } catch (error: unknown) {
    console.error("Error in getBatchById:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch batch.");
  }
}

// ==========================
// Update Batch
// ==========================

export async function updateBatch(
  id: number,
  batchData: CreateBatchRequest
): Promise<BatchResponseType> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/batches/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...batchData,
        _method: "PUT",
      }),
    });

    const result = await res.json();



    updateTag("batches-list");
    updateTag(`batch-${id}`);

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to update batch.");
    }
  }
}

// ==========================
// Delete Batch
// ==========================


// ==========================
// Batch Chapter-Lesson Types
// ==========================

export interface BatchLesson {
  id?: number | null;
  title: string;
  description: string | null;
  duration: number;
  type: string | number;
  type_name?: string;
  video_url: string;
  order: number;
  is_preview: number;
  status: number;
  schedule_at: string | null;
}

export interface BatchChapter {
  id?: number;
  title: string;
  description: string;
  status: string | number;
  lessons: BatchLesson[];
  lessons_count?: number;
}

export interface BatchChapterLessonFormValues {
  batch_id: number;
  course_id?: number;
  chapters: BatchChapter[];
}

export interface BatchChapterLessonResponse {
  success: boolean;
  message: string;
  code: number;
  data?: BatchChapter[];
  errors?: Record<string, string[] | string>;
}

// ==========================
// Get Chapters by Batch ID
// ==========================

export async function getChaptersByBatchId(
  batchId: number
): Promise<BatchChapterLessonResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/chapter-lessons/batches/${batchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();



    return result;
  } catch (error) {
    console.error("Error in getChaptersByBatchId:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch batch chapters.");
    }
  }
}

// ==========================
// Bulk Update Batch Chapter-Lessons
// ==========================

export async function bulkUpdateBatchChapterLessons(
  data: BatchChapterLessonFormValues
): Promise<BatchChapterLessonResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/chapter-lessons/bulk-update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("Error in bulkUpdateBatchChapterLessons:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    else {
      throw new Error("Failed to update batch chapters and lessons.");
    }
  }
}
// ==========================
// Delete Batch
// ==========================

export async function deleteBatch(id: number): Promise<ApiResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/batches/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    // Revalidate cache
    updateTag("batches-list");
    updateTag(`batch-${id}`);

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete batch.");
    }
  }
}