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

export interface Unit {
  id: number;
  name: string;
  full_name: string;
  status: number;
}

export interface UnitsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_units: number;
    units: Unit[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleUnitResponse {
  success: boolean;
  message: string;
  code: number;
  data: Unit;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET UNITS (CACHED)
// =======================

export async function getUnitsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<UnitsResponse | null> {
  "use cache";
  cacheTag("units-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/inventory/units?${urlParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    if (res.status === 404) {
        console.warn("Units not found (404). Returning empty list.");
        return null;
    }   
    if (res.status === 401) {
        console.warn("Unauthorized (401) when fetching units. Returning null.");
        return null;
    }
    if (res.status === 403) {
        console.warn("Forbidden (403) when fetching units. Returning null.");
        return null;
    }   
    const result = await res.json();

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching units");
      return null;
    }
  }
}

// =======================
// GET UNITS WRAPPER
// =======================

export async function getUnits(
  params: Record<string, unknown> = {},
): Promise<UnitsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getUnitsCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE UNIT
// =======================

export async function getUnitById(
  id: number,
): Promise<SingleUnitResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/units/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    if (res.status === 404) {
        console.warn(`Unit with ID ${id} not found (404).`);
        return null;    
    }

    if (res.status === 401) {
        console.warn("Unauthorized (401) when fetching unit. Returning null.");
        return null;
    }
    if (res.status === 403) {
        console.warn("Forbidden (403) when fetching unit. Returning null.");
        return null;
    }

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in getUnitById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch unit");
    } else {
      throw new Error("Failed to fetch unit");
    }
  }
}

// =======================
// CREATE UNIT
// =======================

export async function createUnit(
  formData: FormData,
): Promise<SingleUnitResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/units`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("units-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createUnit:", error);
      throw new Error(error.message || "Failed to create unit");
    } else {
      throw new Error("Failed to create unit");
    }
  }
}

// =======================
// UPDATE UNIT
// =======================

export async function updateUnit(
  id: number,
  formData: FormData,
): Promise<SingleUnitResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    // The user specified POST/inventory/units/{id} for update
    const res = await fetch(`${API_BASE}/inventory/units/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("units-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateUnit:", error);
      throw new Error(error.message || "Failed to update unit");
    } else {
      throw new Error("Failed to update unit");
    }
  }
}

// =======================
// DELETE UNIT
// =======================

export async function deleteUnit(
  id: number,
): Promise<SingleUnitResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/units/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("units-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteUnit:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete unit");
    }
  }
}
