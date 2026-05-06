"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface CRMLeadCourse {
  id: number;
  name: string;
}

export interface CRMLeadCategory {
  id: number;
  name: string;
}

export interface CRMLeadBranch {
  id: number;
  name: string;
}

export interface CRMLead {
  id: number;
  name: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address: string;
  referrer_name?: string;
  referrer_phone?: string;
  course_name?: string;
  course?: CRMLeadCourse;
  course_type: number;
  course_type_text: string;
  shift: number;
  shift_text: string;
  status: number;
  status_text: string;
  source?: {
    id: number;
    name: string;
  };
  source_text: string;
  fb_lead_id?: string;
  category?: CRMLeadCategory;
  branch?: CRMLeadBranch;
  assigned_consultant?: {
    id: number;
    name: string;
    phone?: string;
    email: string;
  };
  notes?: string;
  profession?: string;
  institute?: string;
  age?: number;
  call_count: number;
  message_count: number;
  last_date?: string;
}

export interface CRMLeadsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_leads: number;
    leads: CRMLead[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleCRMLeadResponse {
  success: boolean;
  message: string;
  code: number;
  data: CRMLead;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET LEADS (CACHED)
// =======================

export async function getCRMLeadsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<CRMLeadsResponse> {
  "use cache: private";
  cacheTag("crm-leads-list");
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/crm/leads?${urlParams.toString()}`, {
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
      throw new Error("Error fetching CRM leads");
    }
  }
}

// =======================
// GET LEADS WRAPPER
// =======================

export async function getCRMLeads(
  params: Record<string, unknown> = {},
): Promise<CRMLeadsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  return getCRMLeadsCached(token, params);
}

// =======================
// GET SINGLE LEAD
// =======================

export async function getCRMLeadById(
  id: number,
): Promise<SingleCRMLeadResponse> {
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
    console.error("Error in getCRMLeadById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch CRM lead");
    } else {
      throw new Error("Failed to fetch CRM lead");
    }
  }
}

// =======================
// CREATE LEAD
// =======================

export async function createCRMLead(
  formData: FormData,
): Promise<SingleCRMLeadResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/leads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("crm-leads-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createCRMLead:", error);
      throw new Error(error.message || "Failed to create CRM lead");
    } else {
      throw new Error("Failed to create CRM lead");
    }
  }
}

// =======================
// UPDATE LEAD
// =======================

export async function updateCRMLead(
  id: number,
  formData: FormData,
): Promise<SingleCRMLeadResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/leads/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("crm-leads-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateCRMLead:", error);
      throw new Error(error.message || "Failed to update CRM lead");
    } else {
      throw new Error("Failed to update CRM lead");
    }
  }
}

// =======================
// DELETE LEAD
// =======================


export async function deleteCRMLead(
  id: number,
): Promise<SingleCRMLeadResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session/token");
    }

    const res = await fetch(`${API_BASE}/crm/leads/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("crm-leads-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteCRMLead:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete CRM lead");
    }
  }
}

// =======================
// IMPORT LEADS
// =======================

export interface CRMLeadsImportResponse {
  success: boolean;
  message: string;
  code: number;
  data: CRMLead | null;
  errors?: Record<string, string[]>;
}

export async function importCRMLeads(formData: FormData): Promise<CRMLeadsImportResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/leads/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    // Invalidate the cache to show the new imported leads
    updateTag("crm-leads-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in importCRMLeads:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to import CRM leads");
    } else {
      throw new Error("Failed to import CRM leads");
    }
  }
}
