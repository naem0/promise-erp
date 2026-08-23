"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface ConsultantPerformance {
  id: number;
  name: string;
  designation: string;
  department: string;
  profile_image?: string;
  title_display: string;
  total_lead_assign: number;
  enrolled: number;
  contacted: number;
  lost: number;
  performance_rate: string;
  performance_note?: string;
}

export interface ConsultantPerformanceResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_consultants: number;
    consultants: ConsultantPerformance[];
    pagination: PaginationType;
  };
}

export async function getConsultantPerformanceCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<ConsultantPerformanceResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.CRM_CONSULTANT_PERFORMANCE);
  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
        urlParams.append(key, String(params[key]));
      }
    }

    const queryString = urlParams.toString();
    const url = queryString ? `${API_BASE}/crm/performance?${queryString}` : `${API_BASE}/crm/performance`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching consultant performance");
      return null;
    }
  }
}

export async function getConsultantPerformance(
  params: Record<string, unknown> = {}
): Promise<ConsultantPerformanceResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getConsultantPerformanceCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

export interface TopPerformer {
  id: number;
  name: string;
  profile_image?: string;
  designation: string;
  department: string;
  title_display: string;
  total_assign: number;
  enrolled: number;
  performance_rate: number;
  formatted_score: string;
}

export interface PerformanceSummaryData {
  total_consultants: number;
  active_consultants: number;
  top_performers: TopPerformer[];
  month: string;
}

export interface PerformanceSummaryResponse {
  success: boolean;
  message: string;
  code: number;
  data: PerformanceSummaryData;
}

export interface AveragePerformanceData {
  average_performance: number;
  total_assigned: number;
  total_enrolled: number;
  period: string;
}

export interface AveragePerformanceResponse {
  success: boolean;
  message: string;
  code: number;
  data: AveragePerformanceData;
}

export async function getConsultantPerformanceSummaryCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<PerformanceSummaryResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.CRM_CONSULTANT_PERFORMANCE);
  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
        urlParams.append(key, String(params[key]));
      }
    }

    const queryString = urlParams.toString();
    const url = queryString? `${API_BASE}/crm/performance/summary?${queryString}`
      : `${API_BASE}/crm/performance/summary`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching performance summary");
      return null;
    }
  }
}

export async function getConsultantPerformanceSummary(
  params: Record<string, unknown> = {}
): Promise<PerformanceSummaryResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getConsultantPerformanceSummaryCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

export async function getConsultantAveragePerformanceCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<AveragePerformanceResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.CRM_CONSULTANT_PERFORMANCE);
  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
        urlParams.append(key, String(params[key]));
      }
    }

    const queryString = urlParams.toString();
    const url = queryString ? `${API_BASE}/crm/performance/average-performance?${queryString}` : `${API_BASE}/crm/performance/average-performance`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching average performance");
      return null;
    }
  }
}

export async function getConsultantAveragePerformance(
  params: Record<string, unknown> = {}
): Promise<AveragePerformanceResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getConsultantAveragePerformanceCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}
