"use server";
import { cacheTag, updateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface AssignLeadContact {
  id: number;
  user_id: number;
  user_name: string;
  lead_id: number;
  lead_name: string;
}

export interface AssignLeadsResponse {
  success: boolean;
  message: string;
  code: number;
  data: AssignLeadContact[];
  errors?: Record<string, string[]>;
}

export interface Branch {
  id: number;
  name: string;
}

export interface Consultant {
  id: number;
  name: string;
  designation_name: string;
  department_name: string;
  profile_image?: string | null;
  branches?: Branch[];
}

export interface ConsultantsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_consultants: number;
    consultants: Consultant[];
    pagination: PaginationType;
  };
}

// =======================
// GET CONSULTANTS
// =======================

export async function getConsultants(): Promise<ConsultantsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/consultants`, {
      method: "GET",
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
      throw new Error("Error fetching consultants");
    }
  }
}

// =======================
// ASSIGN LEADS TO USER
// =======================

export async function assignLeadsToUser(
  user_id: number,
  lead_ids: number[],
): Promise<AssignLeadsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/crm/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        lead_id: lead_ids,
      }),
    });

    const result = await res.json();

    updateTag(CACHE_TAGS.CRM_LEADS);
    updateTag(CACHE_TAGS.CRM_ACTIVITIES);
    updateTag(CACHE_TAGS.CRM_TODAY_FOLLOWUPS);
    updateTag(CACHE_TAGS.CRM_NOTIFICATIONS);
    revalidatePath("/crm/today-follow-ups");
    revalidatePath("/crm/lead-activities");

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error assigning leads");
    }
  }
}
