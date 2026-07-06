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

export interface RoleInfo {
  id: number;
  name: string;
  display_name: string | null;
}

export interface RolesPowerStep {
  id: number;
  role_id: number;
  workflow_type: number;
  power: number;
  min_amount: number;
  status: number;
  role: RoleInfo;
}

export interface RolesPowerListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    steps: RolesPowerStep[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleRolesPowerResponse {
  success: boolean;
  message: string;
  code: number;
  data: RolesPowerStep | null;
  errors?: Record<string, string[]>;
}

export interface ReorderRolesPowerResponse {
  success: boolean;
  message: string;
  code: number;
  data: null;
  errors?: Record<string, string[]>;
}

export interface ReorderPayload {
  steps: { id: number; power: number }[];
}

// =======================
// GET ROLES POWER (CACHED)
// =======================

export async function getRolesPowerCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<RolesPowerListResponse | null> {
  "use cache";
  cacheTag("inventory-roles-power-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/roles-power?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No roles power steps found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (res.status === 403) {
      console.warn("Forbidden: You do not have permission.");
      return null;
    }

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
      console.error("Service error:", "Error fetching roles power steps");
      return null;
    }
  }
}

// =======================
// GET ROLES POWER WRAPPER
// =======================

export async function getRolesPower(
  params: Record<string, unknown> = {},
): Promise<RolesPowerListResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const cachedResult = await getRolesPowerCached(token, params);

  if (!cachedResult) throw new Error("Failed to fetch data from cache.");

  return cachedResult;
}

// =======================
// =======================
// GET SINGLE STEP (CACHED)
// =======================

export async function getRolesPowerStepByIdCached(
  token: string,
  id: number,
): Promise<SingleRolesPowerResponse | null> {
  "use cache";
  cacheTag(`inventory-roles-power-${id}`);

  try {
    const res = await fetch(`${API_BASE}/inventory/roles-power/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn(`Roles power step ${id} not found (404).`);
      return null;
    }

    if (res.status === 401 || res.status === 403) {
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
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching roles power step");
      return null;
    }
  }
}

// =======================
// GET SINGLE STEP BY ID
// =======================

export async function getRolesPowerStepById(
  id: number,
): Promise<SingleRolesPowerResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    return await getRolesPowerStepByIdCached(token, id);
  } catch (error: unknown) {
    console.error("Error in getRolesPowerStepById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch roles power step");
    } else {
      throw new Error("Failed to fetch roles power step");
    }
  }
}

// =======================
// CREATE ROLES POWER STEP
// =======================

export async function createRolesPowerStep(
  payload: Record<string, unknown>,
): Promise<SingleRolesPowerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/roles-power`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    updateTag("inventory-roles-power-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createRolesPowerStep:", error);
      throw new Error(error.message || "Failed to create roles power step");
    } else {
      throw new Error("Failed to create roles power step");
    }
  }
}

// =======================
// UPDATE ROLES POWER STEP
// =======================

export async function updateRolesPowerStep(
  id: number,
  payload: Record<string, unknown>,
): Promise<SingleRolesPowerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/roles-power/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    updateTag("inventory-roles-power-list");
    updateTag(`inventory-roles-power-${id}`);
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateRolesPowerStep:", error);
      throw new Error(error.message || "Failed to update roles power step");
    } else {
      throw new Error("Failed to update roles power step");
    }
  }
}

// =======================
// BULK REORDER ROLES POWER STEPS
// =======================

export async function reorderRolesPowerSteps(
  payload: ReorderPayload,
): Promise<ReorderRolesPowerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/roles-power/reorder`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    updateTag("inventory-roles-power-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in reorderRolesPowerSteps:", error);
      throw new Error(error.message || "Failed to reorder roles power steps");
    } else {
      throw new Error("Failed to reorder roles power steps");
    }
  }
}
