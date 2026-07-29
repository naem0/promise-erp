"use server";
 
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";
 
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
 
// =======================
// Interfaces
// =======================
 
export interface LeadActivity {
  id: number;
  lead_id: number;
  lead_name?: string;
  course_name?: string;
  next_follow_up_date?: string;
  last_follow_up_date?: string;
  call_count?: number;
  message_count?: number;
  status_id: number;
  status_text: string;
  note: string;
  user_name?: string;
  user_designation?: string;
  date?: string;
  type?: number;
  type_text?: string;
  created_at: string;
  last_activity: string;
  lead_created_date: string;
  time?: string;
}
export interface GrowthStats {
  total_leads: number;
  new_enrollments: number;
  lost_leads: number;
  total_follow_up: number;
  today_leads: number;
  old_leads: number;
  today_follow_up: number;
  conversion_rate: number;
}
 
export interface LeadsActivityResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    growth?: GrowthStats;
    activities: LeadActivity[];
    pagination: PaginationType;
    stats: {
      total_leads: number;
      new_enrollments: number;
      lost_leads: number;
      conversion_rate: string;
      old_leads?: number;
      today_leads?: number;
      total_follow_up?: number;
      today_follow_up?: number;
    };
  };
  errors?: Record<string, string[]>;
}
 
export interface SingleLeadActivityResponse {
  success: boolean;
  message: string;
  code: number;
  data: LeadActivity;
  errors?: Record<string, string[]>;
}
 
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_image?: string;
  lead_id?: string;
  interested_batch?: string;
}
 
export interface SingleLeadResponse {
  success: boolean;
  message: string;
  code: number;
  data: Lead;
}
 
export interface LeadInfo {
  id?: number;
  name: string;
  phone?: string;
  whatsapp: string;
  address?: string;
  email?: string;
  referrer_name?: string;
  referrer_phone?: string;
  status_id?: number;
  status_name?: string;
  course_type?: number;
  course_type_name?: string;
  shift?: number;
  shift_name?: string;
  source_id?: number;
  source_name?: string;
  branch_id?: number;
  branch_name?: string;
  course_id?: number;
  interested_course?: string;
  interested_batch?: string;
  profession?: string;
  institute?: string;
  age?: number;
}
 
export interface LeadActivitiesListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    lead_info: LeadInfo;
    activities: LeadActivity[];
  };
  errors?: Record<string, string[]>;
}
 
// =======================
// GET LEAD BY ID
// =======================
 
export async function getLeadById(
  id: number,
): Promise<SingleLeadResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
 
    if (!token) throw new Error("No valid session/token");
 
    const res = await fetch(`${API_BASE}/crm/leads/${id}`, {
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
    console.error("Error in getLeadById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch lead");
    } else {
      throw new Error("Failed to fetch lead");
    }
  }
}
 
// =======================
// GET ALL LEADS ACTIVITY (CACHED)
// =======================
 
export async function getLeadsActivityCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<LeadsActivityResponse | null> {
  "use cache";
  cacheTag("leads-activity-list");
 
  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }
 
    const res = await fetch(`${API_BASE}/crm/leads/activity-list?${urlParams.toString()}`, {
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
      console.error("Service error:", "Error fetching leads activity");
      return null;
    }
  }
}
 
// =======================
// GET ALL LEADS ACTIVITY WRAPPER
// =======================
 
export async function getLeadsActivity(
  params: Record<string, unknown> = {},
): Promise<LeadsActivityResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getLeadsActivityCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET TODAY FOLLOW-UP LEADS (CACHED)
// =======================

export async function getTodayFollowUpLeadsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<LeadsActivityResponse | null> {
  "use cache";
  cacheTag("today-follow-up-leads");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/crm/leads/today-follow-ups?${urlParams.toString()}`, {
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
      console.error("Service error:", "Error fetching today follow up leads");
      return null;
    }
  }
}

// =======================
// GET TODAY FOLLOW-UP LEADS WRAPPER
// =======================

export async function getTodayFollowUpLeads(
  params: Record<string, unknown> = {},
): Promise<LeadsActivityResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getTodayFollowUpLeadsCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch today's follow-up data from cache.");

  return _cachedResult;
}
 
// =======================
// GET LEAD ACTIVITIES BY LEAD ID
// =======================
 
export async function getLeadActivitiesByLeadId(
  leadId: number,
): Promise<LeadActivitiesListResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
 
    if (!token) throw new Error("No valid session/token");
 
    const res = await fetch(`${API_BASE}/crm/leads/${leadId}/activities`, {
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
    console.error("Error in getLeadActivitiesByLeadId:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch lead activities");
    } else {
      throw new Error("Failed to fetch lead activities");
    }
  }
}
 
// =======================
// CREATE LEAD ACTIVITY
// =======================
 
export async function createLeadActivity(
  payload: {
    lead_id: number;
    date: string;
    type: number;
    status_id: number;
    note: string;
    time?: string;
  },
): Promise<SingleLeadActivityResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
 
    if (!token) throw new Error("No valid session/token");
 
    const res = await fetch(`${API_BASE}/crm/leads/activities`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
 
    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("leads-activity-list");
      if (res.ok && result?.success) {
        updateTag("today-follow-up-leads");
        updateTag("crm-notifications-list");
      }
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createLeadActivity:", error);
      throw new Error(error.message || "Failed to create lead activity");
    } else {
      throw new Error("Failed to create lead activity");
    }
  }
}

// =======================
// GET LEAD ENROLLMENT INFO
// =======================

export interface LeadEnrollmentInfo {
  id: number;
  student_id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  branch_id: number;
  course_id: number;
  batch_id?: number;
}

export interface LeadEnrollmentInfoResponse {
  success: boolean;
  message: string;
  code: number;
  data: LeadEnrollmentInfo;
  errors?: Record<string, string[]>;
}

export async function getLeadEnrollmentInfo(
  leadId: number,
): Promise<LeadEnrollmentInfoResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/leads/${leadId}/enrollment-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.log("Lead not found for enrollment");
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.log("Unauthorized to fetch lead enrollment info");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("Error in getLeadEnrollmentInfo:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch lead enrollment info");
    } else {
      throw new Error("Failed to fetch lead enrollment info");
    }
  }
}




// ======================= getLeadActivitiesSummary =======================
export interface LeadActivitySummary {
  total_leads: number;
  today_leads: number;
  total_enrollments: number;
  today_enrollments: number;
  total_follow_up: number;
  today_follow_up: number;
  total_lost: number;
  today_lost: number;
  conversion_rate: string;
}
export interface LeadActivitiesSummaryResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    stats: LeadActivitySummary;
  }
  errors?: Record<string, string[]>;
}
export async function getLeadActivitiesSummary(
): Promise<LeadActivitiesSummaryResponse | null> {
  // try-এর বাইরে রাখা হয়েছে যাতে Next.js build-time dynamic signal সঠিকভাবে প্রপাগেট হয়
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/crm/leads/activity-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.log("Lead not found for enrollment");
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.log("Unauthorized to fetch lead enrollment info");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in getLeadActivitiesSummary:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch lead activities");
    } else {
      throw new Error("Failed to fetch lead activities");
    }
  }
}
