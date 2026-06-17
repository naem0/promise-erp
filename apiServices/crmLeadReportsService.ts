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

export interface CRMLeadReportsBranch {
  branch_id: number;
  branch_name: string;
}

export interface CRMLeadReportsLeadsGroup {
  "total-leads": number | string;
  "available-leads": number;
}

export interface CRMLeadReportsStatusGroup4 {
  new: number;
  followup: number;
  walking_visitor: number;
  old: number;
}

export interface CRMLeadReportsStatusGroup2 {
  new: number;
  followup: number;
}

export interface CRMLeadReportsStatusGroup3Busy {
  new: number;
  followup: number;
  old: number;
}

export interface CRMLeadReportsStatusGroup3 {
  new: number;
  walking_visitor: number;
  old: number;
}

export interface CRMLeadReportsTotalGroup {
  leads: CRMLeadReportsLeadsGroup;
  assigned: CRMLeadReportsStatusGroup4;
  contacted: CRMLeadReportsStatusGroup4;
  remaining: CRMLeadReportsStatusGroup2;
  busy: CRMLeadReportsStatusGroup3Busy;
  interested: CRMLeadReportsStatusGroup3;
  follow_up: CRMLeadReportsStatusGroup3;
  enrolled: CRMLeadReportsStatusGroup3;
  cancelled: CRMLeadReportsStatusGroup3;
  not_received: CRMLeadReportsStatusGroup3;
  call_rejected: CRMLeadReportsStatusGroup3;
  target_progress: string;
  total_time?: string;
}

export interface CRMLeadReportsCourseItem {
  course_id: number;
  course_name: string;
  total_lead: string;
  leads: CRMLeadReportsLeadsGroup;
  assigned: CRMLeadReportsStatusGroup4;
  contacted: CRMLeadReportsStatusGroup4;
  remaining: CRMLeadReportsStatusGroup2;
  busy: CRMLeadReportsStatusGroup3Busy;
  interested: CRMLeadReportsStatusGroup3;
  follow_up: CRMLeadReportsStatusGroup3;
  enrolled: CRMLeadReportsStatusGroup3;
  cancelled: CRMLeadReportsStatusGroup3;
  not_received: CRMLeadReportsStatusGroup3;
  call_rejected: CRMLeadReportsStatusGroup3;
  target_progress: string;
  total_time?: string;
}

export interface CRMLeadReportsConsultantItem {
  user_id: number;
  consultant_name: string;
  branch: CRMLeadReportsBranch[];
  courses: CRMLeadReportsCourseItem[];
  total: CRMLeadReportsTotalGroup;
}

export interface CRMLeadReportsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    grand_total: CRMLeadReportsTotalGroup;
    total_records: number;
    report_data: CRMLeadReportsConsultantItem[];
    pagination?: PaginationType;
  };
  errors?: Record<string, string[]>;
}


// Old Leads Report item (assigned outside date range, talked to during)
export interface CRMOldLeadReportsItem {
  user_id: number;
  consultant_name: string;
  course_id: number;
  course_name: string;
  branch: CRMLeadReportsBranch[];
  total_lead: number;
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

// New Leads Report item (assigned within date range)
export interface CRMNewLeadReportsItem {
  user_id: number;
  consultant_name: string;
  course_id: number;
  course_name: string;
  branch: CRMLeadReportsBranch[];
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

export interface CRMOldLeadReportsResponse {

  success: boolean;
  message: string;
  code: number;
  data: {
    total_course_lead: number;
    total_branch_lead: number;
    total_summary: CRMLeadReportsSummary;
    total_records: number;
    report_data: CRMOldLeadReportsItem[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface CRMNewLeadReportsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_course_lead: number;
    total_branch_lead: number;
    total_summary: CRMLeadReportsSummary;
    total_records: number;
    report_data: CRMNewLeadReportsItem[];
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

// =======================
// GET OLD LEADS REPORT (CACHED)
// =======================

export async function getCRMOldLeadReportsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<CRMOldLeadReportsResponse | null> {
  "use cache: private";
  cacheTag("crm-old-lead-reports");
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/crm/lead/reports/old?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (res?.status === 404) {
      console.warn("No old leads report data found for the given parameters.");
      return null;
    }
    if (res?.status === 401) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }
    if (res?.status === 403) {
      console.warn("Forbidden: Insufficient permissions.");
      return null;
    }
    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching CRM old leads report");
    }
  }
}

export async function getCRMOldLeadReports(
  params: Record<string, unknown> = {},
): Promise<CRMOldLeadReportsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");
  return getCRMOldLeadReportsCached(token, params);
}

// =======================
// GET NEW LEADS REPORT (CACHED)
// =======================

export async function getCRMNewLeadReportsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<CRMNewLeadReportsResponse | null> {
  "use cache: private";
  cacheTag("crm-new-lead-reports");
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/crm/lead/reports/new?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (res?.status === 404) {
      console.warn("No new leads report data found for the given parameters.");
      return null;
    }
    if (res?.status === 401) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }
    if (res?.status === 403) {
      console.warn("Forbidden: Insufficient permissions.");
      return null;
    }
    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching CRM new leads report");
    }
  }
}

export async function getCRMNewLeadReports(
  params: Record<string, unknown> = {},
): Promise<CRMNewLeadReportsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");
  return getCRMNewLeadReportsCached(token, params);
}
