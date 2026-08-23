"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";
import { PaginationType } from "@/types/pagination";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

//   ******* Start getCourseSalesSummary API *******

export interface CourseSalesSummaryItem {
  title?: string;
  key?: string;
  value: number;
  growth: string;
  course_name?: string;
}

export interface CourseSalesSummaryData {
  total_branches: number;
  summary: CourseSalesSummaryItem[];
}

export interface CourseSalesSummaryApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: CourseSalesSummaryData;
  errors?: Record<string, string[]>;
}

export async function getCourseSalesSummaryCached(
  token: string
): Promise<CourseSalesSummaryApiResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.ENROLLMENTS);
  try {
    const res = await fetch(`${API_BASE}/dashboard/course-sales-summary`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res?.status === 404) {
      console.warn("No course sales summary found (404).");
      return null;
    }

    if (res?.status === 401 || res?.status === 403) {
      console.warn("Unauthorized/Forbidden access to course sales summary");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const data: CourseSalesSummaryApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error in getCourseSalesSummaryCached:", error.message);
    } else {
      console.error("Service error in getCourseSalesSummaryCached");
    }
    return null;
  }
}

export async function getCourseSalesSummary(): Promise<CourseSalesSummaryApiResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }

  const _cachedResult = await getCourseSalesSummaryCached(token);

  if (!_cachedResult) {
    throw new Error("Failed to fetch course sales summary from cache.");
  }

  return _cachedResult;
}
//   ******* End getCourseSalesSummary API *******

//   ******* Start getCourseSalesReportList API *******

export interface CourseSalesReportItem {
  branch_id: number;
  branch_name: string;
  course_name: string;
  batch_name: string;
  received: number;
  due: number;
  total_enrollments: number;
}

export interface CourseSalesReportData {
  totals: {
    received: number;
    due: number;
    total_enrollments: number;
  };
  report: CourseSalesReportItem[];
  pagination: PaginationType;
}

export interface CourseSalesReportApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: CourseSalesReportData;
  errors?: Record<string, string[]>;
}

export async function getCourseSalesReportListCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<CourseSalesReportApiResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.ENROLLMENTS);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
        urlParams.append(key, String(params[key]));
      }
    }

    const queryString = urlParams.toString() ? `?${urlParams.toString()}` : "";

    const res = await fetch(`${API_BASE}/dashboard/course-sales-report${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res?.status === 404) {
      console.warn("No course sales report found (404).");
      return null;
    }

    if (res?.status === 401 || res?.status === 403) {
      console.warn("Unauthorized/Forbidden access to course sales report");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const data: CourseSalesReportApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error in getCourseSalesReportListCached:", error.message);
    } else {
      console.error("Service error in getCourseSalesReportListCached");
    }
    return null;
  }
}

export async function getCourseSalesReportList(
  params: Record<string, unknown> = {}
): Promise<CourseSalesReportApiResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }

  const _cachedResult = await getCourseSalesReportListCached(token, params);

  if (!_cachedResult) {
    throw new Error("Failed to fetch course sales report list from cache.");
  }

  return _cachedResult;
}
//   ******* End getCourseSalesReportList API *******
