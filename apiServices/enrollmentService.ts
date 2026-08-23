"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// ==========================
// Interfaces
// ==========================

export interface EnrollmentUser {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface EnrollmentBatch {
  id: number;
  name: string;
  branch_id?: number;
  branch_name?: string;
  course: {
    id: number;
    title: string;
    slug: string;
    featured_image: string;
  };
}

export interface EnrollmentApprovedBy {
  id: number;
  name: string;
}

export interface EnrollmentCoupon {
  id: number;
  coupon_code: string;
  discount_percentage: number;
}

export interface Enrollment {
  id: number;
  uuid: string;
  user_id: number;
  batch_id: number;
  coupon_id: number | null;
  original_price: number;
  discount_amount: number;
  final_price: number;
  enrollment_date: string;
  expired_at: string;
  approved_by: number | null;
  certificate_link: string | null;
  is_certificate_avail: boolean;
  total_completed_lessons: number;
  status: number;
  status_label: string;
  payment_method: number;
  payment_method_label: string;
  payment_status: number;
  payment_status_label: string;
  payment_type: number;
  payment_type_label: string;
  payment_amount: number;
  partial_payment_amount: number;
  due_amount: number;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
  user: EnrollmentUser;
  batch: EnrollmentBatch;
  approved_by_user: EnrollmentApprovedBy | null;
  coupon: EnrollmentCoupon | null;
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
  data: {
    enrollments: Enrollment[];
    pagination: PaginationType;
  };
}

export interface EnrollmentPaymentDetails {
  pre_amount?: number;
  paid_amount?: number;
  due_amount?: number;
  payment_method_name?: string;
  payment_status_name?: string;
  payment_type_name?: string;
  installment_type_name?: string;
  comment?: string;
}

export interface EnrollmentPaymentHistory {
  id: number;
  uuid: string;
  organization_id?: string | number;
  payment_details?: EnrollmentPaymentDetails;
  approved_by?: number | null;
}

export interface EnrollmentDetail {
  id: number;
  uuid: string;
  user_id: number | string;
  batch_id: number | string;
  coupon_id: number | null;
  original_price: number;
  discount_amount: number;
  final_price: number;
  enrollment_date: string;
  total_completed_lessons?: number | string;
  status?: number;
  status_label?: string;
  payment_status?: number;
  payment_method_label?: string;
  payment_status_label?: string;
  payment_type_label?: string | null;
  payment_amount?: number | null;
  partial_payment_amount?: number | null;
  due_amount?: number | null;
  payment_reference?: string | null;
  user?: EnrollmentUser;
  batch?: EnrollmentBatch;
  approved_by?: number | null;
  coupon?: EnrollmentCoupon | null;
  payment_histories?: EnrollmentPaymentHistory[];
}

export interface EnrollmentDetailResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data: EnrollmentDetail;
}

export interface UpdateEnrollmentPaymentStatusData {
  payment_status: number;
  payment_reference?: string;
}

export interface ApproveEnrollmentData {
  status?: number;
  payment_reference?: string;
}

export interface CreateEnrollmentData {
  user_id: number;
  batch_id: number;
  is_online?: number;
  class_schedule_id?: number;
  status?: number;
  payment_method?: number;
  payment_status?: number;
  payment_amount?: number;
  discount_amount?: number;
  payment_reference?: string;
}

// ==========================
// Get Enrollments
// ==========================

export async function getEnrollments(
  params: Record<string, unknown> = {}
): Promise<EnrollmentResponse> {
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

    const res = await fetch(`${API_BASE}/enrollments?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch enrollments.");
    }
    return result;
  } catch (error) {
    console.error("Error in getEnrollments:", error);
    throw error;
  }
}

// ==========================
// Get Single Enrollment
// ==========================

export async function getEnrollmentById(
  enrollmentId: string | number
): Promise<EnrollmentDetailResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/enrollments/${enrollmentId}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch enrollment details.");
    }

    return result;
  } catch (error) {
    console.error("Error in getEnrollmentById:", error);
    throw error;
  }
}

// ==========================
// Update Enrollment Payment Status
// ==========================

export async function updateEnrollmentPaymentStatus(
  enrollmentId: string | number,
  data: UpdateEnrollmentPaymentStatusData
): Promise<EnrollmentDetailResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append("payment_status", data.payment_status.toString());

    if (data.payment_reference) {
      formData.append("payment_reference", data.payment_reference);
    }

    const res = await fetch(`${API_BASE}/enrollments/${enrollmentId}/payment-status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Failed to update enrollment payment status.");
    }

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.ENROLLMENTS);
    }
    return result;
  } catch (error) {
    console.error("Error in updateEnrollmentPaymentStatus:", error);
    throw error;
  }
}

// ==========================
// Approve Enrollment
// ==========================

export async function approveEnrollment(
  enrollmentId: string | number,
  data: ApproveEnrollmentData
): Promise<EnrollmentDetailResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    // OpenAPI documentation shows POST method
    const res = await fetch(`${API_BASE}/enrollments/${enrollmentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Failed to approve enrollment.");
    }

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.ENROLLMENTS);
    }
    return result;
  } catch (error) {
    console.error("Error in approveEnrollment:", error);
    throw error;
  }
}

// ==========================
// Create Enrollment
// ==========================

export async function createEnrollment(
  data: CreateEnrollmentData
): Promise<EnrollmentDetailResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session or access token found.");
  }

  try {
    const res = await fetch(`${API_BASE}/enrollments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!result.success && !result.errors) {
      throw new Error(result.message || "Failed to create enrollment.");
    }

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.ENROLLMENTS);
    }
    return result;
  } catch (error: unknown) {
    if(error instanceof Error) {
      console.error("Error in createEnrollment:", error.message);
      throw new Error(error.message);
    } else {
      console.error("Error in createEnrollment: An unexpected error occurred");
      throw new Error("Failed to create enrollment");
    }
  }
}

// ==========================
// Bulk Transfer Enrollments
// ==========================

export interface BulkTransferEnrollmentsData {
  enrollment_ids: number[];
  to_batch_id: number;
  remarks?: string;
}

export interface BulkTransferEnrollmentsResponse {
  success: boolean;
  message: string;
  code?: number;
  errors?: Record<string, string[] | string>;
  data?: {
    transferred_count: number;
  };
}

export async function bulkTransferEnrollments(
  data: BulkTransferEnrollmentsData
): Promise<BulkTransferEnrollmentsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session or access token found.");
  }

  try {
    const res = await fetch(`${API_BASE}/enrollments/bulk-transfer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!result.success && !result.errors) {
      throw new Error(result.message || "Failed to bulk transfer enrollments.");
    }

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.ENROLLMENTS);
    }
    return result;
  } catch (error) {
    console.error("Error in bulkTransferEnrollments:", error);
    throw error;
  }
}

export interface EnrollmentStatsResponse {
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

export async function getEnrollmentStatsCached(
  token: string
): Promise<EnrollmentStatsResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.ENROLLMENTS);
  try {
    const res = await fetch(`${API_BASE}/enrollments/list-overview`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Enrollment list-overview not found (404). Returning null.");
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
    console.error("getEnrollmentStatsCached error:", error);
    return null;
  }
}

export async function getEnrollmentStats(): Promise<EnrollmentStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");

  try {
    const cachedResult = await getEnrollmentStatsCached(token);
    if (!cachedResult) throw new Error("Failed to fetch enrollment stats from cache.");
    return cachedResult;
  } catch (error: unknown) {
    console.error("getEnrollmentStats error:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to fetch enrollment stats");
  }
}
