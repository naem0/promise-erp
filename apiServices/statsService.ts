"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface Stats {
  id: number;
  title: string;
  count: string;
  image?: string | null;
  status: number;
  type: "achievement_stat" | "hero_stat" | "opportunity_stat" | string;
}

export interface StatsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_stats: number;
    stats: Stats[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleStatsResponse {
  success: boolean;
  message: string;
  code: number;
  data?: Stats;
  errors?: Record<string, string[] | string>;
}

export interface StatsSingleResponse {
  success: boolean;
  message: string;
  data: Stats;
}

// =======================
// GET STATS (CACHED)
// =======================

export async function getStatsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<StatsResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.STATS);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/stats?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No stats found (404). Returning empty list.");
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
    console.error("getStatsCached error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch statistics");
  }
}

// =======================
// GET STATS WRAPPER
// =======================

export async function getStats(
  params: Record<string, unknown> = {},
): Promise<StatsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }
  try {
    const cachedResult = await getStatsCached(token, params);
    if (!cachedResult) {
      throw new Error("Failed to fetch statistics");
    }
    return cachedResult;
  } catch (error: unknown) {
    console.error("getStats error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}

// =======================
// GET SINGLE STAT
// =======================

export async function getStatById(
  id: number,
): Promise<SingleStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/stats/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      console.warn("No stat found (404). Returning null.");
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
    console.error("Error in getStatById:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to fetch stat");
    }
  }
}


// =======================
// CREATE STAT
// =======================

export async function createStat(
  formData: FormData,
): Promise<SingleStatsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/stats`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.STATS);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createStat:", error);
      throw error;
    } else {
      throw new Error("Failed to create stat");
    }
  }
}


// =======================
// UPDATE STAT
// =======================

export async function updateStat(
  id: number,
  formData: FormData,
): Promise<SingleStatsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/stats/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.STATS);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateStat:", error);
      throw error;
    } else {
      throw new Error("Failed to update stat");
    }
  }
}


// =======================
// DELETE STAT
// =======================

export async function deleteStat(
  id: number,
): Promise<SingleStatsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/stats/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.STATS);
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteStat:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to delete stat");
    }
  }
}


