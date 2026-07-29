"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface Review {
  id: number;
  user: {
    id: number;
    name: string;
  };
  batch: {
    id: number;
    name: string;
  };
  rating: number;
  feedback: string;
  status: number;
  is_featured: number;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_reviews: number;
    reviews: Review[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleReviewResponse {
  success: boolean;
  message: string;
  code: number;
  data: Review;
  errors?: Record<string, string[] | string>;
}



// =======================
//  Get Reviews (Cached)
// =======================

export async function getReviewsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<ReviewsResponse | null> {
  "use cache";
  cacheTag("reviews-list");

  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/reviews?${urlParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching reviews");
      return null;
    }
  }
}

// =======================
//  Get Reviews (Main)
// =======================

export async function getReviews(
  params: Record<string, unknown> = {}
): Promise<ReviewsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getReviewsCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
//  Get Review By ID
// =======================

export async function getReviewById(
  id: number
): Promise<SingleReviewResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("Error in getReviewById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch review");
    } else {
      throw new Error("Failed to fetch review");
    }
  }
}

// =======================
//  CREATE REVIEW
// =======================

export async function createReview(
  formData: FormData
): Promise<SingleReviewResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("reviews-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createReview:", error);
      throw new Error(error.message || "Failed to create review");
    } else {
      throw new Error("Failed to create review");
    }
  }
}

// =======================
//  UPDATE REVIEW
// =======================

export async function updateReview(
  id: number,
  formData: FormData
): Promise<SingleReviewResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    formData.append("_method", "PUT");

    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("reviews-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateReview:", error);
      throw new Error(error.message || "Failed to update review");
    } else {
      throw new Error("Failed to update review");
    }
  }
}

// =======================
//  APPROVE REVIEW
// =======================

export async function approveReview(
  id: number
): Promise<SingleReviewResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/reviews/${id}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("reviews-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in approveReview:", error);
      throw new Error(error.message || "Failed to approve review");
    } else {
      throw new Error("Failed to approve review");
    }
  }
}

// =======================
//  DELETE REVIEW
// =======================

export async function deleteReview(
  id: number
): Promise<SingleReviewResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("reviews-list");
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteReview:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete review");
    }
  }
}
