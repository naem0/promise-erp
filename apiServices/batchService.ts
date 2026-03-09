"use server"

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { handleApiError, processApiResponse, ApiResponse } from "@/lib/apiErrorHandler";
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
  price: number | null;
  discount: number | null;
  discount_type: string | null;
  duration: string | null;
  start_date: string | null;
  start_date_raw: string | null;
  end_date: string | null;
  end_date_raw: string | null;
  total_enrolled: number | null;
  is_online: number;
  apply_end_date: string | null;
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
  after_discount: number | string | null;
  teacher_ids?: (string | number)[];
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
  message?: string;
  errors?: { [key: string]: string[] | string };
  data?: Batch;
  code?: number;
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
}

// ==========================
// Add Batch
// ==========================

export async function addBatch(batchData: CreateBatchRequest): Promise<BatchResponseType> {
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

    const res = await fetch(`${API_BASE}/batches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(batchData),
    });

    const result = await processApiResponse(res, "Failed to add batch.");

    if (!result.success) {
      return result;
    }

    revalidateTag("batches-list", "max");

    return {
      success: true,
      message: result.message || "Batch added successfully.",
      data: result.data,
      code: result.code,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to add batch.");
  }
}

// ==========================
// Get Batches
// ==========================

export async function getBatches(
  params: Record<string, unknown> = {}
): Promise<BatchResponse> {
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
      },
      next: {
        tags: ["batches-list"], // cache tag
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch batches.");
    }

    return res.json();
  } catch (error) {
    console.error("Error in getBatches:", error);
    throw error;
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
      },
      next: {
        tags: [`batch-${id}`],
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch batch: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error in getBatchById:", error);
    throw error;
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
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
      };
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

    const result = await processApiResponse(res, "Failed to update batch.");

    if (!result.success) {
      return result;
    }

    revalidateTag("batches-list", "max");
    revalidateTag(`batch-${id}`, "max");

    return {
      success: true,
      message: result.message || "Batch updated successfully.",
      data: result.data,
      code: result.code,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to update batch.");
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
      return {
        success: false,
        message: "Unauthorized",
        code: 401,
      };
    }

    const res = await fetch(`${API_BASE}/batches/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await processApiResponse(res, "Failed to delete batch.");

    if (!result.success) {
      return result;
    }

    revalidateTag("batches-list", "max");
    revalidateTag(`batch-${id}`, "max");

    return result;
  } catch (error) {
    return await handleApiError(error, "Failed to delete batch.");
  }
}
