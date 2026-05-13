"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface CRMLeadReportSummary {
  total_assigned: number;
  total_enrolled: number;
  total_contacted: number;
  total_follow_up: number;
  total_interested: number;
  total_lost: number;
  total_target_progress: string;
}

export interface CRMLeadReportItem {
  user_id: number;
  consultant_name: string;
  course_id: string;
  course_name: string;
  branch_id: string;
  branch_name: string;
  date: string;
  total_assigned: number;
  contacted: number;
  target_progress: string;
  enrolled: number;
  follow_up: number;
  interested: number;
  lost: number;
}

export interface CRMLeadsReportResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_course_lead: number;
    total_branch_lead: number;
    total_summary: CRMLeadReportSummary;
    total_records: number;
    report_data: CRMLeadReportItem[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface CRMLeadsReportSummaryCard {
  title: string;
  value: number;
  unit: string;
  comparison: string;
  is_up: boolean;
  color: string;
  icon: string;
}

export interface CRMLeadsReportSummaryCardsResponse {
  success: boolean;
  message: string;
  code: number;
  data: CRMLeadsReportSummaryCard[];
  errors?: Record<string, string[]>;
}

// =======================
// GET LEADS REPORT (CACHED)
// =======================

export async function getCRMLeadsReportCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<CRMLeadsReportResponse | null> {
  "use cache: private";
  cacheTag("crm-leads-report");
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/crm/lead/reports?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (res?.status === 404) {
      console.warn("No leads report data found for the given parameters.");
      return null;
    } 
    if (res?.status === 401) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }
    if (res?.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching CRM leads report");
    }
  }
}

// =======================
// GET LEADS REPORT WRAPPER
// =======================

export async function getCRMLeadsReport(
  params: Record<string, unknown> = {},
): Promise<CRMLeadsReportResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  return getCRMLeadsReportCached(token, params);
}

// =======================
// GET LEADS REPORT SUMMARY CARDS
// =======================

export async function getCRMLeadsReportSummaryCards(): Promise<CRMLeadsReportSummaryCardsResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/lead/reports/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 404) {
      console.warn("No leads report summary cards data found.");
      return null;
    } 
    if (res?.status === 401) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }
    if (res?.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching CRM leads report summary cards");
    }
  }
}
