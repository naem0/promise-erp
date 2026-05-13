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

export interface JoinType {
  id: number;
  title: string;
  status: number;
}

export interface JoinsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_joins: number;
    joins: JoinType[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleJoinResponse {
  success: boolean;
  message: string;
  code: number;
  data: JoinType | null;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET joins (CACHED)
// =======================

export async function getJoinsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<JoinsResponse | null> {
  "use cache";
  cacheTag("joins-list");

  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/joins?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("Error in getJoinsCached:", error);
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Failed to fetch joins");
      return null;
    }
  }
}

// =======================
// GET joins WRAPPER
// =======================

export async function getJoins(
  params: Record<string, unknown> = {}
): Promise<JoinsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getJoinsCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE JOIN
// =======================

export async function getJoinById(id: number): Promise<SingleJoinResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  try {
    const res = await fetch(`${API_BASE}/joins/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch join Status: ${res.status} ${res.statusText}`
      );
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("Error in getJoinById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch join");
    } else {
      throw new Error("Failed to fetch join");
    }
  }
}

// =======================
// CREATE JOIN
// =======================

export interface JoinFormData {
  title: string;
  status: number;
}

export async function createJoin(
  formData: JoinFormData
): Promise<SingleJoinResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const res = await fetch(`${API_BASE}/joins`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    updateTag("joins-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in createJoin:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create join");
    }
  }
}

// =======================
// UPDATE JOIN
// =======================

export interface JoinUpdateFormData {
  title: string;
  status: number;
}

export async function updateJoin(
  id: number,
  updateData: JoinUpdateFormData
): Promise<SingleJoinResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const res = await fetch(`${API_BASE}/joins/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await res.json();

    updateTag("joins-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in updateJoin:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to update join");
    }
  }
}

// =======================
// DELETE JOIN
// =======================

export async function deleteJoin(id: number): Promise<SingleJoinResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const res = await fetch(`${API_BASE}/joins/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    updateTag("joins-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteJoin:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete join");
    }
  }
}
