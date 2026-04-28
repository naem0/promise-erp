"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface Designation {
  id: number;
  name: string;
  status_text: string;
  created_at: string;
}

export interface DesignationsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_designations: number;
    designations: Designation[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleDesignationResponse {
  success: boolean;
  message: string;
  code: number;
  data: Designation;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET DESIGNATIONS (CACHED)
// =======================

export async function getDesignationsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<DesignationsResponse> {
  "use cache";
  cacheTag("designations-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/designations?${urlParams.toString()}`, {
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
      throw new Error("Error fetching designations");
    }
  }
}

// =======================
// GET DESIGNATIONS WRAPPER
// =======================

export async function getDesignations(
  params: Record<string, unknown> = {},
): Promise<DesignationsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  return getDesignationsCached(token, params);
}

// =======================
// GET SINGLE DESIGNATION
// =======================

export async function getDesignationById(
  id: number,
): Promise<SingleDesignationResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/designations/${id}`, {
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
    console.error("Error in getDesignationById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch designation");
    } else {
      throw new Error("Failed to fetch designation");
    }
  }
}

// =======================
// CREATE DESIGNATION
// =======================

export async function createDesignation(
  data: { name: string; status: number },
): Promise<SingleDesignationResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/designations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    updateTag("designations-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createDesignation:", error);
      throw new Error(error.message || "Failed to create designation");
    } else {
      throw new Error("Failed to create designation");
    }
  }
}

// =======================
// UPDATE DESIGNATION
// =======================

export async function updateDesignation(
  id: number,
  data: { name: string; status: number },
): Promise<SingleDesignationResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/designations/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    updateTag("designations-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateDesignation:", error);
      throw new Error(error.message || "Failed to update designation");
    } else {
      throw new Error("Failed to update designation");
    }
  }
}

// =======================
// TOGGLE DESIGNATION STATUS
// =======================

export async function toggleDesignationStatus(
  id: number,
): Promise<SingleDesignationResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/designations/${id}/toggle-status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("designations-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in toggleDesignationStatus:", error);
      throw new Error(error.message || "Failed to toggle designation status");
    } else {
      throw new Error("Failed to toggle designation status");
    }
  }
}

// =======================
// DELETE DESIGNATION
// =======================

export async function deleteDesignation(
  id: number,
): Promise<SingleDesignationResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/designations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("designations-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteDesignation:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to delete designation");
    } else {
      throw new Error("Failed to delete designation");
    }
  }
}
