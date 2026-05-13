"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { handleApiError, processApiResponse } from "@/lib/apiErrorHandler";
import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// ----------------------
// Interfaces
// ----------------------
export interface CouponCourse {
  id: number;
  title: string;
  slug: string;
}

export interface CouponItem {
  id: number;
  title: string;
  coupon_code: string;
  discount_percentage: number;
  coupon_expire_time: string;
  status: number;
  usage_limit: number;
  used_count: number;
  course_count: number;
  courses: CouponCourse[];
}

export interface CouponData {
  total_coupons: number;
  coupons: CouponItem[];
  pagination: PaginationType;
}

export interface CouponResponse {
  success: boolean;
  message: string;
  code: number;
  data: CouponData;
  errors?: Record<string, string[]>;
}

export interface SingleCouponResponse {
  success: boolean;
  message: string;
  code: number;
  data: CouponItem | null;
  errors?: Record<string, string[] | string>;
}

export interface CreateCouponRequest {
  title: string;
  coupon_code: string;
  discount_percentage: number;
  coupon_expire_time: string;
  status: number;
  usage_limit: number;
  course_count?: number;
  course_id: number[];
}

export interface UpdateCouponRequest {
  title: string;
  coupon_code: string;
  discount_percentage: number;
  coupon_expire_time: string;
  status: number;
  usage_limit: number;
  course_id: number[];
}

// =======================
// Get Coupons (Paginated)
// =======================
export async function getCouponsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<CouponResponse | null> {
  "use cache";
  cacheTag("coupons-list");

  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params.hasOwnProperty(key)) {
        urlParams.append(key, params[key].toString());
      }
    }

    const res = await fetch(`${API_BASE}/coupons?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: CouponResponse = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getCouponsCached:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getCoupons(
  params: Record<string, unknown> = {}
): Promise<CouponResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const _cachedResult = await getCouponsCached(token, params);

    if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

    return _cachedResult;
  } catch (error: unknown) {
    console.error("Error in getCoupons:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get coupons");
  }
}

// =======================
// Get Coupon By ID
// =======================
export async function getCouponById(id: number): Promise<SingleCouponResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
        data: null,
      };
    }

    const res = await fetch(`${API_BASE}/coupons/${id}/details`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("getCouponById: Expected JSON but got:", contentType);
      return {
        success: false,
        message: `Invalid response format. Expected JSON but received ${contentType || 'unknown'}. Please check if the API endpoint exists.`,
        code: res.status,
        data: null,
      };
    }

    const data: SingleCouponResponse = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getCouponById:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get coupon",
      code: 500,
      data: null,
    };
  }
}

// =======================
// Create Coupon
// =======================
export async function createCoupon(couponData: CreateCouponRequest): Promise<SingleCouponResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
        data: null,
      };
    }

    const res = await fetch(`${API_BASE}/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(couponData),
    });

    const result = await processApiResponse(res, "Failed to create coupon");

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: result.errors,
        code: result.code,
        data: null,
      };
    }

    updateTag("coupons-list");

    return {
      success: true,
      message: result.message || "Coupon created successfully",
      data: result.data || null,
      code: result.code || 201,
    };
  } catch (error: unknown) {
    const errorResult = await handleApiError(error, "Failed to create coupon");
    return {
      success: false,
      message: errorResult.message,
      code: errorResult.code,
      data: null,
    };
  }
}

// =======================
// Update Coupon
// =======================
export async function updateCoupon(id: number, couponData: UpdateCouponRequest): Promise<SingleCouponResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
        data: null,
      };
    }

    console.log("####API Update URL:", `${API_BASE}/coupons/${id}`);
    console.log("####API Update Data:", JSON.stringify(couponData, null, 2));

    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(couponData),
    });


    const result = await processApiResponse(res, "Failed to update coupon");
    console.log("####Processed Result:", result);

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: result.errors,
        code: result.code,
        data: null,
      };
    }

    updateTag("coupons-list");

    return {
      success: true,
      message: result.message || "Coupon updated successfully",
      data: result.data || null,
      code: result.code || 200,
    };
  } catch (error: unknown) {
    const errorResult = await handleApiError(error, "Failed to update coupon");
    return {
      success: false,
      message: errorResult.message,
      code: errorResult.code,
      data: null,
    };
  }
}

// =======================
// Delete Coupon
// =======================
export async function deleteCoupon(id: number): Promise<SingleCouponResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
        data: null,
      };
    }

    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await processApiResponse(res, "Failed to delete coupon");

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: result.errors,
        code: result.code,
        data: null,
      };
    }

    updateTag("coupons-list");

    return {
      success: true,
      message: result.message || "Coupon deleted successfully",
      data: result.data || null,
      code: result.code || 200,
    };
  } catch (error: unknown) {
    const errorResult = await handleApiError(error, "Failed to delete coupon");
    return {
      success: false,
      message: errorResult.message,
      code: errorResult.code,
      data: null,
    };
  }
}
