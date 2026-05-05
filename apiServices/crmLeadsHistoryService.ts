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

export interface LeadHistory {
  id: number;
  lead_id: number;
  lead_name?: string;
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

export interface LeadsHistoryResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    histories: LeadHistory[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleLeadHistoryResponse {
  success: boolean;
  message: string;
  code: number;
  data: LeadHistory;
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
}

export interface LeadHistoriesListResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        lead_info: LeadInfo;
        histories: LeadHistory[];
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
// GET ALL LEADS HISTORY (CACHED)
// =======================

export async function getLeadsHistoryCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<LeadsHistoryResponse> {
  "use cache";
  cacheTag("leads-history-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/crm/leads/history-list?${urlParams.toString()}`, {
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
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching leads history");
    }
  }
}

// =======================
// GET ALL LEADS HISTORY WRAPPER
// =======================

export async function getLeadsHistory(
  params: Record<string, unknown> = {},
): Promise<LeadsHistoryResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  return getLeadsHistoryCached(token, params);
}

// =======================
// GET LEAD HISTORIES BY LEAD ID
// =======================

export async function getLeadHistoriesByLeadId(
  leadId: number,
): Promise<LeadHistoriesListResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/leads/${leadId}/histories`, {
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
    console.error("Error in getLeadHistoriesByLeadId:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch lead histories");
    } else {
      throw new Error("Failed to fetch lead histories");
    }
  }
}

// =======================
// CREATE LEAD HISTORY
// =======================

export async function createLeadHistory(
  payload: {
      lead_id: number;
      date: string;
      type: number;
      status: number;
      note: string;
  },
): Promise<SingleLeadHistoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/leads/histories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    updateTag("leads-history-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createLeadHistory:", error);
      throw new Error(error.message || "Failed to create lead history");
    } else {
      throw new Error("Failed to create lead history");
    }
  }
}
