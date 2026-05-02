"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag } from "next/cache";
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
): Promise<ConsultantPerformanceResponse> {
  "use cache";
  cacheTag("consultant-performance-list");

  try {
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
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching consultant performance");
    }
  }
}

export async function getConsultantPerformance(
  params: Record<string, unknown> = {}
): Promise<ConsultantPerformanceResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  return getConsultantPerformanceCached(token, params);
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
): Promise<PerformanceSummaryResponse> {
  "use cache";
  cacheTag("consultant-performance-summary");

  try {
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
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching performance summary");
    }
  }
}

export async function getConsultantPerformanceSummary(
  params: Record<string, unknown> = {}
): Promise<PerformanceSummaryResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  return getConsultantPerformanceSummaryCached(token, params);
}

export async function getConsultantAveragePerformanceCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<AveragePerformanceResponse> {
  "use cache";
  cacheTag("consultant-average-performance");

  try {
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
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching average performance");
    }
  }
}

export async function getConsultantAveragePerformance(
  params: Record<string, unknown> = {}
): Promise<AveragePerformanceResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  return getConsultantAveragePerformanceCached(token, params);
}
