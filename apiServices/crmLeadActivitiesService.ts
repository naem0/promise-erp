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
  status: number;
  status_text: string;
  note: string;
  user_name?: string;
  user_designation?: string;
  date?: string;
  type?: number;
  type_text?: string;
  created_at: string;
}
 
export interface LeadsActivityResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
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
    growth?: Record<string, number>;
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
  name: string;
  phone?: string;
  whatsapp: string;
  address?: string;
  email?: string;
  referrer_name?: string;
  referrer_phone?: string;
  status?: number;
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
    status: number;
    note: string;
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
 
    updateTag("leads-activity-list");
    updateTag("crm-notifications-list");
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
