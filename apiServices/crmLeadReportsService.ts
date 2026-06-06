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

export interface CRMLeadReportsSummary {
  total_lead: number;
  total_assigned: number;
  total_new: number;
  total_busy: number;
  total_interested: number;
  total_follow_up: number;
  total_enrolled: number;
  total_lost: number;
  total_not_received: number;
  total_call_rejected: number;
  total_contacted: number;
  total_target_progress: string;
}

export interface CRMLeadReportsItem {
  user_id: number;
  consultant_name: string;
  course_id: string;
  course_name: string;
  branch_id: string;
  branch_name: string;
  date: string;
  total_lead: number;
  total_assigned: number;
  contacted: number;
  target_progress: string;
  new: number;
  busy: number;
  interested: number;
  follow_up: number;
  enrolled: number;
  lost: number;
  not_received: number;
  call_rejected: number;
}

export interface CRMLeadReportsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_course_lead: number;
    total_branch_lead: number;
    total_summary: CRMLeadReportsSummary;
    total_records: number;
    report_data: CRMLeadReportsItem[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface CRMLeadReportsSummaryCard {
  title: string;
  value: number;
  unit: string;
  comparison: string;
  is_up: boolean;
  color: string;
  icon: string;
}

export interface CRMLeadReportsSummaryCardsResponse {
  success: boolean;
  message: string;
  code: number;
  data: CRMLeadReportsSummaryCard[];
  errors?: Record<string, string[]>;
}

// =======================
// GET LEADS REPORT (CACHED)
// =======================

export async function getCRMLeadReportsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<CRMLeadReportsResponse | null> {
  "use cache: private";
  cacheTag("crm-lead-reports");
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

export async function getCRMLeadReports(
  params: Record<string, unknown> = {},
): Promise<CRMLeadReportsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  return getCRMLeadReportsCached(token, params);
}

// =======================
// GET LEADS REPORT SUMMARY CARDS
// =======================

export async function getCRMLeadReportsSummaryCards(): Promise<CRMLeadReportsSummaryCardsResponse | null> {
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
